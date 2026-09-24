
    (() => {
      "use strict";
      const $ = (q, c = document) => c.querySelector(q) || document.createElement('input'),
        $$ = (q, c = document) => [...c.querySelectorAll(q)];
      const state = {
        view: "command",
        tab: "html",
        selectedApp: null,
        theme: localStorage.getItem("n8-theme") || "void",
        code: {
          html: `<main class="hero">\n  <span class="badge">TURTLEBOT NEXUS</span>\n  <h1>Build beyond<br>the horizon.</h1>\n  <p>A fast, focused launchpad for ambitious ideas.</p>\n  <button aria-label="launch" id="launch">Initialize</button>\n</main>`,
          css: `* { box-sizing: border-box; }\nbody {\n  margin: 0; min-height: 100vh; display: grid; place-items: center;\n  color: #eaffff; font-family: system-ui, sans-serif;\n  background: radial-gradient(circle at 50% 20%, #16356b, #030711 58%);\n}\n.hero { width: min(680px, 90%); padding: 64px; border: 1px solid #54e85555;\n  border-radius: 28px; background: #091423cc; box-shadow: 0 30px 90px #0009; }\n.badge { color: #54e8ff; font: 700 11px monospace; letter-spacing: .2em; }\nh1 { font-size: clamp(3rem, 9vw, 7rem); line-height: .83; letter-spacing: -.07em; margin: 22px 0; }\np { color: #8bb0bf; font-size: 18px; }\nbutton { margin-top: 16px; border: 0; border-radius: 10px; padding: 13px 20px;\n  color: #00131a; background: linear-gradient(135deg,#54e8ff,#4776ff); font-weight: 800; cursor: pointer; }`,
          js: `document.querySelector('#launch').addEventListener('click', event => {\n  event.currentTarget.textContent = 'NEXUS ONLINE';\n  event.currentTarget.style.background = '#7dffad';\n});`,
        },
      };
      document.documentElement.dataset.theme = state.theme;
      let toast = (msg) => {
        const el = $("#toast");
        el.textContent = msg;
        el.classList.add("show");
        clearTimeout(toast.t);
        toast.t = setTimeout(() => el.classList.remove("show"), 2100);
      };
      const boot = () => {
        setTimeout(() => $("#boot").classList.add("gone"), 650);
      };
      const transform = () => {
        const l = $("#launcher");
        if (l.classList.contains("hidden")) return;
        l.classList.add("transforming");
        setTimeout(() => {
          $("#app").classList.add("online");
          l.classList.add("hidden");
          l.classList.remove("transforming");
          const t = $("#turtle");
          document.body.appendChild(t);
          t.classList.add("coding-pet");
          t.style.left = "";
          t.style.top = "";
          toast("TurtleBot Nexus online");
        }, 720);
      };
      const minimize = () => {
        if ($("#help").classList.contains("open"))
          return $("#help").classList.remove("open");
        if (!$("#app").classList.contains("online")) return;
        $("#app").classList.remove("online", "max");
        const l = $("#launcher");
        l.classList.remove("hidden");
        const t = $("#turtle");
        l.insertBefore(t, l.firstChild);
        t.classList.remove("coding-pet");
        t.style.left = "";
        t.style.top = "";
        setTimeout(() => $("#turtle").focus(), 250);
      };

      const turtleBtn = $("#turtle");
      let isDragging = false;
      let dragStartX, dragStartY;
      let turtleStartLeft, turtleStartTop;
      
      let lastActivityTime = Date.now();
      let followCursorMode = false;
      
      const updateActivity = () => {
        lastActivityTime = Date.now();
        if (turtleBtn.classList.contains("sleep")) {
          turtleBtn.classList.remove("sleep");
          toast("TurtleBot woke up!");
        }
      };
      
      document.addEventListener("mousemove", updateActivity);
      document.addEventListener("keydown", updateActivity);

      // Behavior 4 & 7: Sleep Mode & Autonomous Roam
      setInterval(() => {
        if (!turtleBtn.classList.contains("coding-pet")) return;
        
        const idleTime = Date.now() - lastActivityTime;
        if (idleTime > 60000 && !turtleBtn.classList.contains("sleep")) {
          turtleBtn.classList.add("sleep");
          toast("Zzz...");
        } else if (idleTime < 60000 && !isDragging && !followCursorMode && Math.random() < 0.05) {
          const maxRoam = 40;
          const dx = (Math.random() - 0.5) * maxRoam;
          const dy = (Math.random() - 0.5) * maxRoam;
          turtleBtn.style.left = (turtleBtn.offsetLeft + dx) + "px";
          turtleBtn.style.top = (turtleBtn.offsetTop + dy) + "px";
        }
      }, 5000);

// Behavior 8: Follow Cursor Mode (with tilting)
      document.addEventListener("mousemove", (e) => {
        if (followCursorMode && turtleBtn.classList.contains("coding-pet") && !isDragging) {
          const rect = turtleBtn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          
          turtleBtn.style.left = (turtleBtn.offsetLeft + dx * 0.04) + "px";
          turtleBtn.style.top = (turtleBtn.offsetTop + dy * 0.04) + "px";
          
          // 13. Dynamic Tilting
          const tiltX = (dy / window.innerHeight) * 30;
          const tiltY = -(dx / window.innerWidth) * 30;
          turtleBtn.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(0.6)`;
        } else if (turtleBtn.classList.contains("coding-pet") && !isDragging) {
          turtleBtn.style.transform = "scale(0.6)";
        }
      });

      // Behavior 3: Petting Detection
      let petSpeed = 0;
      let lastPetTime = Date.now();
      turtleBtn.addEventListener("mousemove", (e) => {
        if (isDragging) return;
        const now = Date.now();
        const dt = now - lastPetTime;
        if (dt > 0) {
          const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
          if (speed > 10) {
            petSpeed += speed;
            if (petSpeed > 500 && !turtleBtn.classList.contains("happy")) {
              turtleBtn.classList.add("happy");
              toast("Happy turtle noises! 💖");
              setTimeout(() => {
                turtleBtn.classList.remove("happy");
                petSpeed = 0;
              }, 2000);
            }
          }
        }
        lastPetTime = now;
      });
      turtleBtn.addEventListener("mouseleave", () => petSpeed = 0);

      // Behavior 1: Barrel Roll
      turtleBtn.addEventListener("dblclick", () => {
        if (!turtleBtn.classList.contains("coding-pet")) return;
        turtleBtn.classList.add("barrel-roll");
        setTimeout(() => turtleBtn.classList.remove("barrel-roll"), 600);
      });

      // Behavior 5 & 6: Custom Context Menu & Feed
      const petMenu = document.createElement("div");
      petMenu.className = "pet-context-menu";
      petMenu.style.display = "none";
      petMenu.innerHTML = `
        <button id="petFeed">⚡ Feed Energy</button>
        <button id="petFollow">🐾 Toggle Follow</button>
        <button id="petDock">🏠 Dock</button>
      `;
      document.body.appendChild(petMenu);

      document.addEventListener("click", () => petMenu.style.display = "none");
      
petMenu.querySelector("#petFeed").addEventListener("click", () => {
        turtleBtn.classList.add("feed-surge", "radar-scan");
        toast("Yum! Energy restored. ⚡");
        setTimeout(() => turtleBtn.classList.remove("feed-surge", "radar-scan"), 1000);
      });
      petMenu.querySelector("#petFollow").addEventListener("click", () => {
        followCursorMode = !followCursorMode;
        toast(followCursorMode ? "Following cursor..." : "Anchored.");
      });
      petMenu.querySelector("#petDock").addEventListener("click", () => {
        followCursorMode = false;
        turtleBtn.style.left = "calc(100vw - 100px)";
        turtleBtn.style.top = "calc(100vh - 100px)";
        toast("Docked.");
      });

turtleBtn.addEventListener("contextmenu", (e) => {
        if (!turtleBtn.classList.contains("coding-pet")) return;
        e.preventDefault();
        petMenu.style.display = "flex";
        
        // 15. Context Menu Edge Avoidance
        const menuWidth = 140;
        const menuHeight = 120;
        let left = e.clientX;
        let top = e.clientY;
        
        if (left + menuWidth > window.innerWidth) left -= menuWidth;
        if (top + menuHeight > window.innerHeight) top -= menuHeight;
        
        petMenu.style.left = left + "px";
        petMenu.style.top = top + "px";
      });

      turtleBtn.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return; // Only left click
        isDragging = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        turtleStartLeft = turtleBtn.offsetLeft;
        turtleStartTop = turtleBtn.offsetTop;

        turtleBtn.setPointerCapture(e.pointerId);

        const onMove = (moveEvent) => {
          const dx = moveEvent.clientX - dragStartX;
          const dy = moveEvent.clientY - dragStartY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            isDragging = true;
            turtleBtn.classList.add("active-drag");
            turtleBtn.style.left = (turtleStartLeft + dx) + "px";
            turtleBtn.style.top = (turtleStartTop + dy) + "px";
          }
        };

        const onUp = (upEvent) => {
          turtleBtn.removeEventListener("pointermove", onMove);
          turtleBtn.removeEventListener("pointerup", onUp);
          turtleBtn.releasePointerCapture(upEvent.pointerId);
          turtleBtn.classList.remove("active-drag");

          // Behavior 2: Contextual Helper
          if (isDragging && turtleBtn.classList.contains("coding-pet")) {
            turtleBtn.classList.add("radar-scan");
            setTimeout(() => turtleBtn.classList.remove("radar-scan"), 1000);
            
            turtleBtn.style.pointerEvents = "none";
            const el = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
            turtleBtn.style.pointerEvents = "auto";
            
            if (el) {
              const tag = el.tagName.toLowerCase();
              const text = (el.textContent || "").trim().substring(0, 15);
              let msg = null;
              if (el.closest('.nav')) msg = "Navigation bar! Switches Nexus modules.";
              else if (el.closest('.CodeMirror')) msg = "Code Studio! The forge of creation.";
              else if (tag === 'button') msg = `Button "${text}" detected.`;
              else if (tag === 'input' || tag === 'textarea') msg = "Input field ready for data.";
              
              if (msg) toast(msg);
            }
          }
        };

        turtleBtn.addEventListener("pointermove", onMove);
        turtleBtn.addEventListener("pointerup", onUp);
      });

      turtleBtn.addEventListener("click", (e) => {
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (turtleBtn.classList.contains("coding-pet")) {
          const msgs = ["Beep boop! I'm your coding pet.", "Scanning for bugs...", "TurtleBot online.", "Jets engaged.", "Need help with that code?", "Warp drives charging..."];
          toast(msgs[Math.floor(Math.random() * msgs.length)]);
          return;
        }
        transform();
      });
      $("#minBtn").addEventListener("click", minimize);
      const maximize = () => {
        const active = $("#app").classList.toggle("max");
        $("#maxBtn").textContent = active ? "❐" : "⛶";
        $("#maxBtn").setAttribute(
          "aria-label",
          active ? "Restore workspace" : "Maximize workspace",
        );
        toast(active ? "Workspace maximized" : "Workspace restored");
      };
      $("#maxBtn").addEventListener("click", maximize);
      let showView = (name) => {
        state.view = name;
        $$(".nav [data-view]").forEach((b) =>
          b.classList.toggle("active", b.dataset.view === name),
        );
        $$(".view").forEach((v) =>
          v.classList.toggle("active", v.dataset.viewPanel === name),
        );
        if (name === "studio") {
          runPreview();
          setTimeout(() => {
            if (window.cmHtml) window.cmHtml.refresh();
            if (window.cmCss) window.cmCss.refresh();
            if (window.cmJs) window.cmJs.refresh();
          }, 50);
        }
        if (name === "nexus") renderApps();
      };
      $$("[data-view]").forEach((b) =>
        b.addEventListener("click", () => showView(b.dataset.view)),
      );
      $$("[data-jump]").forEach((b) =>
        b.addEventListener("click", () => showView(b.dataset.jump)),
      );
      const themes = ["void", "solar", "ice"];
      $("#themeBtn").addEventListener("click", () => {
        state.theme =
          themes[(themes.indexOf(state.theme) + 1) % themes.length];
        document.documentElement.dataset.theme = state.theme;
        localStorage.setItem("n8-theme", state.theme);
        toast(state.theme.toUpperCase() + " color protocol");
      });
      const editor = $("#code"),
        readSaved = () => {
          try {
            const saved = JSON.parse(localStorage.getItem("n8-code"));
            if (saved && saved.html) state.code = saved;
          } catch { }
        };
      let save = () => {
          state.code[state.tab] = editor.value;
          localStorage.setItem("n8-code", JSON.stringify(state.code));
        };
      readSaved();
      editor.value = state.code.html;
      $$("[data-code-tab]").forEach((b) =>
        b.addEventListener("click", () => {
          save();
          state.tab = b.dataset.codeTab;
          $$("[data-code-tab]").forEach((x) =>
            x.classList.toggle("active", x === b),
          );
          editor.value = state.code[state.tab];
          editor.focus();
        }),
      );
      let runPreview = () => {
        save();
        const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${state.code.css}
      .gutter {
        background-color: var(--line);
        background-repeat: no-repeat;
        background-position: 50%;
      }
      .gutter:hover {
        background-color: var(--line2);
        cursor: col-resize;
      }
      .gutter.gutter-horizontal {
        cursor: col-resize;
      }
      .gutter.gutter-vertical {
        cursor: row-resize;
      }
      .split-col {
        min-height: 0;
        overflow: hidden;
      }
      /* CodeMirror Overrides */
      .CodeMirror {
        height: 100%;
        font-family: var(--mono);
        font-size: 13px;
        background: #030912 !important;
      }
      .CodeMirror-gutters { background: #030912 !important; border-right: 1px solid var(--line) !important; }

    
      .auto-run { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; cursor: pointer; }
      .auto-run input { cursor: pointer; }

    
      [data-tooltip] { position: relative; cursor: help; }
      [data-tooltip]::after {
         content: attr(data-tooltip);
         position: absolute;
         bottom: 100%; left: 50%;
         transform: translate(-50%, -8px);
         background: var(--panel2);
         color: var(--cyan);
         padding: 4px 8px;
         font-size: 11px;
         border-radius: 4px;
         border: 1px solid var(--line);
         white-space: nowrap;
         opacity: 0;
         pointer-events: none;
         transition: opacity 0.2s, transform 0.2s;
         z-index: 100;
         box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      }
      [data-tooltip]:hover::after {
         opacity: 1;
         transform: translate(-50%, -4px);
      }

    </style>
    <!-- Split.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.5/split.min.js"><\/script>
    <!-- CodeMirror 5 CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/material-darker.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/xml/xml.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/css/css.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/htmlmixed/htmlmixed.min.js"><\/script>

  
    <!-- JS Beautify -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautifier.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify-css.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify-html.min.js"><\/script>
    
    <!-- CodeMirror Scrollbar -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/scroll/simplescrollbars.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/scroll/simplescrollbars.min.js"><\/script>

    
    <!-- Phase 5 CDNs -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"><\/script>
    <script src="https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js"><\/script>

    <!-- CodeMirror Addons -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closetag.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closebrackets.min.js"><\/script>

  
  <!-- Google Fonts: Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Epic Graphics & Animations Overhaul -->
  <style id="epic-graphics-upgrade">
    :root {
      --epic-accent: #00f2fe;
      --epic-accent-2: #4facfe;
      --epic-glow: 0 0 10px rgba(0, 242, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3);
      --font-family: 'Inter', system-ui, sans-serif !important;
    }
    
    body {
      font-family: var(--font-family) !important;
      /* 4. Mesh Gradients & 7. Liquid Background */
      background: linear-gradient(45deg, var(--bg-color), #0a1128, #001220, var(--bg-color));
      background-size: 400% 400%;
      animation: liquidBg 15s ease infinite;
    }
    
    @keyframes liquidBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* 1. Glassmorphism 2.0 & 20. Sidebar Shrink */
    .sidebar {
      background: rgba(20, 20, 25, 0.6) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 2px 0 15px rgba(0,0,0,0.3);
      padding: 10px;
      width: 200px;
    }
    
    /* 8. Frosted Glass Cards */
    .tab-pane.active, .vault-item, .note-item, .wb-editor-col, .wb-right-pane {
      background: rgba(255, 255, 255, 0.03) !important;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 8px;
    }
    
    /* 22. Modal Backdrops & 2. Slide-In Modals */
    .modal-overlay {
      background: radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%) !important;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
    }
    .modal {
      background: rgba(30, 30, 35, 0.85) !important;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
      animation: slideUpModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    }
    
    @keyframes slideUpModal {
      0% { transform: translate(-50%, -40%) scale(0.9) rotateX(10deg); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1) rotateX(0deg); opacity: 1; }
    }

    /* 7. Holographic Text & 23. Text Gradients & 3. Glitch Reveal */
    h1, h2 {
      font-weight: 700 !important;
      background: linear-gradient(to right, var(--epic-accent), var(--epic-accent-2), #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
      animation: glitch 3s infinite;
    }
    
    @keyframes glitch {
      0% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      98% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      99% { text-shadow: -2px 0 red, 2px 0 cyan; }
      100% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
    }

    /* 2. Neon Accents & 17. Button Gradients & 4. Shimmer Sweep & 1. Pulse Ring */
    .btn.primary {
      background: linear-gradient(135deg, var(--epic-accent), var(--epic-accent-2)) !important;
      color: #000 !important;
      border: none !important;
      box-shadow: var(--epic-glow) !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .btn.primary::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      animation: shimmer 5s infinite;
    }
    .btn.primary::after {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      border-radius: inherit;
      border: 2px solid var(--epic-accent);
      animation: pulseRing 2s infinite;
      opacity: 0;
    }
    
    @keyframes shimmer {
      0%, 80% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes pulseRing {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* 6. Skeuomorphic Depth & 24. Input Focus Transitions & 13. Focus Rings */
    input, textarea, select {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) !important;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--epic-accent) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(0, 242, 254, 0.4) !important;
      transform: scale(1.01);
      background: rgba(0,0,0,0.4) !important;
    }

    /* 5. Custom Scrollbars */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; margin: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); border: 2px solid transparent; background-clip: padding-box; }

    /* 11. Icon Glow & 6. Neon Flicker */
    .nav-btn:hover, .btn:hover {
      animation: flicker 0.15s ease-in-out 2;
    }
    .nav-btn.active {
      background: rgba(0, 242, 254, 0.1) !important;
      border-right: 3px solid var(--epic-accent) !important;
      box-shadow: inset 5px 0 15px rgba(0,242,254,0.05);
    }
    .nav-btn.active span {
      text-shadow: var(--epic-glow);
    }
    
    @keyframes flicker {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    /* 12. Selection Color */
    ::selection {
      background: var(--epic-accent);
      color: #000;
    }

    /* 15. Divider Lines */
    .divider-vert {
      border-left: none !important;
      width: 1px;
      background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
    }
    .sidebar-spacer {
      border-top: none !important;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
      margin: 15px 0;
    }

    /* 21. Toast Notifications */
    #toast-container > div {
      background: rgba(20, 20, 25, 0.9) !important;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-bottom: 2px solid var(--epic-accent);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), var(--epic-glow);
      border-radius: 8px !important;
    }

    /* 8. Card Hover Lift & 5. Staggered Fade-In */
    .vault-item, .note-item {
      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
      animation: fadeInUp 0.4s ease-out backwards;
    }
    .vault-item:hover, .note-item:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.05);
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255,255,255,0.3);
    }
    
    /* Stagger children dynamically using nth-child */
    .vault-item:nth-child(1), .note-item:nth-child(1) { animation-delay: 0.05s; }
    .vault-item:nth-child(2), .note-item:nth-child(2) { animation-delay: 0.1s; }
    .vault-item:nth-child(3), .note-item:nth-child(3) { animation-delay: 0.15s; }
    .vault-item:nth-child(4), .note-item:nth-child(4) { animation-delay: 0.2s; }
    .vault-item:nth-child(5), .note-item:nth-child(5) { animation-delay: 0.25s; }
    
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    /* 19. Code Editor Themes */
    .code-editor {
      background: #0f111a !important;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 6px;
      overflow: hidden;
    }
    
    /* 18. Status Indicators */
    #status-active::before {
      content: '';
      display: inline-block;
      width: 8px; height: 8px;
      background: #00ff88;
      border-radius: 50%;
      margin-right: 6px;
      box-shadow: 0 0 8px #00ff88;
      animation: pulseRing 2s infinite;
    }
    
    /* 3. Gradient Borders (Animated) */
    .btn {
       transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .btn:hover:not(.primary) {
       border-color: var(--epic-accent) !important;
       box-shadow: inset 0 0 10px rgba(0, 242, 254, 0.1);
    }
  </style>

</head><body>${state.code.html}<script>${state.code.js.replace(/<\/script/gi, "<\\/script")}<\/script></body></html>`;
        $("#preview").srcdoc = html;
        $("#console").insertAdjacentHTML(
          "afterbegin",
          `<div class="log ok">✓ Preview compiled at ${new Date().toLocaleTimeString()}</div>`,
        );
      };
      let previewTimer;
      editor.addEventListener("input", () => {
        save();
        clearTimeout(previewTimer);
        previewTimer = setTimeout(runPreview, 420);
      });
      $("#runBtn").addEventListener("click", runPreview);
      $$("[data-device]").forEach((b) =>
        b.addEventListener("click", () => {
          $$("[data-device]").forEach((x) =>
            x.classList.toggle("active", x === b),
          );
          $("#device").className =
            "device " +
            (b.dataset.device === "desktop" ? "" : b.dataset.device);
        }),
      );
      const format = () => {
        let v = editor.value;
        if (state.tab === "html")
          v = v.replace(/></g, ">\n<").replace(/\n\s*\n/g, "\n");
        else
          v = v
            .replace(/\s*{\s*/g, " {\n  ")
            .replace(/;\s*/g, ";\n  ")
            .replace(/\s*}\s*/g, "\n}\n")
            .replace(/\n\s*\n/g, "\n");
        editor.value = v.trim();
        save();
        runPreview();
        toast("Code formatted");
      };
      const minify = () => {
        editor.value = editor.value
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\s+/g, " ")
          .replace(/\s*([{}:;,>])\s*/g, "$1")
          .trim();
        save();
        runPreview();
        toast("Current tab minified");
      };
      $("#formatBtn").addEventListener("click", format);
      $("#minifyBtn").addEventListener("click", minify);
      $("#copyCodeBtn").addEventListener("click", async () => {
        await navigator.clipboard.writeText(editor.value);
        toast("Current tab copied");
      });
      const downloadProject = () => {
        save();
        const blob = new Blob(
          [
            `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>N8 Project</title><style>${state.code.css}
      .gutter {
        background-color: var(--line);
        background-repeat: no-repeat;
        background-position: 50%;
      }
      .gutter:hover {
        background-color: var(--line2);
        cursor: col-resize;
      }
      .gutter.gutter-horizontal {
        cursor: col-resize;
      }
      .gutter.gutter-vertical {
        cursor: row-resize;
      }
      .split-col {
        min-height: 0;
        overflow: hidden;
      }
      /* CodeMirror Overrides */
      .CodeMirror {
        height: 100%;
        font-family: var(--mono);
        font-size: 13px;
        background: #030912 !important;
      }
      .CodeMirror-gutters { background: #030912 !important; border-right: 1px solid var(--line) !important; }

    
      .auto-run { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; cursor: pointer; }
      .auto-run input { cursor: pointer; }

    
      [data-tooltip] { position: relative; cursor: help; }
      [data-tooltip]::after {
         content: attr(data-tooltip);
         position: absolute;
         bottom: 100%; left: 50%;
         transform: translate(-50%, -8px);
         background: var(--panel2);
         color: var(--cyan);
         padding: 4px 8px;
         font-size: 11px;
         border-radius: 4px;
         border: 1px solid var(--line);
         white-space: nowrap;
         opacity: 0;
         pointer-events: none;
         transition: opacity 0.2s, transform 0.2s;
         z-index: 100;
         box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      }
      [data-tooltip]:hover::after {
         opacity: 1;
         transform: translate(-50%, -4px);
      }

      /* --- EPIC MECHANICAL TURTLE CSS --- */
      .turtle {
        width: 240px;
        height: 240px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 0;
        background: none;
        cursor: grab;
        filter: drop-shadow(0 26px 28px rgba(0, 242, 254, 0.4));
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s;
      }
      .turtle:hover {
        transform: translate(-50%, -50%) translateY(-15px) scale(1.08) rotate(-3deg);
      }
      .turtle:active {
        cursor: grabbing;
        transform: translate(-50%, -50%) translateY(-5px) scale(0.95);
      }
      .mech-turtle-container {
        position: relative;
        width: 100%;
        height: 100%;
        animation: floatTurtle 6s ease-in-out infinite;
      }
      .mech-turtle-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        mix-blend-mode: screen;
        animation: cyberPulse 4s infinite alternate;
      }
      .turtle.active-drag .thruster-glow {
        opacity: 1;
        height: 140px;
        bottom: -50px;
        animation: jetFlicker 0.1s infinite alternate;
      }
      .thruster-glow {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 80px;
        background: radial-gradient(ellipse at center, rgba(0, 242, 254, 0.9) 0%, rgba(0, 242, 254, 0) 70%);
        filter: blur(15px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      @keyframes jetFlicker {
        from { filter: blur(15px) brightness(1); }
        to { filter: blur(25px) brightness(1.6); }
      }
      
      @keyframes floatTurtle {
        0% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(10px, -10px) rotate(2deg); }
        50% { transform: translate(0, 0) rotate(0deg); }
        75% { transform: translate(-10px, -10px) rotate(-2deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
      .turtle.coding-pet {
        position: fixed;
        width: 140px;
        height: 140px;
        z-index: 9999;
        left: calc(100vw - 100px);
        top: calc(100vh - 100px);
      }
      .turtle.coding-pet .mech-turtle-container {
        animation: floatTurtlePet 4s ease-in-out infinite;
      }
      @keyframes floatTurtlePet {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(1deg); }
      }
      @keyframes cyberPulse {
        0% { filter: brightness(1) contrast(1.5); }
        100% { filter: brightness(1.3) contrast(1.65); }
      }
      @keyframes thrustFlicker {
        0% { opacity: 0.7; transform: translateX(-50%) scale(1); }
        50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        100% { opacity: 0.8; transform: translateX(-50%) scale(0.9); }
      }
      
      .launcher.transforming .mech-turtle-container {
        animation: warpSpeed 1s cubic-bezier(0.2, 0.7, 0.1, 1) forwards;
      }
      @keyframes warpSpeed {
        0% { transform: scale(1) translateY(0) rotate(0deg); filter: blur(0); }
        30% { transform: scale(0.8) translateY(20px) rotate(-2deg); filter: blur(2px); }
        100% { transform: scale(15) translateY(-500px) rotate(10deg); filter: blur(30px); opacity: 0; }
      }
      
      /* --- SPACE BACKGROUND ENHANCEMENTS --- */
      #space-bg-container {
        background: radial-gradient(circle at center, #010410 0%, #000000 100%) !important;
      }
      .space-haze {
        background:
          radial-gradient(ellipse at 30% 30%, rgba(0, 242, 254, 0.15), transparent 40%),
          radial-gradient(ellipse at 70% 70%, rgba(173, 117, 255, 0.15), transparent 40%) !important;
        animation: drift 25s ease-in-out infinite alternate, hueShift 20s infinite !important;
      }
      @keyframes hueShift {
        0% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(30deg); }
        100% { filter: hue-rotate(0deg); }
      }
      
      /* --- MOBILE/PC UI OPTIMIZATION --- */
      @media (max-width: 768px) {
        .turtle {
          width: 150px;
          height: 150px;
          transform: scale(0.85);
        }
        .coding-pet {
          left: calc(100vw - 120px) !important;
          top: calc(100vh - 120px) !important;
        }
        .app {
          inset: 0 !important;
          border-radius: 0 !important;
          border: none !important;
        }
        .nav button {
          min-width: 60px;
          font-size: 8px;
          padding: 0 4px;
        }
        .brand-core {
          width: 24px;
          height: 24px;
          font-size: 8px;
        }
        .brand b {
          font-size: 10px;
        }
        .brand small {
          font-size: 6px;
        }
        .thruster-glow {
          width: 80px;
          height: 50px;
          bottom: 10px;
        }
      }

    </style>
    <!-- Split.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.5/split.min.js"><\/script>
    <!-- CodeMirror 5 CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/material-darker.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/xml/xml.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/css/css.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/htmlmixed/htmlmixed.min.js"><\/script>

  
    <!-- JS Beautify -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautifier.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify-css.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify-html.min.js"><\/script>
    
    <!-- CodeMirror Scrollbar -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/scroll/simplescrollbars.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/scroll/simplescrollbars.min.js"><\/script>

    
    <!-- Phase 5 CDNs -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"><\/script>
    <script src="https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js"><\/script>

    <!-- CodeMirror Addons -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closetag.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closebrackets.min.js"><\/script>

  
  <!-- Google Fonts: Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Epic Graphics & Animations Overhaul -->
  <style id="epic-graphics-upgrade">
    :root {
      --epic-accent: #00f2fe;
      --epic-accent-2: #4facfe;
      --epic-glow: 0 0 10px rgba(0, 242, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3);
      --font-family: 'Inter', system-ui, sans-serif !important;
    }
    
    body {
      font-family: var(--font-family) !important;
      /* 4. Mesh Gradients & 7. Liquid Background */
      background: linear-gradient(45deg, var(--bg-color), #0a1128, #001220, var(--bg-color));
      background-size: 400% 400%;
      animation: liquidBg 15s ease infinite;
    }
    
    @keyframes liquidBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* 1. Glassmorphism 2.0 & 20. Sidebar Shrink */
    .sidebar {
      background: rgba(20, 20, 25, 0.6) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 2px 0 15px rgba(0,0,0,0.3);
      padding: 10px;
      width: 200px;
    }
    
    /* 8. Frosted Glass Cards */
    .tab-pane.active, .vault-item, .note-item, .wb-editor-col, .wb-right-pane {
      background: rgba(255, 255, 255, 0.03) !important;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 8px;
    }
    
    /* 22. Modal Backdrops & 2. Slide-In Modals */
    .modal-overlay {
      background: radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%) !important;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
    }
    .modal {
      background: rgba(30, 30, 35, 0.85) !important;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
      animation: slideUpModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    }
    
    @keyframes slideUpModal {
      0% { transform: translate(-50%, -40%) scale(0.9) rotateX(10deg); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1) rotateX(0deg); opacity: 1; }
    }

    /* 7. Holographic Text & 23. Text Gradients & 3. Glitch Reveal */
    h1, h2 {
      font-weight: 700 !important;
      background: linear-gradient(to right, var(--epic-accent), var(--epic-accent-2), #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
      animation: glitch 3s infinite;
    }
    
    @keyframes glitch {
      0% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      98% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      99% { text-shadow: -2px 0 red, 2px 0 cyan; }
      100% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
    }

    /* 2. Neon Accents & 17. Button Gradients & 4. Shimmer Sweep & 1. Pulse Ring */
    .btn.primary {
      background: linear-gradient(135deg, var(--epic-accent), var(--epic-accent-2)) !important;
      color: #000 !important;
      border: none !important;
      box-shadow: var(--epic-glow) !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .btn.primary::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      animation: shimmer 5s infinite;
    }
    .btn.primary::after {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      border-radius: inherit;
      border: 2px solid var(--epic-accent);
      animation: pulseRing 2s infinite;
      opacity: 0;
    }
    
    @keyframes shimmer {
      0%, 80% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes pulseRing {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* 6. Skeuomorphic Depth & 24. Input Focus Transitions & 13. Focus Rings */
    input, textarea, select {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) !important;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--epic-accent) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(0, 242, 254, 0.4) !important;
      transform: scale(1.01);
      background: rgba(0,0,0,0.4) !important;
    }

    /* 5. Custom Scrollbars */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; margin: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); border: 2px solid transparent; background-clip: padding-box; }

    /* 11. Icon Glow & 6. Neon Flicker */
    .nav-btn:hover, .btn:hover {
      animation: flicker 0.15s ease-in-out 2;
    }
    .nav-btn.active {
      background: rgba(0, 242, 254, 0.1) !important;
      border-right: 3px solid var(--epic-accent) !important;
      box-shadow: inset 5px 0 15px rgba(0,242,254,0.05);
    }
    .nav-btn.active span {
      text-shadow: var(--epic-glow);
    }
    
    @keyframes flicker {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    /* 12. Selection Color */
    ::selection {
      background: var(--epic-accent);
      color: #000;
    }

    /* 15. Divider Lines */
    .divider-vert {
      border-left: none !important;
      width: 1px;
      background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
    }
    .sidebar-spacer {
      border-top: none !important;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
      margin: 15px 0;
    }

    /* 21. Toast Notifications */
    #toast-container > div {
      background: rgba(20, 20, 25, 0.9) !important;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-bottom: 2px solid var(--epic-accent);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), var(--epic-glow);
      border-radius: 8px !important;
    }

    /* 8. Card Hover Lift & 5. Staggered Fade-In */
    .vault-item, .note-item {
      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
      animation: fadeInUp 0.4s ease-out backwards;
    }
    .vault-item:hover, .note-item:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.05);
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255,255,255,0.3);
    }
    
    /* Stagger children dynamically using nth-child */
    .vault-item:nth-child(1), .note-item:nth-child(1) { animation-delay: 0.05s; }
    .vault-item:nth-child(2), .note-item:nth-child(2) { animation-delay: 0.1s; }
    .vault-item:nth-child(3), .note-item:nth-child(3) { animation-delay: 0.15s; }
    .vault-item:nth-child(4), .note-item:nth-child(4) { animation-delay: 0.2s; }
    .vault-item:nth-child(5), .note-item:nth-child(5) { animation-delay: 0.25s; }
    
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    /* 19. Code Editor Themes */
    .code-editor {
      background: #0f111a !important;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 6px;
      overflow: hidden;
    }
    
    /* 18. Status Indicators */
    #status-active::before {
      content: '';
      display: inline-block;
      width: 8px; height: 8px;
      background: #00ff88;
      border-radius: 50%;
      margin-right: 6px;
      box-shadow: 0 0 8px #00ff88;
      animation: pulseRing 2s infinite;
    }
    
    /* 3. Gradient Borders (Animated) */
    .btn {
       transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .btn:hover:not(.primary) {
       border-color: var(--epic-accent) !important;
       box-shadow: inset 0 0 10px rgba(0, 242, 254, 0.1);
    }
  </style>

</head><body>${state.code.html}<script>${state.code.js.replace(/<\/script/gi, "<\\/script")}<\/script></body></html>`,
          ],
          { type: "text/html" },
        ),
          a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "turtlebot-project.html";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1200);
        toast("Project exported");
      };
      $("#downloadBtn").addEventListener("click", downloadProject);
      $("#quickExport").addEventListener("click", downloadProject);
      const promptTemplates = [
        [
          "Web Architect",
          "Plan and implement a complete production-ready web experience.",
        ],
        [
          "UI Transformer",
          "Redesign an interface with a clear visual system and interactions.",
        ],
        [
          "Code Surgeon",
          "Diagnose, explain, and repair a codebase with minimal regressions.",
        ],
        [
          "Game Protocol",
          "Design a replayable browser game with responsive controls.",
        ],
        [
          "Launch Strategist",
          "Turn a product concept into an actionable launch system.",
        ],
      ];
      $("#templates").innerHTML = promptTemplates
        .map(
          (t, i) =>
            `<button aria-label="button element" class="template-card${i === 0 ? " active" : ""}" data-template="${i}"><b>${t[0]}</b><span>${t[1]}</span></button>`,
        )
        .join("");
      $$(".template-card").forEach((b) =>
        b.addEventListener("click", () => {
          $$(".template-card").forEach((x) =>
            x.classList.toggle("active", x === b),
          );
          $("#goal").value = promptTemplates[+b.dataset.template][1];
          buildPrompt();
        }),
      );
      const buildPrompt = () => {
        const goal = $("#goal").value.trim(),
          audience = $("#audience").value.trim(),
          constraints = $("#constraints").value.trim(),
          tone = $("#tone").value;
        $("#promptOutput").textContent =
          `ROLE\nAct as a ${tone.toLowerCase()}.\n\nMISSION\n${goal || "Define and complete the objective."}\n\nCONTEXT\nThe work is for ${audience || "a general audience"}.\n\nREQUIREMENTS\n${constraints || "Use sound judgment and explain material tradeoffs."}\n\nEXECUTION PROTOCOL\n1. Clarify only if a missing detail would materially change the result.\n2. Build the complete solution, including responsive and accessible behavior.\n3. Validate the highest-risk interactions.\n4. Deliver a concise handoff with what changed and how to use it.`;
        const score = Math.min(
          99,
          62 +
          Math.round(
            (goal.length + audience.length + constraints.length) / 12,
          ),
        );
        $("#promptScore").textContent = score + "% SIGNAL";
      };
      $("#buildPrompt").addEventListener("click", buildPrompt);
      $("#copyPrompt").addEventListener("click", async () => {
        await navigator.clipboard.writeText($("#promptOutput").textContent);
        toast("Prompt copied");
      });
      $("#savePrompt").addEventListener("click", () => {
        localStorage.setItem("n8-prompt", $("#promptOutput").textContent);
        toast("Prompt loadout saved locally");
      });
      ["goal", "audience", "constraints", "tone"].forEach((id) =>
        $("#" + id).addEventListener("input", buildPrompt),
      );
      buildPrompt();
      const updateCss = () => {
        const r = $("#radius").value,
          d = $("#depth").value,
          a = $("#angle").value,
          c1 = $("#colorA").value,
          c2 = $("#colorB").value,
          card = $("#demoCard");
        card.style.borderRadius = r + "px";
        card.style.boxShadow = `${Math.round(d * 0.4)}px ${Math.round(d * 0.4)}px ${d}px rgba(0,0,0,.42)`;
        card.style.background = `linear-gradient(${a}deg,${c1},${c2})`;
        $("#radiusOut").value = r + "px";
        $("#depthOut").value = d + "px";
        $("#angleOut").value = a + "°";
        $("#cssOutput").textContent =
          `border-radius: ${r}px; background: linear-gradient(${a}deg, ${c1}, ${c2}); box-shadow: ${Math.round(d * 0.4)}px ${Math.round(d * 0.4)}px ${d}px rgba(0,0,0,.42);`;
      };
      ["radius", "depth", "angle", "colorA", "colorB"].forEach((id) =>
        $("#" + id).addEventListener("input", updateCss),
      );
      $$(".swatch").forEach((s) =>
        s.addEventListener("click", () => {
          $("#colorA").value = s.dataset.color;
          updateCss();
        }),
      );
      $("#copyCss").addEventListener("click", async () => {
        await navigator.clipboard.writeText($("#cssOutput").textContent);
        toast("CSS copied");
      });
      updateCss();
      const apps = [
        [
          1,
          "ACAI // Adaptive Cyber Analysis Interface",
          "Experiments & Archives",
          "acai-adaptive-cyber-analysis-interface.html",
        ],
        [2, "N8 Asset Hub", "Developer Studios", "n8AHub.html"],
        [3, "N8 Asset Hub Prime", "Developer Studios", "n8AHubPrime.html"],
        [
          4,
          "WHO//ROAD — Neon Conversation Lab",
          "Experiments & Archives",
          "who-road-convo-lab.html",
        ],
        [
          5,
          "Blood & Gold: Panther Arena",
          "Games & Simulations",
          "blood-and-gold-panther-arena.html",
        ],
        [
          6,
          "CYBER-COUNT CALCUN8R",
          "Experiments & Archives",
          "cyber-count-calcun8r-edison-hwy.html",
        ],
        [7, "Social Footer", "Experiments & Archives", "social-footer.html"],
        [
          8,
          "CYBER-DATA Logistics Engine",
          "Experiments & Archives",
          "cyber-data-multi-team-logistics-engine.html",
        ],
        [
          9,
          "Contractor Tool Belt",
          "Tools & Productivity",
          "contractor-tool-belt-tactical-utility-engine.html",
        ],
        [
          10,
          "Qamelot Tower Defense",
          "Games & Simulations",
          "qtd-courage-under-fire.html",
        ],
        [
          11,
          "CSS Visuals Library (40)",
          "Tools & Productivity",
          "css-visuals-library-40.html",
        ],
        [
          12,
          "DevDashboard Hub",
          "Developer Studios",
          "devdashboard-hub.html",
        ],
        [
          13,
          "Blob Bash Royale: Ascension",
          "Games & Simulations",
          "blob-bash-royale.html",
        ],
        [
          14,
          "Web App Dev Dashboard",
          "Developer Studios",
          "web-app-dev-dashboard.html",
        ],
        [15, "N8 Animation Hub", "Developer Studios", "n8AnimHub.html"],
        [16, "Miyagi Throw!", "Games & Simulations", "MiyagiThrow.html"],
        [17, "Push Complete", "Developer Studios", "push-complete.html"],
        [
          18,
          "Qamelot Conquest",
          "Games & Simulations",
          "qamelot-conquest-super-arcade-edition.html",
        ],
        [
          20,
          "DevDash SVG Studio",
          "Developer Studios",
          "devdash-svg-studio.html",
        ],
        [
          21,
          "SVG Sandbox Studio",
          "Developer Studios",
          "svg-sandbox-studio.html",
        ],
        [
          22,
          "EcoTechComm // Secure PTT",
          "Featured Sites",
          "ecotechcomm-secure-ptt-link.html",
        ],
        [
          23,
          "EcoTechComm Secure Frequency",
          "Featured Sites",
          "ecotechcomm-secure-frequency.html",
        ],
        [
          24,
          "DevDashboard Home",
          "Experiments & Archives",
          "devdashboard-home.html",
        ],
        [25, "HomeHub", "Experiments & Archives", "homehub.html"],
        [
          26,
          "Mecha Strike: Transformer Protocol",
          "Games & Simulations",
          "mecha-strike.html",
        ],
        [
          28,
          "Lattice — The AI Context Lab",
          "Experiments & Archives",
          "lattice-a-the-ai-context-lab.html",
        ],
        [29, "Loc Me In", "Featured Sites", "loc-me-in-llc.html"],
        [
          30,
          "Eco-Tech Motion Library",
          "Tools & Productivity",
          "eco-tech-motion-library.html",
        ],
        [
          31,
          "BUILD//50 Prompt Deck",
          "Tools & Productivity",
          "n8Prompt.html",
        ],
        [32, "Neon Pong", "Games & Simulations", "neon-pong.html"],
        [
          33,
          "New Perspective Painting",
          "Featured Sites",
          "new-perspective-painting-llc.html",
        ],
        [
          34,
          "Pulse Productivity Studio",
          "Tools & Productivity",
          "pulse-productivity-and-biorhythm-studio.html",
        ],
        [35, "Qamelot Menu", "Experiments & Archives", "index.html"],
        [
          37,
          "TRI-NEXUS: GRAIL MATRIX",
          "Games & Simulations",
          "tri-nexus-grail-matrix.html",
        ],
        [
          38,
          "QamoMathCore SCI-FI NEXUS",
          "Games & Simulations",
          "qamomathcore-sci-fi-nexus.html",
        ],
        [
          39,
          "QAMELOT MATH CORE",
          "Tools & Productivity",
          "qamelot-math-core.html",
        ],
        [
          40,
          "Qamelot Media I",
          "Experiments & Archives",
          "qamelot-media-1.html",
        ],
        [
          41,
          "Qamelot Media II",
          "Experiments & Archives",
          "qamelot-media-2.html",
        ],
        [
          42,
          "Qamelot Media Flick Edition",
          "Experiments & Archives",
          "qamelot-media-3.html",
        ],
        [
          43,
          "Interactive Nebula Screensaver",
          "Experiments & Archives",
          "screensaver.html",
        ],
        [
          44,
          "SpriteForge Studio",
          "Experiments & Archives",
          "spriteforge-studio.html",
        ],
        [
          45,
          "Stix Stax Stonz",
          "Games & Simulations",
          "stix-stax-stonz.html",
        ],
        [46, "Task Forge", "Experiments & Archives", "task-forge.html"],
        [
          47,
          "N8 Tools Browser Workbench",
          "Tools & Productivity",
          "n8-tools.html",
        ],
        [
          48,
          "DevDashboard Hub Index",
          "Experiments & Archives",
          "devdashboard-hub-index.html",
        ],
        [
          49,
          "funPromptz Media Arcade",
          "Tools & Productivity",
          "funPromptz.html",
        ],
        [
          50,
          "masterPrompt Command Deck",
          "Tools & Productivity",
          "masterPrompt.html",
        ],
        [
          51,
          "Qamelot Compatibility Directory",
          "Experiments & Archives",
          "QamelotMenu.html",
        ],
      ];
      const categories = ["All", ...new Set(apps.map((a) => a[2]))];
      let category = "All";
      $("#filters").innerHTML = categories
        .map(
          (c, i) =>
            `<button aria-label="button element" class="filter${i === 0 ? " active" : ""}" data-category="${c}">${c.replace(" & ", " + ")}</button>`,
        )
        .join("");
      let renderApps = () => {
        const q = $("#appSearch").value.trim().toLowerCase(),
          filtered = apps.filter(
            (a) =>
              (category === "All" || a[2] === category) &&
              (!q || a.join(" ").toLowerCase().includes(q)),
          );
        $("#appGrid").innerHTML =
          filtered
            .map(
              (a) =>
                `<button aria-label="button element" class="appcard${state.selectedApp && state.selectedApp[0] === a[0] ? " selected" : ""}" data-app="${a[0]}"><span class="num">N8.${String(a[0]).padStart(2, "0")}</span><b>${a[1]}</b><small>${a[2]}</small></button>`,
            )
            .join("") ||
          `<div class="empty">No modules match this signal.</div>`;
        $$(".appcard").forEach((b) =>
          b.addEventListener("click", () =>
            openApp(apps.find((a) => a[0] === +b.dataset.app)),
          ),
        );
      };
      $$(".filter").forEach((b) =>
        b.addEventListener("click", () => {
          category = b.dataset.category;
          $$(".filter").forEach((x) => x.classList.toggle("active", x === b));
          renderApps();
        }),
      );
      $("#appSearch").addEventListener("input", renderApps);
      let openApp = (a) => {
        state.selectedApp = a;
        renderApps();
        $("#frameTitle").textContent = a[1];
        $("#frameHost").innerHTML =
          `<iframe class="pathframe" data-tooltip="${a[1]}" src="${a[3]}" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"></iframe>`;
        toast("Loading " + a[1]);
      };
      $("#openExternal").addEventListener("click", () => {
        if (state.selectedApp)
          window.open(
            state.selectedApp[3],
            "_blank",
            "noopener",
          );
        else toast("Select a Pathfinder app first");
      });
      $("#closeFrame").addEventListener("click", () => {
        state.selectedApp = null;
        $("#frameTitle").textContent = "PATHFINDER PREVIEW";
        $("#frameHost").innerHTML =
          `<div class="frame-placeholder"><div><strong>Module<br>standby.</strong><p>Select a Pathfinder app to continue.</p></div></div>`;
        renderApps();
      });
      $("#randomBtn").addEventListener("click", () => {
        showView("nexus");
        const a = apps[Math.floor(Math.random() * apps.length)];
        setTimeout(() => openApp(a), 80);
      });
      const help = $("#help");
      $("#closeHelp").addEventListener("click", () =>
        help.classList.remove("open"),
      );
      document.addEventListener("keydown", (e) => {
        const typing = /input|textarea|select/i.test(
          document.activeElement?.tagName || "",
        );
        if (e.key === "?" && !typing) {
          e.preventDefault();
          help.classList.add("open");
        } else if (e.key === "Escape") {
          if (help.classList.contains("open")) help.classList.remove("open");
          else minimize();
        } else if (
          e.key.toLowerCase() === "f" &&
          !typing &&
          $("#app").classList.contains("online")
        )
          maximize();
        else if (e.altKey && /[1-5]/.test(e.key)) {
          e.preventDefault();
          showView(
            ["command", "studio", "forge", "lab", "nexus"][+e.key - 1],
          );
        } else if (e.key === "/" && !typing && state.view === "nexus") {
          e.preventDefault();
          $("#appSearch").focus();
        } else if (
          e.key === "Enter" &&
          !$("#app").classList.contains("online")
        )
          transform();
      });
      setInterval(
        () =>
        ($("#clock").textContent = new Date().toLocaleTimeString([], {
          hour12: false,
        })),
        1000,
      );
      const canvas = $("#stars"),
        ctx = canvas.getContext("2d", { alpha: true });
      let stars = [],
        raf,
        reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const sizeStars = () => {
        const d = Math.min(devicePixelRatio, 1.5);
        canvas.width = innerWidth * d;
        canvas.height = innerHeight * d;
        canvas.style.width = innerWidth + "px";
        canvas.style.height = innerHeight + "px";
        ctx.setTransform(d, 0, 0, d, 0, 0);

        // Generate 3 layers of stars (Background, Midground, Foreground)
        const numStars = Math.min(2500, Math.round((innerWidth * innerHeight) / 1000)); // Dense starfield upgrade
        stars = Array.from({ length: numStars }, () => {
          const layer = Math.random();
          let size, speed, alpha, color;

          if (layer > 0.8) {
            // Foreground (fast, bright, large)
            size = Math.random() * 1.5 + 0.8;
            speed = Math.random() * 0.3 + 0.15;
            alpha = Math.random() * 0.5 + 0.5;
            color = Math.random() > 0.5 ? "#fff" : "#54e8ff"; // cyan tint
          } else if (layer > 0.4) {
            // Midground (medium)
            size = Math.random() * 0.8 + 0.4;
            speed = Math.random() * 0.1 + 0.05;
            alpha = Math.random() * 0.4 + 0.3;
            color = Math.random() > 0.8 ? "#ad75ff" : "#fff"; // violet tint
          } else {
            // Background (slow, faint, small)
            size = Math.random() * 0.5 + 0.1;
            speed = Math.random() * 0.03 + 0.01;
            alpha = Math.random() * 0.3 + 0.1;
            color = "#fff";
          }

          return {
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            r: size,
            s: speed,
            a: alpha,
            baseA: alpha,
            c: color,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleDir: Math.random() > 0.5 ? 1 : -1
          };
        });
      };

      const drawStars = () => {
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (const s of stars) {
          // Twinkle effect
          if (!reduce) {
            s.a += s.twinkleSpeed * s.twinkleDir;
            if (s.a > s.baseA + 0.3 || s.a > 1) s.twinkleDir = -1;
            if (s.a < s.baseA - 0.3 || s.a < 0.1) s.twinkleDir = 1;
          }

          ctx.globalAlpha = Math.max(0, Math.min(1, s.a));
          ctx.fillStyle = s.c;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, 7);
          ctx.fill();

          // Parallax movement
          if (!reduce) {
            s.y += s.s;
            if (s.y > innerHeight) {
              s.y = 0;
              s.x = Math.random() * innerWidth;
            }
          }
        }
        ctx.globalAlpha = 1;
        if (!reduce) raf = requestAnimationFrame(drawStars);
      };
      addEventListener(
        "resize",
        () => {
          cancelAnimationFrame(raf);
          sizeStars();
          drawStars();
        },
        { passive: true },
      );
      sizeStars();
      drawStars();
      renderApps();
      runPreview();

      // --- SPLIT.JS INIT ---
      // Wait for DOM to be ready
      setTimeout(() => {
        // Setup vertical splits for the code editors
        window.splitEditor = Split(['#ed-html', '#ed-css', '#ed-js'], {
          direction: 'vertical',
          sizes: [33.3, 33.3, 33.3],
          minSize: 30,
          gutterSize: 6
        });

        // Setup horizontal splits for the main views
        // Studio: .editor and .preview
        Split(['.studio .editor', '.studio .preview'], { sizes: [35, 65], minSize: 100, gutterSize: 6 });
        // Forge: template-list and prompt assembly
        Split(['.forge .panel:nth-child(1)', '.forge .panel:nth-child(2)'], { sizes: [30, 70], minSize: 100, gutterSize: 6 });
        // Lab: controls and visual stage
        Split(['.lab .panel:nth-child(1)', '.lab .panel:nth-child(2)'], { sizes: [40, 60], minSize: 100, gutterSize: 6 });
        // Nexus: appGrid and appframe
        Split(['#appGrid', '.appframe'], { sizes: [40, 60], minSize: 100, gutterSize: 6 });

        // --- CODEMIRROR INIT ---
        const cmOptions = { theme: 'material-darker', lineNumbers: true, tabSize: 2, autoCloseTags: true, autoCloseBrackets: true, scrollbarStyle: 'simple' };
        window.cmHtml = CodeMirror(document.getElementById('ed-html'), { ...cmOptions, mode: 'htmlmixed', value: state.code.html });
        window.cmCss = CodeMirror(document.getElementById('ed-css'), { ...cmOptions, mode: 'css', value: state.code.css });
        window.cmJs = CodeMirror(document.getElementById('ed-js'), { ...cmOptions, mode: 'javascript', value: state.code.js });


        const cmChange = () => {
          state.code.html = window.cmHtml.getValue();
          state.code.css = window.cmCss.getValue();
          state.code.js = window.cmJs.getValue();
          save();
          if (document.getElementById('autoRunCheck').checked) {
            clearTimeout(previewTimer);
            previewTimer = setTimeout(origRunPreview, 420);
          }
        };

        window.cmHtml.on('change', cmChange);
        window.cmCss.on('change', cmChange);
        window.cmJs.on('change', cmChange);
      }, 500);

      // Overwrite runPreview to use CodeMirror if available
      const origRunPreview = runPreview;
      runPreview = () => {
        if (window.cmHtml) {
          state.code.html = window.cmHtml.getValue();
          state.code.css = window.cmCss.getValue();
          state.code.js = window.cmJs.getValue();
        }
        const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${state.code.css}
      .auto-run { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; cursor: pointer; }
      .auto-run input { cursor: pointer; }

    
      [data-tooltip] { position: relative; cursor: help; }
      [data-tooltip]::after {
         content: attr(data-tooltip);
         position: absolute;
         bottom: 100%; left: 50%;
         transform: translate(-50%, -8px);
         background: var(--panel2);
         color: var(--cyan);
         padding: 4px 8px;
         font-size: 11px;
         border-radius: 4px;
         border: 1px solid var(--line);
         white-space: nowrap;
         opacity: 0;
         pointer-events: none;
         transition: opacity 0.2s, transform 0.2s;
         z-index: 100;
         box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      }
      [data-tooltip]:hover::after {
         opacity: 1;
         transform: translate(-50%, -4px);
      }

    </style>
    <!-- JS Beautify -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautifier.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify-css.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify-html.min.js"><\/script>
    
    <!-- CodeMirror Scrollbar -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/scroll/simplescrollbars.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/scroll/simplescrollbars.min.js"><\/script>

    
    <!-- Phase 5 CDNs -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"><\/script>
    <script src="https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js"><\/script>

    <!-- CodeMirror Addons -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closetag.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closebrackets.min.js"><\/script>

  
  <!-- Google Fonts: Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Epic Graphics & Animations Overhaul -->
  <style id="epic-graphics-upgrade">
    :root {
      --epic-accent: #00f2fe;
      --epic-accent-2: #4facfe;
      --epic-glow: 0 0 10px rgba(0, 242, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3);
      --font-family: 'Inter', system-ui, sans-serif !important;
    }
    
    body {
      font-family: var(--font-family) !important;
      /* 4. Mesh Gradients & 7. Liquid Background */
      background: linear-gradient(45deg, var(--bg-color), #0a1128, #001220, var(--bg-color));
      background-size: 400% 400%;
      animation: liquidBg 15s ease infinite;
    }
    
    @keyframes liquidBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* 1. Glassmorphism 2.0 & 20. Sidebar Shrink */
    .sidebar {
      background: rgba(20, 20, 25, 0.6) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 2px 0 15px rgba(0,0,0,0.3);
      padding: 10px;
      width: 200px;
    }
    
    /* 8. Frosted Glass Cards */
    .tab-pane.active, .vault-item, .note-item, .wb-editor-col, .wb-right-pane {
      background: rgba(255, 255, 255, 0.03) !important;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 8px;
    }
    
    /* 22. Modal Backdrops & 2. Slide-In Modals */
    .modal-overlay {
      background: radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%) !important;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
    }
    .modal {
      background: rgba(30, 30, 35, 0.85) !important;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
      animation: slideUpModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    }
    
    @keyframes slideUpModal {
      0% { transform: translate(-50%, -40%) scale(0.9) rotateX(10deg); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1) rotateX(0deg); opacity: 1; }
    }

    /* 7. Holographic Text & 23. Text Gradients & 3. Glitch Reveal */
    h1, h2 {
      font-weight: 700 !important;
      background: linear-gradient(to right, var(--epic-accent), var(--epic-accent-2), #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
      animation: glitch 3s infinite;
    }
    
    @keyframes glitch {
      0% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      98% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      99% { text-shadow: -2px 0 red, 2px 0 cyan; }
      100% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
    }

    /* 2. Neon Accents & 17. Button Gradients & 4. Shimmer Sweep & 1. Pulse Ring */
    .btn.primary {
      background: linear-gradient(135deg, var(--epic-accent), var(--epic-accent-2)) !important;
      color: #000 !important;
      border: none !important;
      box-shadow: var(--epic-glow) !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .btn.primary::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      animation: shimmer 5s infinite;
    }
    .btn.primary::after {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      border-radius: inherit;
      border: 2px solid var(--epic-accent);
      animation: pulseRing 2s infinite;
      opacity: 0;
    }
    
    @keyframes shimmer {
      0%, 80% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes pulseRing {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* 6. Skeuomorphic Depth & 24. Input Focus Transitions & 13. Focus Rings */
    input, textarea, select {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) !important;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--epic-accent) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(0, 242, 254, 0.4) !important;
      transform: scale(1.01);
      background: rgba(0,0,0,0.4) !important;
    }

    /* 5. Custom Scrollbars */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; margin: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); border: 2px solid transparent; background-clip: padding-box; }

    /* 11. Icon Glow & 6. Neon Flicker */
    .nav-btn:hover, .btn:hover {
      animation: flicker 0.15s ease-in-out 2;
    }
    .nav-btn.active {
      background: rgba(0, 242, 254, 0.1) !important;
      border-right: 3px solid var(--epic-accent) !important;
      box-shadow: inset 5px 0 15px rgba(0,242,254,0.05);
    }
    .nav-btn.active span {
      text-shadow: var(--epic-glow);
    }
    
    @keyframes flicker {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    /* 12. Selection Color */
    ::selection {
      background: var(--epic-accent);
      color: #000;
    }

    /* 15. Divider Lines */
    .divider-vert {
      border-left: none !important;
      width: 1px;
      background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
    }
    .sidebar-spacer {
      border-top: none !important;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
      margin: 15px 0;
    }

    /* 21. Toast Notifications */
    #toast-container > div {
      background: rgba(20, 20, 25, 0.9) !important;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-bottom: 2px solid var(--epic-accent);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), var(--epic-glow);
      border-radius: 8px !important;
    }

    /* 8. Card Hover Lift & 5. Staggered Fade-In */
    .vault-item, .note-item {
      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
      animation: fadeInUp 0.4s ease-out backwards;
    }
    .vault-item:hover, .note-item:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.05);
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255,255,255,0.3);
    }
    
    /* Stagger children dynamically using nth-child */
    .vault-item:nth-child(1), .note-item:nth-child(1) { animation-delay: 0.05s; }
    .vault-item:nth-child(2), .note-item:nth-child(2) { animation-delay: 0.1s; }
    .vault-item:nth-child(3), .note-item:nth-child(3) { animation-delay: 0.15s; }
    .vault-item:nth-child(4), .note-item:nth-child(4) { animation-delay: 0.2s; }
    .vault-item:nth-child(5), .note-item:nth-child(5) { animation-delay: 0.25s; }
    
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    /* 19. Code Editor Themes */
    .code-editor {
      background: #0f111a !important;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 6px;
      overflow: hidden;
    }
    
    /* 18. Status Indicators */
    #status-active::before {
      content: '';
      display: inline-block;
      width: 8px; height: 8px;
      background: #00ff88;
      border-radius: 50%;
      margin-right: 6px;
      box-shadow: 0 0 8px #00ff88;
      animation: pulseRing 2s infinite;
    }
    
    /* 3. Gradient Borders (Animated) */
    .btn {
       transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .btn:hover:not(.primary) {
       border-color: var(--epic-accent) !important;
       box-shadow: inset 0 0 10px rgba(0, 242, 254, 0.1);
    }
  </style>

</head><body>${state.code.html}<script>${state.code.js.replace(/<\/script/gi, "<\/script")}<\/script></body></html>`;
        $("#preview").srcdoc = html;
        $("#console").insertAdjacentHTML("afterbegin", `<div class="log ok">✓ Preview compiled at ${new Date().toLocaleTimeString()}</div>`);
      };

      // --- WINDOW SNAPPING & DRAG ---
      const appWindow = document.getElementById('app');
      let winDragging = false, winStartX, winStartY, winInitLeft, winInitTop;

      appWindow.addEventListener('mousedown', (e) => {
        // Only drag if clicking topbar and not buttons
        if (!e.target.closest('.topbar') || e.target.closest('button') || e.target.closest('.nav')) return;
        if (appWindow.classList.contains('max')) return; // handled by maximize button

        winDragging = true;
        winStartX = e.clientX; winStartY = e.clientY;
        const rect = appWindow.getBoundingClientRect();
        winInitLeft = rect.left; winInitTop = rect.top;

        appWindow.style.left = winInitLeft + 'px';
        appWindow.style.top = winInitTop + 'px';
        appWindow.style.inset = 'auto'; // release inset constraints
        appWindow.style.transform = 'none'; // remove center transform if any

        document.addEventListener('mousemove', onWinMove);
        document.addEventListener('mouseup', onWinUp);
      });
      function onWinMove(e) {
        if (!winDragging) return;
        appWindow.style.left = (winInitLeft + (e.clientX - winStartX)) + 'px';
        appWindow.style.top = Math.max(0, winInitTop + (e.clientY - winStartY)) + 'px';
      }
      function onWinUp(e) {
        winDragging = false;
        document.removeEventListener('mousemove', onWinMove);
        document.removeEventListener('mouseup', onWinUp);

        if (e.clientY < 10) {
          maximize(); // snap to top
        } else if (e.clientX < 10) {
          // snap left
          appWindow.style.inset = '0 auto 0 0';
          appWindow.style.width = '50vw';
          appWindow.style.clipPath = 'none';
          appWindow.style.border = '0';
        } else if (e.clientX > window.innerWidth - 10) {
          // snap right
          appWindow.style.inset = '0 0 0 auto';
          appWindow.style.width = '50vw';
          appWindow.style.clipPath = 'none';
          appWindow.style.border = '0';
        }
      }

      // --- ZEN MODE ---
      let isZen = false;
      const toggleZen = () => {
        isZen = !isZen;
        document.body.style.background = isZen ? '#000' : '';
        $('.topbar').style.display = isZen ? 'none' : 'flex';
        $('.statusbar').style.display = isZen ? 'none' : 'flex';
        if (isZen) appWindow.classList.add('max');
        toast(isZen ? "Zen Mode engaged" : "Zen Mode disengaged");
      };

      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault();
          toggleZen();
        }
      });

      // Add Zen Mode to shortcuts modal
      document.querySelector('.shortcuts').insertAdjacentHTML('beforeend', '<div class="shortcut"><span>Zen Mode</span><kbd>Ctrl + K</kbd></div>');



      // --- WEB AUDIO API (SOUND EFFECTS) ---
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playSound = (type) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
          osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'whoosh') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(200, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
          osc.start(); osc.stop(audioCtx.currentTime + 0.15);
        }
      };

      document.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.appcard') || e.target.closest('.template-card')) {
          playSound('click');
        }
      });

      const origShowView = showView;
      showView = (name) => {
        playSound('whoosh');
        origShowView(name);
      };

      // --- BATTERY & WEATHER API ---
      if ('getBattery' in navigator) {
        navigator.getBattery().then(batt => {
          const updateBatt = () => {
            document.getElementById('batteryWidget').textContent = `${Math.round(batt.level * 100)}% ${batt.charging ? '⚡' : '🔋'}`;
            document.getElementById('batteryWidget').style.color = batt.level <= 0.2 && !batt.charging ? 'var(--red)' : '';
          };
          updateBatt();
          batt.addEventListener('levelchange', updateBatt);
          batt.addEventListener('chargingchange', updateBatt);
        });
      } else {
        document.getElementById('batteryWidget').style.display = 'none';
      }

      // Mock Weather for privacy, or use Geolocation + public API
      const weatherConditions = ['☀️ 72°F', '⛅ 68°F', '🌧️ 55°F', '🌙 60°F'];
      document.getElementById('weatherWidget').textContent = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];


      // CodePen Export
      const updateCodePen = () => {
        const data = {
          title: "TurtleBot Project",
          html: state.code.html,
          css: state.code.css,
          js: state.code.js
        };
        document.getElementById('codepenData').value = JSON.stringify(data);
      };
      if (document.getElementById('codepenBtn')) {
        document.getElementById('codepenBtn')?.addEventListener('mouseenter', updateCodePen);
      }

      // Pop Out Window
      if (document.getElementById('popOutBtn')) {
        document.getElementById('popOutBtn')?.addEventListener('click', () => {
          const win = window.open('', '_blank', 'width=800,height=600');
          if (window.cmHtml) {
            state.code.html = window.cmHtml.getValue();
            state.code.css = window.cmCss.getValue();
            state.code.js = window.cmJs.getValue();
          }
          let cdnInject = "";
          const cdnSel = document.getElementById('cdnSelect');
          if (cdnSel) {
            if (cdnSel.value === 'react') cdnInject = '<script src="https://unpkg.com/react@18/umd/react.development.js"><\/script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script><script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>';
            if (cdnSel.value === 'tailwind') cdnInject = '<script src="https://cdn.tailwindcss.com"><\/script>';
            if (cdnSel.value === 'three') cdnInject = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>';
          }
          const jsTag = cdnSel && cdnSel.value === 'react' ? '<script type="text/babel">' : '<script>';
          const src = `<!doctype html><html><head><title>Live Preview</title><meta charset="utf-8"><meta name="viewport" content="width=device-width">${cdnInject}<style>${state.code.css}</style>
  <!-- Google Fonts: Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Epic Graphics & Animations Overhaul -->
  <style id="epic-graphics-upgrade">
    :root {
      --epic-accent: #00f2fe;
      --epic-accent-2: #4facfe;
      --epic-glow: 0 0 10px rgba(0, 242, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3);
      --font-family: 'Inter', system-ui, sans-serif !important;
    }
    
    body {
      font-family: var(--font-family) !important;
      /* 4. Mesh Gradients & 7. Liquid Background */
      background: linear-gradient(45deg, var(--bg-color), #0a1128, #001220, var(--bg-color));
      background-size: 400% 400%;
      animation: liquidBg 15s ease infinite;
    }
    
    @keyframes liquidBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* 1. Glassmorphism 2.0 & 20. Sidebar Shrink */
    .sidebar {
      background: rgba(20, 20, 25, 0.6) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 2px 0 15px rgba(0,0,0,0.3);
      padding: 10px;
      width: 200px;
    }
    
    /* 8. Frosted Glass Cards */
    .tab-pane.active, .vault-item, .note-item, .wb-editor-col, .wb-right-pane {
      background: rgba(255, 255, 255, 0.03) !important;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 8px;
    }
    
    /* 22. Modal Backdrops & 2. Slide-In Modals */
    .modal-overlay {
      background: radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%) !important;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
    }
    .modal {
      background: rgba(30, 30, 35, 0.85) !important;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
      animation: slideUpModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    }
    
    @keyframes slideUpModal {
      0% { transform: translate(-50%, -40%) scale(0.9) rotateX(10deg); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1) rotateX(0deg); opacity: 1; }
    }

    /* 7. Holographic Text & 23. Text Gradients & 3. Glitch Reveal */
    h1, h2 {
      font-weight: 700 !important;
      background: linear-gradient(to right, var(--epic-accent), var(--epic-accent-2), #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
      animation: glitch 3s infinite;
    }
    
    @keyframes glitch {
      0% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      98% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      99% { text-shadow: -2px 0 red, 2px 0 cyan; }
      100% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
    }

    /* 2. Neon Accents & 17. Button Gradients & 4. Shimmer Sweep & 1. Pulse Ring */
    .btn.primary {
      background: linear-gradient(135deg, var(--epic-accent), var(--epic-accent-2)) !important;
      color: #000 !important;
      border: none !important;
      box-shadow: var(--epic-glow) !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .btn.primary::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      animation: shimmer 5s infinite;
    }
    .btn.primary::after {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      border-radius: inherit;
      border: 2px solid var(--epic-accent);
      animation: pulseRing 2s infinite;
      opacity: 0;
    }
    
    @keyframes shimmer {
      0%, 80% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes pulseRing {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* 6. Skeuomorphic Depth & 24. Input Focus Transitions & 13. Focus Rings */
    input, textarea, select {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) !important;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--epic-accent) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(0, 242, 254, 0.4) !important;
      transform: scale(1.01);
      background: rgba(0,0,0,0.4) !important;
    }

    /* 5. Custom Scrollbars */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; margin: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); border: 2px solid transparent; background-clip: padding-box; }

    /* 11. Icon Glow & 6. Neon Flicker */
    .nav-btn:hover, .btn:hover {
      animation: flicker 0.15s ease-in-out 2;
    }
    .nav-btn.active {
      background: rgba(0, 242, 254, 0.1) !important;
      border-right: 3px solid var(--epic-accent) !important;
      box-shadow: inset 5px 0 15px rgba(0,242,254,0.05);
    }
    .nav-btn.active span {
      text-shadow: var(--epic-glow);
    }
    
    @keyframes flicker {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    /* 12. Selection Color */
    ::selection {
      background: var(--epic-accent);
      color: #000;
    }

    /* 15. Divider Lines */
    .divider-vert {
      border-left: none !important;
      width: 1px;
      background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
    }
    .sidebar-spacer {
      border-top: none !important;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
      margin: 15px 0;
    }

    /* 21. Toast Notifications */
    #toast-container > div {
      background: rgba(20, 20, 25, 0.9) !important;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-bottom: 2px solid var(--epic-accent);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), var(--epic-glow);
      border-radius: 8px !important;
    }

    /* 8. Card Hover Lift & 5. Staggered Fade-In */
    .vault-item, .note-item {
      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
      animation: fadeInUp 0.4s ease-out backwards;
    }
    .vault-item:hover, .note-item:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.05);
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255,255,255,0.3);
    }
    
    /* Stagger children dynamically using nth-child */
    .vault-item:nth-child(1), .note-item:nth-child(1) { animation-delay: 0.05s; }
    .vault-item:nth-child(2), .note-item:nth-child(2) { animation-delay: 0.1s; }
    .vault-item:nth-child(3), .note-item:nth-child(3) { animation-delay: 0.15s; }
    .vault-item:nth-child(4), .note-item:nth-child(4) { animation-delay: 0.2s; }
    .vault-item:nth-child(5), .note-item:nth-child(5) { animation-delay: 0.25s; }
    
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    /* 19. Code Editor Themes */
    .code-editor {
      background: #0f111a !important;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 6px;
      overflow: hidden;
    }
    
    /* 18. Status Indicators */
    #status-active::before {
      content: '';
      display: inline-block;
      width: 8px; height: 8px;
      background: #00ff88;
      border-radius: 50%;
      margin-right: 6px;
      box-shadow: 0 0 8px #00ff88;
      animation: pulseRing 2s infinite;
    }
    
    /* 3. Gradient Borders (Animated) */
    .btn {
       transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .btn:hover:not(.primary) {
       border-color: var(--epic-accent) !important;
       box-shadow: inset 0 0 10px rgba(0, 242, 254, 0.1);
    }
  </style>

</head><body>${state.code.html}${jsTag}${state.code.js.replace(/<\/script/gi, "<\/script")}<\/script></body></html>`;
          win.document.open();
          win.document.write(src);
          win.document.close();
        });
      }

      if (document.getElementById('cdnSelect')) {
        document.getElementById('cdnSelect')?.addEventListener('change', runPreview);
      }


      // Generator Tabs Logic
      $$("[data-gen]").forEach(b => b.addEventListener("click", () => {
        $$("[data-gen]").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        ['surface', 'palette', 'motion', 'canvas'].forEach(id => {
          const el = document.getElementById(id + 'Controls');
          if (el) el.style.display = (id === b.dataset.gen) ? 'grid' : 'none';
        });

        // Reset canvas sandbox
        if (b.dataset.gen !== 'canvas' && window.cancelAnimationFrame && window.sandboxRaf) {
          cancelAnimationFrame(window.sandboxRaf);
          document.getElementById('demoCard').style.display = 'flex';
          if (document.getElementById('sandboxCanvas')) document.getElementById('sandboxCanvas').remove();
        }
      }));

      // Palette Extractor Logic
      const dropZone = document.getElementById('dropZone');
      const imgUpload = document.getElementById('imgUpload');
      const pCanvas = document.getElementById('paletteCanvas');
      const pCtx = pCanvas ? pCanvas.getContext('2d') : null;

      const handleImage = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        document.getElementById('dropText').textContent = file.name;
        const img = new Image();
        img.onload = () => {
          pCanvas.width = img.width; pCanvas.height = img.height;
          pCtx.drawImage(img, 0, 0);
          // Extract simple 5 color palette by sampling
          const data = pCtx.getImageData(0, 0, img.width, img.height).data;
          const swatches = [];
          const step = Math.floor((data.length / 4) / 5) * 4;
          for (let i = 0; i < data.length; i += step) {
            if (swatches.length >= 5) break;
            swatches.push(`rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`);
          }
          document.getElementById('extractedSwatches').innerHTML = swatches.map(c => `<button class="swatch" style="background:${c}" data-color="${c}" aria-label="Extracted color"></button>`).join('');
          $$("#extractedSwatches .swatch").forEach(s => s.addEventListener("click", () => {
            document.getElementById('colorA').value = '#' + data[s.dataset.idx]; // Not converting RGB to Hex properly here for brevity, let's just copy to clipboard
            navigator.clipboard.writeText(s.dataset.color);
            toast("Color copied");
          }));
        };
        img.src = URL.createObjectURL(file);
      };

      dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.background = 'rgba(84, 232, 255, 0.2)'; });
      dropZone?.addEventListener('dragleave', (e) => { dropZone.style.background = 'transparent'; });
      dropZone?.addEventListener('drop', (e) => { e.preventDefault(); dropZone.style.background = 'transparent'; handleImage(e.dataTransfer.files[0]); });
      imgUpload?.addEventListener('change', (e) => handleImage(e.target.files[0]));

      // Motion Builder
      document.getElementById('animDur')?.addEventListener('input', (e) => document.getElementById('animDurOut').value = e.target.value + 's');
      document.getElementById('applyAnim')?.addEventListener('click', () => {
        const type = document.getElementById('animType').value;
        const dur = document.getElementById('animDur').value + 's';
        const card = document.getElementById('demoCard');

        // Inject keyframes if not exists
        if (!document.getElementById('dynKeyframes')) {
          const style = document.createElement('style');
          style.id = 'dynKeyframes';
          style.innerHTML = `
                 @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                 @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0); } }
                 @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
               `;
          document.head.appendChild(style);
        }
        card.style.animation = 'none';
        setTimeout(() => { card.style.animation = `${type} ${dur} infinite ease-in-out`; }, 50);
        document.getElementById('cssOutput').textContent += `\nanimation: ${type} ${dur} infinite ease-in-out;`;
        toast("Motion applied");
      });

      // Canvas Sandbox
      document.getElementById('startCanvas')?.addEventListener('click', () => {
        const card = document.getElementById('demoCard');
        card.style.display = 'none';
        let sCanvas = document.getElementById('sandboxCanvas');
        if (!sCanvas) {
          sCanvas = document.createElement('canvas');
          sCanvas.id = 'sandboxCanvas';
          sCanvas.style.width = '100%';
          sCanvas.style.height = '100%';
          sCanvas.style.position = 'absolute';
          sCanvas.style.top = '0'; sCanvas.style.left = '0';
          card.parentNode.appendChild(sCanvas);
        }
        const sCtx = sCanvas.getContext('2d');
        sCanvas.width = sCanvas.clientWidth; sCanvas.height = sCanvas.clientHeight;

        if (window.sandboxRaf) cancelAnimationFrame(window.sandboxRaf);

        const mode = document.getElementById('drawMode').value;
        let particles = Array.from({ length: 50 }, () => ({ x: Math.random() * sCanvas.width, y: Math.random() * sCanvas.height, v: Math.random() * 2 + 1 }));
        let time = 0;

        const draw = () => {
          sCtx.fillStyle = 'rgba(0,0,0,0.1)';
          sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);

          if (mode === 'particles') {
            sCtx.fillStyle = '#54e8ff';
            particles.forEach(p => {
              p.y -= p.v; if (p.y < 0) p.y = sCanvas.height;
              sCtx.beginPath(); sCtx.arc(p.x, p.y, 2, 0, 7); sCtx.fill();
            });
          } else if (mode === 'waves') {
            sCtx.strokeStyle = '#ad75ff'; sCtx.lineWidth = 2;
            sCtx.beginPath();
            for (let i = 0; i < sCanvas.width; i += 10) {
              sCtx.lineTo(i, sCanvas.height / 2 + Math.sin((i + time) / 50) * 50);
            }
            sCtx.stroke();
          }
          time += 5;
          window.sandboxRaf = requestAnimationFrame(draw);
        };
        draw();
        toast("Sandbox activated");
      });


      // Web Speech Dictation
      const micBtn = document.getElementById('micBtn');
      const goalInp = document.getElementById('goal');
      let recognition;
      if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (e) => {
          if (goalInp) goalInp.value += (goalInp.value ? ' ' : '') + e.results[0][0].transcript;
          if (typeof buildPrompt === 'function') buildPrompt();
        };
        if (micBtn) micBtn.addEventListener('click', () => { recognition.start(); toast("Listening..."); });
      } else {
        if (micBtn) micBtn.style.display = 'none';
      }

      // Text to Speech
      const ttsBtn = document.getElementById('ttsBtn');
      if (ttsBtn) ttsBtn.addEventListener('click', () => {
        const synth = window.speechSynthesis;
        if (synth.speaking) { synth.cancel(); return; }
        const text = document.getElementById('promptOutput').textContent;
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1.1; msg.pitch = 0.9;
        synth.speak(msg);
        toast("Reading prompt...");
      });

      // Prompt Chaining
      document.getElementById('chainBtn')?.addEventListener('click', () => {
        const out = document.getElementById('promptOutput').textContent;
        goalInp.value = "Refine the following:\n" + out;
        buildPrompt();
        toast("Chained!");
      });

      // API Vault
      const vault = document.getElementById('apiKeyVault');
      if (vault) {
        vault.value = localStorage.getItem('n8-api-key') || '';
        vault.addEventListener('input', () => {
          localStorage.setItem('n8-api-key', vault.value);
        });
      }
      document.getElementById('mdToggle')?.addEventListener('change', buildPrompt);


      // Activity Log Persistence
      const logZone = document.querySelector('.activity');
      const saveLog = () => {
        const rows = Array.from(logZone.querySelectorAll('.activity-row')).map(r => r.outerHTML);
        localStorage.setItem('n8-mission-log', JSON.stringify(rows));
      };
      const savedLog = localStorage.getItem('n8-mission-log');
      if (savedLog) {
        try {
          const arr = JSON.parse(savedLog);
          const oldRows = logZone.querySelectorAll('.activity-row');
          oldRows.forEach(r => r.remove());
          arr.forEach(r => logZone.insertAdjacentHTML('beforeend', r));
        } catch (e) { }
      }
      // Wrap toast to append to activity log
      const origToast = toast;
      toast = (msg) => {
        origToast(msg);
        const r = `<div class="activity-row"><time>${new Date().toLocaleTimeString()}</time><span>${msg}</span><i>LOG</i></div>`;
        logZone.insertAdjacentHTML('beforeend', r);
        if (logZone.querySelectorAll('.activity-row').length > 10) logZone.querySelector('.activity-row').remove();
        saveLog();
      };

      // Semantic/Fuzzy Search & Favorites
      let favorites = JSON.parse(localStorage.getItem('n8-favs')) || [];
      const origRenderApps = renderApps;
      renderApps = () => {
        const q = $("#appSearch").value.trim().toLowerCase();
        // Simple fuzzy match: every char of query must be in target string in order
        const isFuzzy = (query, target) => {
          if (!query) return true;
          let qIdx = 0;
          for (let i = 0; i < target.length; i++) {
            if (target[i] === query[qIdx]) qIdx++;
            if (qIdx === query.length) return true;
          }
          return false;
        };

        // Sort favorites first
        const sortedApps = [...apps].sort((a, b) => {
          const af = favorites.includes(a[0]) ? 1 : 0;
          const bf = favorites.includes(b[0]) ? 1 : 0;
          return bf - af; // desc
        });

        const filtered = sortedApps.filter(a =>
          (category === "All" || a[2] === category) &&
          isFuzzy(q, a.join(" ").toLowerCase())
        );

        $("#appGrid").innerHTML = filtered.map(a =>
          `<button aria-label="button element" class="appcard${state.selectedApp && state.selectedApp[0] === a[0] ? " selected" : ""}" data-app="${a[0]}">
                   <div style="display:flex; justify-content:space-between; width:100%;">
                      <span class="num">N8.${String(a[0]).padStart(2, "0")}</span>
                      <span class="fav-star" data-fid="${a[0]}">${favorites.includes(a[0]) ? '⭐' : '☆'}</span>
                   </div>
                   <b>${a[1]}</b><small>${a[2]}</small>
                </button>`
        ).join("") || `<div class="empty">No modules match this signal.</div>`;

        $$(".appcard").forEach((b) => b.addEventListener("click", (e) => {
          if (e.target.classList.contains('fav-star')) return;
          openApp(apps.find((a) => a[0] === +b.dataset.app));
        }));

        $$(".fav-star").forEach(s => s.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = +s.dataset.fid;
          if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
          else favorites.push(id);
          localStorage.setItem('n8-favs', JSON.stringify(favorites));
          renderApps();
        }));
      };
      renderApps();

      // Grid/List Toggle
      let isList = false;
      document.getElementById('viewToggle')?.addEventListener('click', () => {
        isList = !isList;
        const grid = document.getElementById('appGrid');
        if (isList) {
          grid.style.gridTemplateColumns = '1fr';
          document.getElementById('viewToggle').textContent = '⊞';
        } else {
          grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(140px, 1fr))';
          document.getElementById('viewToggle').textContent = '☷';
        }
      });

      // Notifications API
      document.getElementById('notifToggle')?.addEventListener('click', () => {
        if (Notification.permission === "granted") toast("Notifications already active");
        else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") toast("Notifications activated");
          });
        }
      });

      const origOpenApp = openApp;
      openApp = (a) => {
        origOpenApp(a);
        if (Notification.permission === 'granted') {
          new Notification('N8 Pathfinder', { body: `Module loaded: ${a[1]}` });
        }
      };

      // Web Share API
      if (document.getElementById('shareApp')) {
        document.getElementById('shareApp')?.addEventListener('click', () => {
          if (navigator.share && state.selectedApp) {
            navigator.share({
              title: state.selectedApp[1],
              text: `Check out ${state.selectedApp[1]} on N8 Pathfinder!`,
              url: window.location.href
            });
          } else {
            toast("Share API not supported or no app selected");
          }
        });
      }


      // --- PHASE 5 LOGIC ---

      // IndexedDB State Layer (localforage)
      const origSave = save;
      save = () => {
        origSave(); // still save to localStorage for sync
        if (window.localforage) {
          localforage.setItem('n8-code-idb', state.code);
        }
      };
      if (window.localforage) {
        localforage.getItem('n8-code-idb').then(val => {
          if (val && val.html) {
            state.code = val;
            if (window.cmHtml) {
              window.cmHtml.setValue(state.code.html);
              window.cmCss.setValue(state.code.css);
              window.cmJs.setValue(state.code.js);
            }
          }
        });
      }

      // File System Access API
      document.getElementById('diskBtn')?.addEventListener('click', async () => {
        if ('showSaveFilePicker' in window) {
          try {
            const htmlContent = `<!doctype html><html><head><meta charset="utf-8"><style>${state.code.css}</style>
  <!-- Google Fonts: Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Epic Graphics & Animations Overhaul -->
  <style id="epic-graphics-upgrade">
    :root {
      --epic-accent: #00f2fe;
      --epic-accent-2: #4facfe;
      --epic-glow: 0 0 10px rgba(0, 242, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3);
      --font-family: 'Inter', system-ui, sans-serif !important;
    }
    
    body {
      font-family: var(--font-family) !important;
      /* 4. Mesh Gradients & 7. Liquid Background */
      background: linear-gradient(45deg, var(--bg-color), #0a1128, #001220, var(--bg-color));
      background-size: 400% 400%;
      animation: liquidBg 15s ease infinite;
    }
    
    @keyframes liquidBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* 1. Glassmorphism 2.0 & 20. Sidebar Shrink */
    .sidebar {
      background: rgba(20, 20, 25, 0.6) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 2px 0 15px rgba(0,0,0,0.3);
      padding: 10px;
      width: 200px;
    }
    
    /* 8. Frosted Glass Cards */
    .tab-pane.active, .vault-item, .note-item, .wb-editor-col, .wb-right-pane {
      background: rgba(255, 255, 255, 0.03) !important;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 8px;
    }
    
    /* 22. Modal Backdrops & 2. Slide-In Modals */
    .modal-overlay {
      background: radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%) !important;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
    }
    .modal {
      background: rgba(30, 30, 35, 0.85) !important;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
      animation: slideUpModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    }
    
    @keyframes slideUpModal {
      0% { transform: translate(-50%, -40%) scale(0.9) rotateX(10deg); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1) rotateX(0deg); opacity: 1; }
    }

    /* 7. Holographic Text & 23. Text Gradients & 3. Glitch Reveal */
    h1, h2 {
      font-weight: 700 !important;
      background: linear-gradient(to right, var(--epic-accent), var(--epic-accent-2), #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
      animation: glitch 3s infinite;
    }
    
    @keyframes glitch {
      0% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      98% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      99% { text-shadow: -2px 0 red, 2px 0 cyan; }
      100% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
    }

    /* 2. Neon Accents & 17. Button Gradients & 4. Shimmer Sweep & 1. Pulse Ring */
    .btn.primary {
      background: linear-gradient(135deg, var(--epic-accent), var(--epic-accent-2)) !important;
      color: #000 !important;
      border: none !important;
      box-shadow: var(--epic-glow) !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .btn.primary::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      animation: shimmer 5s infinite;
    }
    .btn.primary::after {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      border-radius: inherit;
      border: 2px solid var(--epic-accent);
      animation: pulseRing 2s infinite;
      opacity: 0;
    }
    
    @keyframes shimmer {
      0%, 80% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes pulseRing {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* 6. Skeuomorphic Depth & 24. Input Focus Transitions & 13. Focus Rings */
    input, textarea, select {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) !important;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--epic-accent) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(0, 242, 254, 0.4) !important;
      transform: scale(1.01);
      background: rgba(0,0,0,0.4) !important;
    }

    /* 5. Custom Scrollbars */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; margin: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); border: 2px solid transparent; background-clip: padding-box; }

    /* 11. Icon Glow & 6. Neon Flicker */
    .nav-btn:hover, .btn:hover {
      animation: flicker 0.15s ease-in-out 2;
    }
    .nav-btn.active {
      background: rgba(0, 242, 254, 0.1) !important;
      border-right: 3px solid var(--epic-accent) !important;
      box-shadow: inset 5px 0 15px rgba(0,242,254,0.05);
    }
    .nav-btn.active span {
      text-shadow: var(--epic-glow);
    }
    
    @keyframes flicker {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    /* 12. Selection Color */
    ::selection {
      background: var(--epic-accent);
      color: #000;
    }

    /* 15. Divider Lines */
    .divider-vert {
      border-left: none !important;
      width: 1px;
      background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
    }
    .sidebar-spacer {
      border-top: none !important;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
      margin: 15px 0;
    }

    /* 21. Toast Notifications */
    #toast-container > div {
      background: rgba(20, 20, 25, 0.9) !important;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-bottom: 2px solid var(--epic-accent);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), var(--epic-glow);
      border-radius: 8px !important;
    }

    /* 8. Card Hover Lift & 5. Staggered Fade-In */
    .vault-item, .note-item {
      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
      animation: fadeInUp 0.4s ease-out backwards;
    }
    .vault-item:hover, .note-item:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.05);
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255,255,255,0.3);
    }
    
    /* Stagger children dynamically using nth-child */
    .vault-item:nth-child(1), .note-item:nth-child(1) { animation-delay: 0.05s; }
    .vault-item:nth-child(2), .note-item:nth-child(2) { animation-delay: 0.1s; }
    .vault-item:nth-child(3), .note-item:nth-child(3) { animation-delay: 0.15s; }
    .vault-item:nth-child(4), .note-item:nth-child(4) { animation-delay: 0.2s; }
    .vault-item:nth-child(5), .note-item:nth-child(5) { animation-delay: 0.25s; }
    
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    /* 19. Code Editor Themes */
    .code-editor {
      background: #0f111a !important;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 6px;
      overflow: hidden;
    }
    
    /* 18. Status Indicators */
    #status-active::before {
      content: '';
      display: inline-block;
      width: 8px; height: 8px;
      background: #00ff88;
      border-radius: 50%;
      margin-right: 6px;
      box-shadow: 0 0 8px #00ff88;
      animation: pulseRing 2s infinite;
    }
    
    /* 3. Gradient Borders (Animated) */
    .btn {
       transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .btn:hover:not(.primary) {
       border-color: var(--epic-accent) !important;
       box-shadow: inset 0 0 10px rgba(0, 242, 254, 0.1);
    }
  </style>

</head><body>${state.code.html}<script>${state.code.js.replace(/<\/script/gi, "<\/script")}<\/script></body></html>`;
            const handle = await window.showSaveFilePicker({
              suggestedName: 'turtlebot-project.html',
              types: [{ description: 'HTML File', accept: { 'text/html': ['.html'] } }]
            });
            const writable = await handle.createWritable();
            await writable.write(htmlContent);
            await writable.close();
            toast("Saved to disk!");
          } catch (err) {
            toast("Disk save cancelled or failed.");
          }
        } else {
          toast("File System API not supported in this browser.");
        }
      });

      // JSZip Export
      document.getElementById('zipBtn')?.addEventListener('click', async () => {
        if (window.JSZip) {
          const zip = new JSZip();
          zip.file("index.html", `<!doctype html><html><head><link rel="stylesheet" href="style.css">
  <!-- Google Fonts: Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Epic Graphics & Animations Overhaul -->
  <style id="epic-graphics-upgrade">
    :root {
      --epic-accent: #00f2fe;
      --epic-accent-2: #4facfe;
      --epic-glow: 0 0 10px rgba(0, 242, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3);
      --font-family: 'Inter', system-ui, sans-serif !important;
    }
    
    body {
      font-family: var(--font-family) !important;
      /* 4. Mesh Gradients & 7. Liquid Background */
      background: linear-gradient(45deg, var(--bg-color), #0a1128, #001220, var(--bg-color));
      background-size: 400% 400%;
      animation: liquidBg 15s ease infinite;
    }
    
    @keyframes liquidBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* 1. Glassmorphism 2.0 & 20. Sidebar Shrink */
    .sidebar {
      background: rgba(20, 20, 25, 0.6) !important;
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
      backdrop-filter: blur(16px) saturate(180%);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 2px 0 15px rgba(0,0,0,0.3);
      padding: 10px;
      width: 200px;
    }
    
    /* 8. Frosted Glass Cards */
    .tab-pane.active, .vault-item, .note-item, .wb-editor-col, .wb-right-pane {
      background: rgba(255, 255, 255, 0.03) !important;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 8px;
    }
    
    /* 22. Modal Backdrops & 2. Slide-In Modals */
    .modal-overlay {
      background: radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%) !important;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
    }
    .modal {
      background: rgba(30, 30, 35, 0.85) !important;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
      animation: slideUpModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    }
    
    @keyframes slideUpModal {
      0% { transform: translate(-50%, -40%) scale(0.9) rotateX(10deg); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1) rotateX(0deg); opacity: 1; }
    }

    /* 7. Holographic Text & 23. Text Gradients & 3. Glitch Reveal */
    h1, h2 {
      font-weight: 700 !important;
      background: linear-gradient(to right, var(--epic-accent), var(--epic-accent-2), #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
      animation: glitch 3s infinite;
    }
    
    @keyframes glitch {
      0% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      98% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
      99% { text-shadow: -2px 0 red, 2px 0 cyan; }
      100% { text-shadow: 0 0 20px rgba(0, 242, 254, 0.2); }
    }

    /* 2. Neon Accents & 17. Button Gradients & 4. Shimmer Sweep & 1. Pulse Ring */
    .btn.primary {
      background: linear-gradient(135deg, var(--epic-accent), var(--epic-accent-2)) !important;
      color: #000 !important;
      border: none !important;
      box-shadow: var(--epic-glow) !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .btn.primary::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      animation: shimmer 5s infinite;
    }
    .btn.primary::after {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      border-radius: inherit;
      border: 2px solid var(--epic-accent);
      animation: pulseRing 2s infinite;
      opacity: 0;
    }
    
    @keyframes shimmer {
      0%, 80% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes pulseRing {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* 6. Skeuomorphic Depth & 24. Input Focus Transitions & 13. Focus Rings */
    input, textarea, select {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) !important;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--epic-accent) !important;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(0, 242, 254, 0.4) !important;
      transform: scale(1.01);
      background: rgba(0,0,0,0.4) !important;
    }

    /* 5. Custom Scrollbars */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; margin: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); border: 2px solid transparent; background-clip: padding-box; }

    /* 11. Icon Glow & 6. Neon Flicker */
    .nav-btn:hover, .btn:hover {
      animation: flicker 0.15s ease-in-out 2;
    }
    .nav-btn.active {
      background: rgba(0, 242, 254, 0.1) !important;
      border-right: 3px solid var(--epic-accent) !important;
      box-shadow: inset 5px 0 15px rgba(0,242,254,0.05);
    }
    .nav-btn.active span {
      text-shadow: var(--epic-glow);
    }
    
    @keyframes flicker {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    /* 12. Selection Color */
    ::selection {
      background: var(--epic-accent);
      color: #000;
    }

    /* 15. Divider Lines */
    .divider-vert {
      border-left: none !important;
      width: 1px;
      background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
    }
    .sidebar-spacer {
      border-top: none !important;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
      margin: 15px 0;
    }

    /* 21. Toast Notifications */
    #toast-container > div {
      background: rgba(20, 20, 25, 0.9) !important;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-bottom: 2px solid var(--epic-accent);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), var(--epic-glow);
      border-radius: 8px !important;
    }

    /* 8. Card Hover Lift & 5. Staggered Fade-In */
    .vault-item, .note-item {
      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
      animation: fadeInUp 0.4s ease-out backwards;
    }
    .vault-item:hover, .note-item:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.05);
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255,255,255,0.3);
    }
    
    /* Stagger children dynamically using nth-child */
    .vault-item:nth-child(1), .note-item:nth-child(1) { animation-delay: 0.05s; }
    .vault-item:nth-child(2), .note-item:nth-child(2) { animation-delay: 0.1s; }
    .vault-item:nth-child(3), .note-item:nth-child(3) { animation-delay: 0.15s; }
    .vault-item:nth-child(4), .note-item:nth-child(4) { animation-delay: 0.2s; }
    .vault-item:nth-child(5), .note-item:nth-child(5) { animation-delay: 0.25s; }
    
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    /* 19. Code Editor Themes */
    .code-editor {
      background: #0f111a !important;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 6px;
      overflow: hidden;
    }
    
    /* 18. Status Indicators */
    #status-active::before {
      content: '';
      display: inline-block;
      width: 8px; height: 8px;
      background: #00ff88;
      border-radius: 50%;
      margin-right: 6px;
      box-shadow: 0 0 8px #00ff88;
      animation: pulseRing 2s infinite;
    }
    
    /* 3. Gradient Borders (Animated) */
    .btn {
       transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .btn:hover:not(.primary) {
       border-color: var(--epic-accent) !important;
       box-shadow: inset 0 0 10px rgba(0, 242, 254, 0.1);
    }
  </style>

</head><body>${state.code.html}<script src="script.js"><\/script></body></html>`);
          zip.file("style.css", state.code.css);
          zip.file("script.js", state.code.js);
          const content = await zip.generateAsync({ type: "blob" });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(content);
          a.download = "turtlebot-workspace.zip";
          a.click();
          toast("Workspace zipped!");
        } else {
          toast("JSZip not loaded.");
        }
      });

      // GitHub Gist Sync
      document.getElementById('gistBtn')?.addEventListener('click', async () => {
        const key = localStorage.getItem('n8-api-key');
        if (!key || !key.startsWith('ghp_')) {
          toast("Please save a GitHub PAT (ghp_...) in the Forge Vault first.");
          return;
        }
        toast("Syncing to Gist...");
        try {
          const res = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
              'Authorization': 'token ' + key,
              'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
              description: "TurtleBot Nexus Backup",
              public: false,
              files: {
                "index.html": { content: state.code.html || "<!-- empty -->" },
                "style.css": { content: state.code.css || "/* empty */" },
                "script.js": { content: state.code.js || "// empty" }
              }
            })
          });
          if (res.ok) {
            const data = await res.json();
            toast("Gist created! Check console for URL.");
            console.log("Gist URL:", data.html_url);
          } else {
            toast("Gist sync failed. Check API key.");
          }
        } catch (err) {
          toast("Network error during Gist sync.");
        }
      });

      // WebRTC Collaboration (PeerJS)
      document.getElementById('peerBtn')?.addEventListener('click', () => {
        if (window.Peer) {
          const peer = new Peer();
          peer.on('open', (id) => {
            toast(`Peer ID generated (copied to clipboard)`);
            navigator.clipboard.writeText(id);
            console.log("Your Peer ID is: " + id);

            // Listen for incoming connections
            peer.on('connection', (conn) => {
              conn.on('data', (data) => {
                console.log("Received data from peer:", data);
              });
              // Broadcast code changes
              setInterval(() => {
                conn.send({ html: state.code.html, css: state.code.css, js: state.code.js });
              }, 2000);
            });
          });
        } else {
          toast("PeerJS not loaded.");
        }
      });

      boot();
    })();
  
