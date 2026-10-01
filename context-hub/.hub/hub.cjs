#!/usr/bin/env node
// Context Hub maintainer — zero dependencies.
// Usage: node .hub/hub.cjs [all|ingest|index|check] [--quiet]
//   ingest  sort inbox/* (and loose root items) into category folders — never overwrites, never deletes
//   index   rebuild CONTEXT.md + manifest.json (skips the write when nothing changed)
//   check   report problems only; exit 1 on credentials or duplicates
//   all     ingest + index (default; what hub.cmd and the Claude Code SessionStart hook run)
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const QUIET = process.argv.includes("--quiet");
const CMD = process.argv.slice(2).find((a) => !a.startsWith("--")) || "all";
const log = (...a) => { if (!QUIET) console.log(...a); };

const CATEGORIES = {
  notes: "Preferences, decisions, prompts, rules (md/txt)",
  docs: "Specs, references, data (pdf/office/json/csv/yaml)",
  tools: "Single-file HTML apps & libraries kept as reference",
  code: "Snippets & scripts",
  media: "Images, audio, video, fonts",
};
const EXT = {
  notes: "md markdown mdc txt rst org adoc",
  docs: "pdf doc docx ppt pptx xls xlsx odt csv tsv json jsonl yaml yml toml xml ini",
  tools: "html htm",
  code: "js cjs mjs ts tsx jsx py ps1 psm1 sh bat cmd css scss sass less sql go rs java kt cs cpp c h lua gd rb php swift vue svelte",
  media: "png jpg jpeg gif webp svg ico bmp avif mp3 wav ogg mp4 webm mov ttf otf woff woff2",
};
const EXT2CAT = {};
for (const [cat, list] of Object.entries(EXT)) for (const e of list.split(" ")) EXT2CAT["." + e] = cat;
const BINARY = new Set(".pdf .doc .docx .ppt .pptx .xls .xlsx .odt .png .jpg .jpeg .gif .webp .ico .bmp .avif .mp3 .wav .ogg .mp4 .webm .mov .ttf .otf .woff .woff2".split(" "));

const INBOX = "inbox", QUAR = "_quarantine", ARCHIVE = "archive";
const RESERVED = new Set([...Object.keys(CATEGORIES), INBOX, QUAR, ARCHIVE]);
const ROOT_FILES = new Set(["README.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md", "CONTEXT.md", "manifest.json", "hub.cmd"]);
const OS_JUNK = new Set(["desktop.ini", "Thumbs.db", ".DS_Store"]);
const BIG_TOKENS = 8000;

const SECRET_NAME = /^(\.env(\..+)?|.+\.(pem|key|p12|pfx|kdbx)|id_(rsa|ed25519|ecdsa)|credentials(\.\w+)?)$/i;
const SAFE_NAME = /\.(example|sample|template)$/i;
const SECRET_BODY = [
  /AKIA[0-9A-Z]{16}/, /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{24,}/, /\bgh[pousr]_[A-Za-z0-9]{36,}/,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}/, /\bAIza[0-9A-Za-z_-]{35}\b/, /\bhf_[A-Za-z0-9]{30,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const exists = (p) => { try { fs.lstatSync(p); return true; } catch { return false; } };
const sha = (buf) => crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12);
const extOf = (p) => path.extname(p).toLowerCase();

// Yields files under dir, skipping dot-entries, OS junk and node_modules/.git.
function* walk(dir) {
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    if (e.name.startsWith(".") || OS_JUNK.has(e.name) || e.name === "node_modules") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) yield p;
  }
}

function secretReason(p) {
  const base = path.basename(p);
  if (SECRET_NAME.test(base) && !SAFE_NAME.test(base)) return "sensitive filename";
  if (BINARY.has(extOf(p))) return null;
  try {
    if (fs.statSync(p).size > 5e6) return null;
    const txt = fs.readFileSync(p, "utf8");
    return SECRET_BODY.some((r) => r.test(txt)) ? "content looks like a credential" : null;
  } catch { return null; }
}

function uniqueDest(dir, name) {
  let d = path.join(dir, name);
  const ext = path.extname(name), stem = name.slice(0, name.length - ext.length);
  for (let i = 2; exists(d); i++) d = path.join(dir, `${stem} (${i})${ext}`);
  return d;
}

