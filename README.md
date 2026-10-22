# 🚌💎 qamotech/msb — App Bundle + Magic School Bus Classroom Portal

**Two projects, one repo:** a large collection of single-file HTML web apps (games, tools, business utilities, kids' apps), plus a **Magic School Bus virtual classroom portal** built for homeschool use.

🏷️ Maintained at [qamotech/msb](https://github.com/qamotech/msb)

## ✨ What is here

### 🚌 MSB Classroom Portal (start at `index.html`)
"The Magic School Bus Virtual Classroom" — classroom hubs, worksheet generators, science packets, and electricity-lab activities.
- `index.html` — the portal homepage (nav, station cards, doc tabs)
- `modules/` — the actual classroom pages: classic classroom, galactic lab, educator hub, science packets, electricity overview, worksheet generator

### 💎 App bundle — single-file web apps
Dozens of self-contained HTML apps at the repo root and in three collections:
- **Root apps** — large standalone apps: `TaxTrail.html`, `Puddlewick-Isle.html`, `ContinuumOS.html`, `AgentBox-OS.html`, `NeuroPulse-Cyberdeck.html`, `Mechaturtle Command Interface.html`, `Infinite Growth -- Prospecting and Networking Command Center.html`, `ai-universe-guide.html`, `Cartograph.html`, `Orrery.html`, and more
- `N8DEV/` — curated collections by category:
  - `N8DEV/Arcade/` — games (MiyagiThrow, Combat Cars, Shipment-8Bit, blob-bash-royale, Neon Pong, Qamelot Conquest, Mecha Strike…)
  - `N8DEV/Business/` — Clark Family Projects + contractor tools (invoice-forge, tool belt, pulse productivity, CFP index…)
  - `N8DEV/Dev/` — dev tools, editors, SEO dashboards, kid-safe builders
  - `N8DEV/Kids/` — KidHub-64, KidsBeat, Wondertown Stories, math/science hubs
- `standalone-sites/` — flat single-file apps (`CCars.html`, `seoDash.html`, `turtlebot-main.html`, `CMT.html`, `MT.html`…) plus `standalone-sites/apps/<name>/` folders, each with a `launch.html` redirect to its canonical copy
- `Downloads-Launcher.html` — a launcher page cataloguing the bundle (App Store–style grid)
- `QamoTech GitHub Sites Portal.html` — portal of GitHub Pages sites

### 🛠️ Supporting folders
- `context-hub/` — AI context hub (`CONTEXT.md`, manifests, notes, tools)
- `scripts/` — Python/Node/PowerShell build, audit, and evolution-runner scripts
- `repo-documentation/` — CYBER-COUNT CALCUN8R v4.2 app package (index.html + favicon.svg + badge)
- `AGENTS.md` / `CLAUDE.md` — workspace conventions for AI assistants working in this repo

> Note: duplicate copies across `N8DEV/`, `standalone-sites/`, and `standalone-sites/apps/` are being consolidated — canonical copies live where a portal/launcher links to them; `launch.html` files in `apps/<name>/` redirect to the canonical file.

## 🚀 Local setup

```sh
git clone https://github.com/qamotech/msb.git
cd msb
python -m http.server 8000
```

Then open `http://localhost:8000/index.html` for the classroom portal, or any `.html` file directly for an app. No build step, no dependencies — every app is a single HTML file.

## 🗂️ File map

```
index.html                        MSB classroom portal homepage
modules/                          Classroom pages + shared css/js
  msb-classic-classroom.html
  msb-galactic-lab.html
  frizzle-educator-hub.html
  MSB_Science_Packets_Complete.html
  electricity-overview.html
  frizz-worksheet-generator.html
*.html (repo root)                ~40 standalone single-file apps
Downloads-Launcher.html           App-bundle launcher grid
QamoTech GitHub Sites Portal.html Sites portal page
N8DEV/Arcade/                     Games collection
N8DEV/Business/                   Contractor/business tools
N8DEV/Dev/                        Dev tools + builders
N8DEV/Kids/                       Kids' apps
standalone-sites/                 Flat apps + apps/<name>/launch.html redirects
context-hub/                      AI context hub
scripts/                          Build/audit helper scripts
AGENTS.md                         Repo house rules (AI assistants read first)
```

## ⚙️ Notes

- Static-only: everything runs in the browser from the file system or a simple static server.
- GitHub Pages–friendly: open any `.html` directly; no routing or bundling required.
- House rule from `AGENTS.md`: animations stay lively — no `prefers-reduced-motion` kills.
- Franchise-related classroom assets (Magic School Bus) are for personal/educational use; review attribution before redistributing.
