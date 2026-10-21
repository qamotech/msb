#!/usr/bin/env node
// Claude Code hooks for token/efficiency savings. Usage: node claude-hooks.cjs <read-guard|html-audit|session-tips>
// Reads hook JSON on stdin; emits hook JSON on stdout. Never blocks on its own errors.
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const mode = process.argv[2];
const out = (o) => { process.stdout.write(JSON.stringify(o)); process.exit(0); };
const ctx = (event, text) => out({ hookSpecificOutput: { hookEventName: event, additionalContext: text } });

let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
const ti = input.tool_input || {};

// Load window.AI from Claude-Optimizer.html so the audit rules have one source of truth.
function loadAI() {
  const html = fs.readFileSync(path.join(__dirname, "..", "Claude-Optimizer.html"), "utf8");
  const m = html.match(/const AI=\(\(\)=>\{[\s\S]*?\n\}\)\(\);/);
  if (!m) throw new Error("AI block not found");
  const sandbox = {
    est: (s) => Math.ceil((String(s).match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || []).length * 1.15 + String(s).length * 0.02),
    FILLER: /\b(please|kindly|just|really|very|basically|actually|simply)\b\s*/gi,
    $: () => ({ textContent: "{}" }), JSON, Math, Set, Object, String,
  };
  vm.createContext(sandbox);
  vm.runInContext(m[0] + "\nthis.AI=AI;", sandbox);
  return sandbox.AI;
}

try {
  if (mode === "read-guard") {
    // Warn when reading a big file with no offset/limit: nudge to Grep + slice instead.
    const f = ti.file_path;
    if (!f || ti.limit || ti.offset || !fs.existsSync(f)) out({});
    const st = fs.statSync(f);
    if (st.size < 60000 || /\.(png|jpe?g|gif|webp|pdf|ipynb)$/i.test(f)) out({});
    const lines = fs.readFileSync(f, "utf8").split("\n").length;
    ctx("PreToolUse", `Token guard: ${path.basename(f)} is ${lines} lines (~${Math.round(st.size / 4 / 1000)}k tokens). If you only need part of it, Grep for line numbers first, then Read with offset/limit.`);
  }

  if (mode === "html-audit") {
    const f = ti.file_path || (input.tool_response || {}).filePath;
    if (!f || !/\.html?$/i.test(f) || !fs.existsSync(f)) out({});
    const r = loadAI().audit(fs.readFileSync(f, "utf8"));
    if (!r.counts.HIGH && r.counts.MED <= 3) out({});
    const top = r.findings.filter((x) => x.sev !== "LOW").slice(0, 8)
      .map((x) => `[${x.sev}] L${x.line} ${x.msg} → ${x.fix}`).join("\n");
    ctx("PostToolUse", `Auto-audit ${path.basename(f)}: score ${r.score}/100, HIGH ${r.counts.HIGH}, MED ${r.counts.MED}.\n${top}\nFix HIGH items before calling this done.`);
  }

  if (mode === "session-tips") {
    ctx("SessionStart", "Efficiency rules: scope searches to one subfolder; batch independent tool calls; Grep before Read, read slices of big files; prefer Edit over Write; don't re-read after editing; for new single-file apps use the window.AI pipeline in Claude-Optimizer.html (spec → scaffold → audit → gates).");
  }
} catch { /* hooks must never break the session */ }
out({});
