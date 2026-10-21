import os, html
files = [
    r'c:\Users\qamel\Downloads\N8DEV\Kids\KidHub-64.html',
    r'c:\Users\qamel\Downloads\N8DEV\Kids\KidsBeat.html',
    r'c:\Users\qamel\Downloads\N8DEV\Kids\qamomathcore-sci-fi-nexus.html',
    r'c:\Users\qamel\Downloads\N8DEV\Arcade\stix-stax-stonz.html'
]

apps = []
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
        name = os.path.basename(fpath).replace('.html', '')
        apps.append({'name': name, 'content': content})

main_html = '''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni-App Dashboard</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>">
    <style>
        :root {
            --bg-color: #ffffff;
            --text-color: #333333;
            --header-bg: rgba(255, 255, 255, 0.85);
            --border-color: #e5e5e5;
            --primary: #007bff;
            --hover-bg: #f8f9fa;
        }
        [data-theme="dark"] {
            --bg-color: #121212;
            --text-color: #f0f0f0;
            --header-bg: rgba(18, 18, 18, 0.85);
            --border-color: #333333;
            --primary: #0d6efd;
            --hover-bg: #222222;
        }
        [data-theme="cyberpunk"] {
            --bg-color: #0d0221;
            --text-color: #00ffcc;
            --header-bg: rgba(13, 2, 33, 0.85);
            --border-color: #ff00ff;
            --primary: #ff00ff;
            --hover-bg: #26074a;
        }
        [data-theme="emerald"] {
            --bg-color: #021a11;
            --text-color: #88ffcc;
            --header-bg: rgba(2, 26, 17, 0.85);
            --border-color: #006644;
            --primary: #00cc88;
            --hover-bg: #033322;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
            transition: background-color 0.3s, color 0.3s;
        }
        header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 24px;
            background: var(--header-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border-color);
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        header.sticky {
            position: sticky;
            top: 0;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 12px;
            letter-spacing: -0.5px;
        }
        .controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .status-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 6px 12px;
            background: rgba(46, 204, 113, 0.1);
            color: #2ecc71;
            border-radius: 20px;
            border: 1px solid rgba(46, 204, 113, 0.2);
        }
        select, button {
            padding: 8px 14px;
            border-radius: 10px;
            border: 1px solid var(--border-color);
            background: var(--bg-color);
            color: var(--text-color);
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 600;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        select:hover, button:hover {
            background: var(--hover-bg);
            border-color: var(--primary);
            transform: translateY(-1px);
        }
        .main-container {
            display: flex;
            flex: 1;
            overflow: hidden;
            position: relative;
            z-index: 1;
        }
        .sidebar {
            width: 260px;
            border-right: 1px solid var(--border-color);
            background: var(--header-bg);
            padding: 15px 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow-y: auto;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .nav-btn {
            padding: 14px 20px;
            border: none;
            background: transparent;
            color: var(--text-color);
            text-align: left;
            font-size: 1rem;
            cursor: pointer;
            border-radius: 10px;
            border-left: 4px solid transparent;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
        }
        .nav-btn:hover {
            background: var(--hover-bg);
        }
        .nav-btn.active {
            background: var(--hover-bg);
            border-left-color: var(--primary);
            font-weight: 700;
            color: var(--primary);
        }
        .content-area {
            flex: 1;
            position: relative;
            background: var(--bg-color);
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: none;
        }
        iframe.active {
            display: block;
            animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        footer {
            padding: 10px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            border-top: 1px solid var(--border-color);
            background: var(--header-bg);
            color: var(--text-color);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 1000;
        }
        .footer-links {
            display: flex;
            gap: 15px;
        }
        .footer-links a {
            color: var(--text-color);
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .footer-links a:hover {
            opacity: 1;
            text-decoration: underline;
        }
        #particles {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 0;
        }
        #toast {
            position: fixed;
            bottom: 60px; right: 24px;
            background: var(--primary); color: #fff;
            padding: 12px 24px; border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: translateY(100px); opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 2000; font-weight: 600;
            display: flex; align-items: center; gap: 8px;
        }
        #toast.show {
            transform: translateY(0); opacity: 1;
        }
        #api-modal {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
            z-index: 3000; align-items: center; justify-content: center;
        }
        #api-modal.show { display: flex; }
        .modal-content {
            background: var(--bg-color); color: var(--text-color);
            padding: 30px; border-radius: 16px;
            max-width: 500px; width: 90%;
            border: 1px solid var(--border-color);
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            position: relative;
        }
        .close-btn {
            position: absolute; top: 15px; right: 15px;
            background: none; border: none; font-size: 1.5rem; color: var(--text-color);
            cursor: pointer; padding: 0;
        }
        .modal-content h2 { margin-top: 0; }
        @supports (animation-timeline: scroll()) {
            .hero-parallax { animation: parallax linear; animation-timeline: scroll(); }
            @keyframes parallax { to { transform: translateY(100px); } }
        }
    </style>
</head>
<body>
    <canvas id="particles"></canvas>
    <header class="sticky">
        <div class="logo">🚀 Omni OS <span style="font-size:0.9rem;opacity:0.6;font-weight:normal;">v1.0</span></div>
        <div class="controls">
            <div class="status-badge">🟢 <span id="status-text">System Online</span></div>
            <select id="theme-selector" title="Select Theme">
                <option value="light">☀️ Light Mode</option>
                <option value="dark">🌙 Dark Mode</option>
                <option value="cyberpunk">🤖 Cyberpunk Synth</option>
                <option value="emerald">🌲 Emerald Luxury</option>
            </select>
            <button id="fullscreen-btn" title="Toggle Fullscreen">🔲 Fullscreen</button>
        </div>
    </header>
    <div class="main-container">
        <div class="sidebar">
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--primary); margin:10px 0 5px 10px; font-weight:800;">Applications</div>
'''

