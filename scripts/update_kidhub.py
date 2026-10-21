import os

fpath = r'c:\Users\qamel\Downloads\N8DEV\Kids\KidHub-64.html'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the root variables and themes
old_root = """      :root {
        --bg: #fff7e9;
        --bg2: #e7f8ff;
        --card: #fff;
        --soft: #fffaf2;
        --ink: #273654;
        --muted: #6f7890;
        --line: #e5e8f0;
        --pink: #ff5f7e;
        --blue: #20a9ec;
        --yellow: #ffc63c;
        --green: #2bc678;
        --purple: #8a6ee7;
        --orange: #ff914d;
        --shadow: 0 18px 55px #33476b1f;
        --font: ui-rounded, "Nunito", "Segoe UI", system-ui, sans-serif;
      }
      :root[data-theme="space"] {
        --bg: #161a35;
        --bg2: #292859;
        --card: #242947;
        --soft: #303657;
        --ink: #f7f5ff;
        --muted: #c6c8dc;
        --line: #42496d;
        --pink: #ff70a6;
        --blue: #57c9ff;
        --yellow: #ffd86d;
        --green: #56dda0;
        --purple: #aa96ff;
        --shadow: 0 20px 60px #06071966;
      }
      :root[data-theme="ocean"] {
        --bg: #e5fbff;
        --bg2: #e1f8ee;
        --card: #fff;
        --soft: #effcf8;
        --ink: #17475b;
        --muted: #567c8c;
        --line: #cde7e6;
        --pink: #ff718c;
        --blue: #009fd1;
        --green: #18b589;
      }"""

new_root = """      :root {
        --bg: #F3E8FF;
        --bg2: #E0F2FE;
        --card: rgba(255, 255, 255, 0.85);
        --soft: #FFFBEB;
        --ink: #1E1B4B;
        --muted: #334155;
        --line: rgba(255, 255, 255, 0.9);
        --pink: #F472B6;
        --blue: #38BDF8;
        --yellow: #FDE047;
        --green: #6EE7B7;
        --purple: #C084FC;
        --orange: #FB923C;
        --shadow: 0 10px 40px rgba(192, 132, 252, 0.15);
        --font: 'Fredoka', 'Quicksand', 'Nunito', sans-serif;
      }
      h1, h2, h3, h4, h5, h6 {
        text-shadow: 0 3px 0 rgba(0,0,0,0.06);
        letter-spacing: 0.5px;
      }"""

if old_root in content:
    content = content.replace(old_root, new_root)
else:
    print("Could not find old_root")

# 2. Replace body background
old_body = """      body {
        margin: 0;
        min-height: 100dvh;
        background-color: #ffe53b;
        background-image: 
          radial-gradient(circle at 10% 20%, rgba(255, 95, 126, 0.5) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(32, 169, 236, 0.5) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(138, 110, 231, 0.3) 0%, transparent 60%),
          url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='3' fill='rgba(255,255,255,0.6)'/%3E%3C/svg%3E");
        background-attachment: fixed;
        color: var(--ink);
        font: 700 18px/1.5 var(--font);
        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-x: hidden;
      }"""

new_body = """      body {
        margin: 0;
        min-height: 100dvh;
        background-color: var(--bg);
        background-image: 
          radial-gradient(circle at 15% 25%, rgba(244, 114, 182, 0.35) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(56, 189, 248, 0.35) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.25) 0%, transparent 65%);
        background-attachment: fixed;
        color: var(--ink);
        font: 700 18px/1.7 var(--font);
        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-x: hidden;
        letter-spacing: 0.3px;
      }
      #bubbles-canvas {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }"""
if old_body in content:
    content = content.replace(old_body, new_body)
else:
    print("Could not find old_body")

# Add canvas element
if '<div class="app">' in content:
    content = content.replace('<div class="app">', '<canvas id="bubbles-canvas"></canvas>\n    <div class="app">')
else:
    print("Could not find <div class='app'>")

# 3. Replace .app container styling
old_app = """      .app {
        position: relative;
        z-index: 1;
        width: min(1200px, calc(100% - 32px));
        min-height: calc(100dvh - 32px);
        margin: 16px auto;
        background: #fffffffa;
        backdrop-filter: blur(12px);
        border: 6px solid #ffffff;
        border-radius: 40px;
        box-shadow: 0 25px 60px rgba(0,0,0,0.1), inset 0 0 0 4px rgba(255,255,255,0.5);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }"""
new_app = """      .app {
        position: relative;
        z-index: 1;
        width: min(1200px, calc(100% - 32px));
        min-height: calc(100dvh - 32px);
        margin: 16px auto;
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 3px solid rgba(255, 255, 255, 0.9);
        border-radius: 36px;
        box-shadow: var(--shadow), inset 0 0 0 4px rgba(255,255,255,0.4);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }"""
if old_app in content:
    content = content.replace(old_app, new_app)
else:
    print("Could not find old_app")