function classifyDir(files) {
  if (!files.length) return null;
  if (files.some((f) => /^index\.html?$/i.test(path.basename(f)))) return "tools";
  const tally = {};
  for (const f of files) { const c = EXT2CAT[extOf(f)] || "docs"; tally[c] = (tally[c] || 0) + 1; }
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
}

// ---------- ingest ----------
function ingest() {
  fs.mkdirSync(path.join(ROOT, INBOX), { recursive: true });
  const sources = [];
  for (const e of fs.readdirSync(path.join(ROOT, INBOX), { withFileTypes: true })) {
    if (!e.name.startsWith(".") && !OS_JUNK.has(e.name)) sources.push({ p: path.join(ROOT, INBOX, e.name), e });
  }
  // Loose items dropped straight into the hub root are treated like inbox items.
  for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (e.name.startsWith(".") || OS_JUNK.has(e.name) || RESERVED.has(e.name) || ROOT_FILES.has(e.name)) continue;
    sources.push({ p: path.join(ROOT, e.name), e });
  }

  let bySize = null; // lazy size -> [paths] map of already-filed files, for duplicate detection
  const twinOf = (src) => {
    if (!bySize) {
      bySize = new Map();
      for (const c of Object.keys(CATEGORIES)) for (const f of walk(path.join(ROOT, c))) {
        const s = fs.statSync(f).size; bySize.set(s, [...(bySize.get(s) || []), f]);
      }
    }
    const cands = bySize.get(fs.statSync(src).size) || [];
    if (!cands.length) return null;
    const h = sha(fs.readFileSync(src));
    return cands.find((c) => sha(fs.readFileSync(c)) === h) || null;
  };

  const moved = [], kept = [];
  for (const { p: src, e } of sources) {
    const name = e.name;
    const files = e.isDirectory() ? [...walk(src)] : [src];
    try {
      const secret = files.map(secretReason).find(Boolean);
      if (secret) {
        fs.mkdirSync(path.join(ROOT, QUAR), { recursive: true });
        const d = uniqueDest(path.join(ROOT, QUAR), name);
        fs.renameSync(src, d);
        moved.push(`${name} -> ${rel(d)}  [!] ${secret}`);
        continue;
      }
      const cat = e.isDirectory() ? classifyDir(files) : EXT2CAT[extOf(name)] || "docs";
      if (!cat) { kept.push(`${rel(src)}/ is empty — safe to delete`); continue; }
      if (e.isFile()) {
        const twin = twinOf(src);
        if (twin) { kept.push(`${rel(src)} is identical to ${rel(twin)} — safe to delete`); continue; }
      }
      fs.mkdirSync(path.join(ROOT, cat), { recursive: true });
      const d = uniqueDest(path.join(ROOT, cat), name);
      fs.renameSync(src, d);
      moved.push(`${name} -> ${rel(d)}`);
    } catch (err) {
      kept.push(`${rel(src)} not moved (${err.code || err.message})`);
    }
  }
  return { moved, kept };
}