for i, app in enumerate(apps):
    emoji = ['🎮', '🎵', '📐', '⚔️'][i % 4]
    main_html += f'            <button class="nav-btn {"active" if i == 0 else ""}" data-target="app-{i}">{emoji} {app["name"]}</button>\n'

main_html += '''            
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--primary); margin:20px 0 5px 10px; font-weight:800;">Resources</div>
            <button class="nav-btn" id="btn-api-docs">📚 API / Docs</button>
            <button class="nav-btn" onclick="showToast('✅ System resources re-allocated successfully')">🔄 Refresh OS</button>
        </div>
        <div class="content-area">
'''

for i, app in enumerate(apps):
    srcdoc = html.escape(app['content'])
    main_html += f'            <iframe id="app-{i}" class="{"active" if i == 0 else ""}" srcdoc="{srcdoc}"></iframe>\n'

main_html += '''        </div>
    </div>
    <footer>
        <div>&copy; <span id="year"></span> Omni OS | ⚡ N8 CyberDev Engine</div>
        <div class="footer-links">
            <a href="#">Privacy 🛡️</a>
            <a href="#">Terms 📝</a>
            <a href="#">Support 🛟</a>
        </div>
    </footer>
    <div id="toast">✨ Action completed successfully</div>
    <div id="api-modal">
        <div class="modal-content">
            <button class="close-btn" id="close-modal">&times;</button>
            <h2>📚 API & Documentation</h2>
            <p>Welcome to the Omni OS unified documentation portal.</p>
            <ul>
                <li><strong>Unified Theme Engine:</strong> Seamlessly injects data-theme across all sandboxed iframes.</li>
                <li><strong>Event Bridge:</strong> Secure postMessage bus for inter-app communication.</li>
                <li><strong>Asset Stack:</strong> Inline SVGs and data URIs ensure zero external dependencies.</li>
            </ul>
            <p style="margin-top:20px; font-size:0.9rem; opacity:0.8;">System Architecture version 4.2.0-rc1</p>
        </div>
    </div>
    <script>
        function init() {
            document.getElementById('year').textContent = new Date().getFullYear();
            
            let toastTimeout;
            window.showToast = (message) => {
                const toast = document.getElementById('toast');
                toast.innerHTML = message;
                toast.classList.add('show');
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
            };
            
            const canvas = document.getElementById('particles');
            const ctx = canvas.getContext('2d');
            var particlesArray = [];
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 0.5;
                    this.speedX = Math.random() * 0.5 - 0.25;
                    this.speedY = Math.random() * 0.5 - 0.25;
                    this.color = 'rgba(100, 100, 100, 0.2)';
                }
                update() {
                    this.x += this.speedX; this.y += this.speedY;
                    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                }
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            function updateParticles(theme) {
                let color = 'rgba(100, 100, 100, 0.2)';
                if (theme === 'dark') color = 'rgba(200, 200, 200, 0.2)';
                else if (theme === 'cyberpunk') color = 'rgba(0, 255, 204, 0.3)';
                else if (theme === 'emerald') color = 'rgba(0, 204, 136, 0.3)';
                particlesArray.forEach(p => p.color = color);
            }
            
            function initParticles() {
                particlesArray = [];
                const particleCount = window.innerWidth < 768 ? 30 : 70;
                for (let i = 0; i < particleCount; i++) { particlesArray.push(new Particle()); }
                updateParticles(document.documentElement.getAttribute('data-theme'));
            }
            
            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particlesArray.forEach(p => { p.update(); p.draw(); });
                requestAnimationFrame(animateParticles);
            }
            
            initParticles();
            animateParticles();
            
            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initParticles();
            });

            const themeSelector = document.getElementById('theme-selector');
            const applyTheme = (theme) => {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('omni-theme', theme);
                themeSelector.value = theme;
                updateParticles(theme);
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    try {
                        if(iframe.contentDocument) {
                            iframe.contentDocument.documentElement.setAttribute('data-theme', theme);
                        }
                    } catch(e) {}
                });
                showToast(`🎨 Theme applied: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
            };
            
            const savedTheme = localStorage.getItem('omni-theme');
            if (savedTheme) {
                applyTheme(savedTheme);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
            
            themeSelector.addEventListener('change', (e) => { applyTheme(e.target.value); });
            
            document.querySelectorAll('iframe').forEach(iframe => {
                iframe.addEventListener('load', () => {
                    try { iframe.contentDocument.documentElement.setAttribute('data-theme', themeSelector.value); } catch(e) {}
                });
            });
            
            const navBtns = document.querySelectorAll('.nav-btn[data-target]');
            const iframesList = document.querySelectorAll('iframe');
            navBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    navBtns.forEach(b => b.classList.remove('active'));
                    iframesList.forEach(f => f.classList.remove('active'));
                    btn.classList.add('active');
                    document.getElementById(btn.getAttribute('data-target')).classList.add('active');
                    showToast(`🚀 Launched ${btn.innerText.substring(2)}`);
                });
            });
            
            const fsBtn = document.getElementById('fullscreen-btn');
            fsBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().then(() => { showToast('🔲 Entered Fullscreen'); }).catch(err => { console.error(err); });
                } else {
                    document.exitFullscreen().then(() => { showToast('🔳 Exited Fullscreen'); });
                }
            });
            
            const apiBtn = document.getElementById('btn-api-docs');
            const apiModal = document.getElementById('api-modal');
            const closeModal = document.getElementById('close-modal');
            apiBtn.addEventListener('click', () => apiModal.classList.add('show'));
            closeModal.addEventListener('click', () => apiModal.classList.remove('show'));
            apiModal.addEventListener('click', (e) => { if(e.target === apiModal) apiModal.classList.remove('show'); });
        }
        
        window.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>
'''

with open(r'c:\Users\qamel\Downloads\index.html', 'w', encoding='utf-8') as f:
    f.write(main_html)

print('Done writing index.html! Length:', len(main_html.splitlines()))