# 4. Buttons (.btn)
old_btn = """      .btn {
        border: 2px solid rgba(0,0,0,0.1);
        border-radius: 20px;
        background: var(--ink);
        color: var(--card);
        padding: 12px 20px;
        font-weight: 900;
        font-size: 1.1rem;
        margin-top: 12px;
        transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s;
        box-shadow: 0 4px 0 rgba(0,0,0,0.15);
      }
      .btn:active {
        transform: translateY(4px);
        box-shadow: 0 0 0 rgba(0,0,0,0.15);
      }"""
new_btn = """      .btn {
        border: 3px solid rgba(255, 255, 255, 0.8);
        border-radius: 9999px;
        background: var(--pink);
        color: white;
        padding: 12px 24px;
        font-weight: 900;
        font-size: 1.1rem;
        margin-top: 12px;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        box-shadow: 0 6px 0 var(--purple), 0 8px 16px rgba(0,0,0,0.08);
      }
      .btn:hover {
        transform: scale(1.05) translateY(-2px);
      }
      .btn:active {
        transform: scale(0.96) translateY(2px);
        box-shadow: 0 2px 0 var(--purple), 0 4px 8px rgba(0,0,0,0.05);
      }"""
if old_btn in content:
    content = content.replace(old_btn, new_btn)
else:
    print("Could not find old_btn")

# 5. Cards (.card)
old_card = """      .card {
        min-height: 180px;
        background: var(--card);
        border: 4px solid var(--line);
        border-radius: 28px;
        padding: 20px;
        text-align: left;
        position: relative;
        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        cursor: pointer;
      }
      .card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 30px rgba(0,0,0,0.1);
        border-color: var(--blue);
      }"""
new_card = """      .card {
        min-height: 180px;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        border: 3px solid rgba(255, 255, 255, 0.9);
        border-radius: 32px;
        padding: 24px;
        text-align: left;
        position: relative;
        box-shadow: var(--shadow);
        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        cursor: pointer;
      }
      .card:hover {
        transform: translateY(-8px) scale(1.04);
        box-shadow: 0 15px 40px rgba(244, 114, 182, 0.25);
        border-color: var(--pink);
      }"""
if old_card in content:
    content = content.replace(old_card, new_card)
else:
    print("Could not find old_card")

# 6. Pills (.pill)
old_pill = """      .pill {
        height: 42px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--line);
        border-radius: 15px;
        background: var(--soft);
        white-space: nowrap;
      }"""
new_pill = """      .pill {
        height: 44px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 9999px;
        background: rgba(255,255,255,0.6);
        backdrop-filter: blur(5px);
        white-space: nowrap;
        font-weight: 800;
        box-shadow: 0 4px 10px rgba(0,0,0,0.03);
      }"""
if old_pill in content:
    content = content.replace(old_pill, new_pill)
else:
    print("Could not find old_pill")

# 7. Sidebar (.side)
old_side = """      .side {
        background: var(--card);
        border: 1px solid var(--line);
        padding: 16px;
      }"""
new_side = """      .side {
        background: rgba(255,255,255,0.5);
        backdrop-filter: blur(8px);
        border: 3px solid rgba(255,255,255,0.7);
        border-radius: 32px;
        padding: 20px;
        box-shadow: var(--shadow);
      }"""
if old_side in content:
    content = content.replace(old_side, new_side)
else:
    print("Could not find old_side")

# 8. Badge (.badge)
old_badge = """      .badge {
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        background: var(--soft);
        border-radius: 12px;
        font-size: 1.2rem;
        filter: grayscale(1);
        opacity: 0.3;
      }
      .badge.on {
        filter: none;
        opacity: 1;
        background: #fff2b9;
      }"""
new_badge = """      .badge {
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        background: rgba(255,255,255,0.6);
        border-radius: 16px;
        font-size: 1.4rem;
        filter: grayscale(1);
        opacity: 0.4;
        border: 2px solid transparent;
      }
      .badge.on {
        filter: none;
        opacity: 1;
        background: var(--yellow);
        border-color: rgba(255,255,255,0.9);
        box-shadow: 0 4px 12px rgba(253, 224, 71, 0.4);
        transform: scale(1.05);
      }"""
if old_badge in content:
    content = content.replace(old_badge, new_badge)
else:
    print("Could not find old_badge")

# Add the bubbles script just before </body>
bubbles_script = """
    <script>
      (function() {
        const canvas = document.getElementById('bubbles-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let bubbles = [];
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        
        class Bubble {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 200;
                this.radius = 15 + Math.random() * 40;
                this.speedY = 0.5 + Math.random() * 1.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                
                const colors = [
                    'rgba(244, 114, 182, 0.35)',
                    'rgba(110, 231, 183, 0.35)',
                    'rgba(56, 189, 248, 0.35)', 
                    'rgba(253, 224, 71, 0.35)' 
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.01 + Math.random() * 0.02;
            }
            update() {
                this.y -= this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += Math.sin(this.wobble) * 1.5;
                
                if (this.y + this.radius < 0) {
                    this.y = canvas.height + this.radius;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.fill();
            }
        }
        
        for (let i = 0; i < 25; i++) {
            bubbles.push(new Bubble());
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bubbles.forEach(b => {
                b.update();
                b.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
      })();
    </script>
"""
if bubbles_script not in content:
    content = content.replace('</body>', bubbles_script + '</body>')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("KidHub-64 CSS updated successfully!")