// ---------- describe ----------
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'", mdash: "—", ndash: "–" };
const decode = (s) => s.replace(/&(#?\w+);/g, (m, k) => ENT[k] ?? (k[0] === "#" ? String.fromCodePoint(parseInt(k.slice(1), 10) || 32) : m));
const clean = (s, n = 180) => {
  const t = decode(String(s).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
};

function frontmatter(txt) {
  const m = txt.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
  const fm = {};
  if (m) for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) fm[kv[1].toLowerCase()] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return { fm, body: m ? txt.slice(m[0].length) : txt };
}

function describe(p, buf) {
  const ext = extOf(p), base = path.basename(p);
  const out = { title: base, summary: "", pin: false, tags: [] };
  if (BINARY.has(ext) || buf.length > 4e6) return out;
  const txt = buf.toString("utf8");
  if (ext === ".html" || ext === ".htm" || ext === ".svg") {
    const t = txt.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const d = txt.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)/i)
           || txt.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const heads = [...new Set([...txt.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)].map((m) => clean(m[1], 40)).filter(Boolean))].slice(0, 5);
    if (t && clean(t[1])) out.title = clean(t[1], 90);
    out.summary = d && d[1].trim() ? clean(d[1]) : heads.length ? "Sections: " + heads.join(" · ") : "";
  } else if ([".md", ".markdown", ".mdc", ".txt", ".rst", ".org", ".adoc"].includes(ext)) {
    const { fm, body } = frontmatter(txt);
    const h = body.match(/^#{1,2}\s+(.+)$/m);
    const para = body.split(/\r?\n/).map((l) => l.trim()).find((l) => l && !/^(#|---|```|<!--|\||>|!\[)/.test(l));
    out.title = clean(fm.title || (h && h[1]) || base, 90);
    out.summary = clean(fm.summary || fm.description || para || "");
    out.pin = /^(true|yes|1)$/i.test(fm.pin || "");
    out.tags = (fm.tags || "").replace(/[[\]]/g, "").split(/[,\s]+/).filter(Boolean);
  } else if (ext === ".json") {
    try {
      const j = JSON.parse(txt);
      out.summary = Array.isArray(j) ? `JSON array, ${j.length} items` : "JSON keys: " + Object.keys(j).slice(0, 10).join(", ");
    } catch { out.summary = "JSON (unparseable)"; }
  } else {
    const c = txt.match(/^\s*(?:\/\/+|#+|\/\*+|--|<!--|;|REM\s)\s*(.{8,})$/im);
    if (c) out.summary = clean(c[1].replace(/\*\/\s*$|-->\s*$/, ""));
  }
  return out;
}

// ---------- index ----------
function scan() {
  const files = [], dupes = [], empties = [], loose = [];
  const byHash = new Map();
  for (const cat of [...Object.keys(CATEGORIES), INBOX, ARCHIVE]) {
    for (const f of walk(path.join(ROOT, cat))) {
      const buf = fs.readFileSync(f), st = fs.statSync(f);
      const h = sha(buf), binary = BINARY.has(extOf(f));
      const entry = { path: rel(f), category: cat, ...describe(f, buf), bytes: st.size,
        tokens: binary ? null : Math.ceil(st.size / 4), sha1: h, modified: st.mtime.toISOString().slice(0, 10) };
      files.push(entry);
      if (cat !== ARCHIVE) byHash.set(h, [...(byHash.get(h) || []), entry.path]);
    }
  }
  for (const list of byHash.values()) if (list.length > 1) dupes.push(list);
  for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (e.name.startsWith(".") || OS_JUNK.has(e.name) || RESERVED.has(e.name) || ROOT_FILES.has(e.name)) continue;
    const p = path.join(ROOT, e.name);
    if (e.isDirectory() && ![...walk(p)].length) empties.push(e.name + "/");
    else loose.push(e.name + (e.isDirectory() ? "/" : ""));
  }
  let quarantined = 0;
  for (const _ of walk(path.join(ROOT, QUAR))) quarantined++;
  return { files, dupes, empties, loose, quarantined };
}

const kb = (b) => (b < 1024 ? `${b} B` : `${Math.round(b / 1024)} KB`);
const tok = (t) => (t == null ? "binary" : t < 1000 ? `~${t} tok` : `~${Math.round(t / 1000)}k tok`);
const cell = (s) => String(s).replace(/\|/g, "\\|");
const href = (p) => encodeURI(p).replace(/\(/g, "%28").replace(/\)/g, "%29");
const link = (p) => `[${cell(p.split("/").slice(1).join("/"))}](${href(p)})`;

function row(f) {
  const what = f.summary ? `**${cell(f.title)}** — ${cell(f.summary)}` : `**${cell(f.title)}**`;
  const warn = f.tokens != null && f.tokens > BIG_TOKENS ? " ⚠" : "";
  return `| ${link(f.path)} | ${what} | ${kb(f.bytes)} · ${tok(f.tokens)}${warn} |`;
}

function render(s, stamp) {
  const live = s.files.filter((f) => f.category !== ARCHIVE);
  const total = live.reduce((a, f) => a + (f.tokens || 0), 0);
  const L = [
    "# Context Hub — Index",
    "",
    "<!-- GENERATED by .hub/hub.cjs — do not edit by hand; drop files in inbox/ and run hub.cmd -->",
    `Updated ${stamp} · ${live.length} files · ${tok(total)} if every file were read in full.`,
    "",
    "**Use:** pick rows below and open only those files. ⚠ = over 8k tokens: grep or read slices. Rules: [AGENTS.md](AGENTS.md).",
    "",
  ];
  const pinned = live.filter((f) => f.pin);
  L.push("## Pinned — standing preferences, read when starting work here", "");
  L.push(pinned.length ? pinned.map((f) => `- [${cell(f.title)}](${href(f.path)}) — ${cell(f.summary)}`).join("\n")
                       : "_None yet. Add `pin: true` to a note's frontmatter._", "");
  const empty = [];
  for (const [cat, blurb] of Object.entries(CATEGORIES)) {
    const rows = live.filter((f) => f.category === cat).sort((a, b) => a.path.localeCompare(b.path));
    if (!rows.length) { empty.push(`${cat}/`); continue; }
    L.push(`## ${cat}/ — ${blurb}`, "", "| File | About | Size |", "|---|---|---|", ...rows.map(row), "");
  }
  if (empty.length) L.push(`_Empty: ${empty.join(", ")}_`, "");
  const inbox = live.filter((f) => f.category === INBOX);
  if (inbox.length) L.push("## inbox/ — not yet sorted (run hub.cmd)", "", ...inbox.map((f) => `- ${f.path}`), "");
  const arch = s.files.length - live.length;
  if (arch) L.push(`## archive/ — ${arch} superseded file(s); open only if asked`, "");
  const warn = [
    ...s.dupes.map((d) => `- Duplicate content: ${d.join(" = ")}`),
    ...s.empties.map((d) => `- Empty folder: ${d} — safe to delete`),
    ...s.loose.map((d) => `- Unsorted item at hub root: ${d} — run hub.cmd`),
    ...(s.quarantined ? [`- ${s.quarantined} file(s) in _quarantine/ (possible credentials) — do NOT read; user must review`] : []),
  ];
  if (warn.length) L.push("## Warnings", "", ...warn, "");
  return L.join("\n");
}

function index() {
  const s = scan();
  const fingerprint = sha(JSON.stringify([s.files.map((f) => [f.path, f.sha1, f.title, f.summary, f.pin]), s.dupes, s.empties, s.loose, s.quarantined]));
  const manPath = path.join(ROOT, "manifest.json");
  let prev = null; try { prev = JSON.parse(fs.readFileSync(manPath, "utf8")); } catch {}
  if (prev && prev.fingerprint === fingerprint && exists(path.join(ROOT, "CONTEXT.md"))) return { s, changed: false };
  const now = new Date();
  const stamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
  fs.writeFileSync(path.join(ROOT, "CONTEXT.md"), render(s, stamp));
  const manifest = { generated: now.toISOString(), fingerprint, root: ROOT,
    totals: { files: s.files.length, bytes: s.files.reduce((a, f) => a + f.bytes, 0) },
    files: s.files, warnings: { duplicates: s.dupes, emptyFolders: s.empties, unsorted: s.loose, quarantined: s.quarantined } };
  fs.writeFileSync(manPath, JSON.stringify(manifest, null, 1));
  return { s, changed: true };
}

// ---------- main ----------
try {
  if (CMD === "check") {
    const s = scan();
    const secrets = s.files.filter((f) => secretReason(path.join(ROOT, f.path)));
    for (const f of secrets) console.log(`[!] possible credential: ${f.path}`);
    for (const d of s.dupes) console.log(`dup: ${d.join(" = ")}`);
    for (const d of s.empties) console.log(`empty: ${d}`);
    for (const d of s.loose) console.log(`unsorted: ${d}`);
    for (const f of s.files) if (f.tokens > BIG_TOKENS) console.log(`large: ${f.path} (${tok(f.tokens)})`);
    process.exitCode = secrets.length || s.dupes.length ? 1 : 0;
  } else {
    if (CMD === "all" || CMD === "ingest") {
      const { moved, kept } = ingest();
      moved.forEach((m) => log("moved   " + m));
      kept.forEach((k) => log("skipped " + k));
      if (!moved.length && !kept.length) log("inbox empty");
    }
    if (CMD === "all" || CMD === "index") {
      const { s, changed } = index();
      log(`${changed ? "indexed" : "index unchanged"}: ${s.files.length} files` +
        (s.dupes.length ? `, ${s.dupes.length} duplicate set(s)` : "") +
        (s.empties.length ? `, ${s.empties.length} empty folder(s)` : ""));
    }
    if (!["all", "ingest", "index"].includes(CMD)) { console.error(`unknown command: ${CMD}`); process.exitCode = 2; }
  }
} catch (err) {
  console.error("hub: " + (err && err.message));
  process.exitCode = 1;
}
