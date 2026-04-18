<template>
  <div class="home">

    <!-- ── Top bar ── -->
    <header class="topbar">
      <div class="topbar-inner">
        <div class="topbar-brand">
          <div class="topbar-brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span class="topbar-brand-name">Claude × SAP — MCP Tool Hub</span>
        </div>
        <div class="topbar-tags">
          <span class="tag">Claude Code</span>
          <span class="tag">S/4HANA</span>
          <span class="tag tag--accent">3 Servers · 29 Tools</span>
        </div>
        <a class="topbar-gh" href="https://github.com/abdulsameemd/abap-mcp-server" target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          GitHub
        </a>
      </div>
    </header>

    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">
          MCP Tool Hub <span class="hero-accent">— SAP</span>
        </h1>
        <p class="hero-sub">
          Three production-grade MCP servers connecting Claude to your SAP
          landscape — explore every tool, request &amp; response, right here.
        </p>

        <div class="hero-pills">
          <span class="hero-pill hero-pill--green">
            <span class="pill-dot" style="background:#16a34a"></span>
            ABAP · 14 tools
          </span>
          <span class="hero-pill hero-pill--blue">
            <span class="pill-dot" style="background:#2563eb"></span>
            Fiori Tools · 5 tools
          </span>
          <span class="hero-pill hero-pill--amber">
            <span class="pill-dot" style="background:#d97706"></span>
            UI5 · 10 tools
          </span>
        </div>
      </div>

      <!-- Hero grid (decorative stats) -->
      <div class="hero-grid">
        <div class="hero-stat-card">
          <div class="hs-num">29</div>
          <div class="hs-lbl">Total Tools</div>
        </div>
        <div class="hero-stat-card">
          <div class="hs-num" style="color:#16a34a">24</div>
          <div class="hs-lbl">Read-only</div>
        </div>
        <div class="hero-stat-card">
          <div class="hs-num" style="color:#d97706">5</div>
          <div class="hs-lbl">Write Tools</div>
        </div>
        <div class="hero-stat-card">
          <div class="hs-num">3</div>
          <div class="hs-lbl">MCP Servers</div>
        </div>
        <div class="hero-stat-card hero-stat-card--wide">
          <div class="hs-num" style="font-size:18px">S/4HANA</div>
          <div class="hs-lbl">2023+ · CAP · Fiori · UI5</div>
        </div>
      </div>

      <!-- Presentation banner — full-width strip at bottom of hero -->
      <div class="ppt-strip">
        <div class="ppt-strip-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <span class="ppt-strip-title">SAP Development AI — DEWA</span>
          <span class="ppt-strip-divider"></span>
        </div>
        <div class="ppt-strip-ticker">
          <div class="ppt-strip-track">
            <span class="ppt-chip ppt-chip--blue">Phase 1 · UI5 / Fiori MCP</span>
            <span class="ppt-chip ppt-chip--green">Phase 2 · ABAP Custom MCP</span>
            <span class="ppt-chip ppt-chip--amber">Phase 3 · BTP Integration Suite</span>
            <span class="ppt-chip-sep">·</span>
            <span class="ppt-chip ppt-chip--blue">Phase 1 · UI5 / Fiori MCP</span>
            <span class="ppt-chip ppt-chip--green">Phase 2 · ABAP Custom MCP</span>
            <span class="ppt-chip ppt-chip--amber">Phase 3 · BTP Integration Suite</span>
            <span class="ppt-chip-sep">·</span>
          </div>
        </div>
        <a href="./SAP_Development_AI_DEWA.pptx" class="ppt-strip-btn">
          Open
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        </a>
      </div>
    </section>

    <!-- ── Server cards ── -->
    <section class="servers">
      <div class="servers-inner">

        <!-- ABAP MCP -->
        <div class="server-card server-card--green">
          <div class="sc-stripe"></div>
          <div class="sc-body">
            <div class="sc-top">
              <div class="sc-icon sc-icon--green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="sc-meta">
                <div class="sc-name">ABAP MCP Server</div>
                <code class="sc-pkg">@sap-ux/abap-mcp-server</code>
              </div>
              <div class="sc-badge sc-badge--green">14 tools</div>
            </div>

            <p class="sc-desc">Search, analyse, generate, review and transport ABAP code through SAP ADT REST endpoints. Read object sources, run ATC, generate WRICEF specs and CDS views — all from natural language.</p>

            <div class="sc-cats">
              <span v-for="(cat, key) in servers.abap.cats" :key="key" class="sc-cat" :class="`sc-cat--${cat.color}`">
                {{ cat.label }}
              </span>
            </div>

            <div class="sc-stats">
              <div class="sc-stat">
                <span class="sc-stat-n">13</span>
                <span class="sc-stat-l">read-only</span>
              </div>
              <div class="sc-stat-sep"></div>
              <div class="sc-stat">
                <span class="sc-stat-n" style="color:#d97706">1</span>
                <span class="sc-stat-l">writes SAP</span>
              </div>
              <div class="sc-stat-sep"></div>
              <div class="sc-stat">
                <span class="sc-stat-n">6</span>
                <span class="sc-stat-l">categories</span>
              </div>
            </div>

            <RouterLink to="/abap" class="sc-btn sc-btn--green">
              Open ABAP Explorer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </RouterLink>
          </div>
        </div>

        <!-- Fiori Tools MCP -->
        <div class="server-card server-card--blue">
          <div class="sc-stripe"></div>
          <div class="sc-body">
            <div class="sc-top">
              <div class="sc-icon sc-icon--blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div class="sc-meta">
                <div class="sc-name">Fiori Tools MCP Server</div>
                <code class="sc-pkg">@sap-ux/fiori-mcp-server</code>
              </div>
              <div class="sc-badge sc-badge--blue">5 tools</div>
            </div>

            <p class="sc-desc">Generate and modify SAP Fiori elements applications from OData services and CAP projects. 3-step orchestration workflow: discover → configure → execute. Supports List Report, Object Page, FCL and more.</p>

            <div class="sc-cats">
              <span v-for="(cat, key) in servers.fiori.cats" :key="key" class="sc-cat" :class="`sc-cat--${cat.color}`">
                {{ cat.label }}
              </span>
            </div>

            <div class="sc-stats">
              <div class="sc-stat">
                <span class="sc-stat-n">4</span>
                <span class="sc-stat-l">read-only</span>
              </div>
              <div class="sc-stat-sep"></div>
              <div class="sc-stat">
                <span class="sc-stat-n" style="color:#d97706">1</span>
                <span class="sc-stat-l">writes disk</span>
              </div>
              <div class="sc-stat-sep"></div>
              <div class="sc-stat">
                <span class="sc-stat-n">2</span>
                <span class="sc-stat-l">categories</span>
              </div>
            </div>

            <RouterLink to="/fiori" class="sc-btn sc-btn--blue">
              Open Fiori Explorer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </RouterLink>
          </div>
        </div>

        <!-- UI5 MCP -->
        <div class="server-card server-card--amber">
          <div class="sc-stripe"></div>
          <div class="sc-body">
            <div class="sc-top">
              <div class="sc-icon sc-icon--amber">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="8 6 2 12 8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="sc-meta">
                <div class="sc-name">UI5 MCP Server</div>
                <code class="sc-pkg">@ui5/mcp-server</code>
              </div>
              <div class="sc-badge sc-badge--amber">10 tools</div>
            </div>

            <p class="sc-desc">Scaffold UI5 and OpenUI5 apps, fetch version-aware API documentation, run @ui5/linter, validate card manifests, and get TypeScript conversion guides — direct from Claude.</p>

            <div class="sc-cats">
              <span v-for="(cat, key) in servers.ui5.cats" :key="key" class="sc-cat" :class="`sc-cat--${cat.color}`">
                {{ cat.label }}
              </span>
            </div>

            <div class="sc-stats">
              <div class="sc-stat">
                <span class="sc-stat-n">7</span>
                <span class="sc-stat-l">read-only</span>
              </div>
              <div class="sc-stat-sep"></div>
              <div class="sc-stat">
                <span class="sc-stat-n" style="color:#d97706">3</span>
                <span class="sc-stat-l">writes disk</span>
              </div>
              <div class="sc-stat-sep"></div>
              <div class="sc-stat">
                <span class="sc-stat-n">4</span>
                <span class="sc-stat-l">categories</span>
              </div>
            </div>

            <RouterLink to="/ui5" class="sc-btn sc-btn--amber">
              Open UI5 Explorer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </RouterLink>
          </div>
        </div>

      </div>
    </section>

    <!-- ── How it works ── -->
    <section class="how">
      <div class="how-inner">
        <div class="how-header">
          <h2 class="how-title">How It Works</h2>
          <p class="how-sub">Claude speaks SAP's protocols directly — no middleware, no proxy, no custom code.</p>
        </div>

        <div class="how-steps">
          <div class="how-step" v-for="(step, i) in howSteps" :key="i">
            <div class="how-num">{{ i + 1 }}</div>
            <div class="how-step-title">{{ step.title }}</div>
            <div class="how-step-desc">{{ step.desc }}</div>
          </div>
        </div>

        <div class="corner-credit">MOROHUB &mdash; SAP Technical Services</div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { servers } from '../data/serverRegistry.js'

const howSteps = [
  {
    title: 'Connect MCP Server',
    desc: 'Configure any of the 3 MCP servers with your SAP system credentials, system URL, and client number in Claude Code settings.'
  },
  {
    title: 'Ask Claude',
    desc: 'Type in plain English — "search for ZCL_INVOICE classes", "generate a Fiori app for my OData service", or "lint my UI5 project".'
  },
  {
    title: 'SAP Responds',
    desc: 'Claude picks the right MCP tool, calls the SAP endpoint or runs the operation, and returns structured, actionable results.'
  }
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --bg: #faf9f7; --bg-2: #f5f4f1; --bg-3: #eeedea; --bg-4: #e5e3de;
  --t-primary: #1e1d1a; --t-secondary: #5a5852; --t-muted: #8a8780; --t-faint: #b0ada6;
  --border: #e0deda; --border-2: #cbc9c3;
  --accent: #0f4024; --accent-2: #0a2e1a; --accent-bg: #e8f5ec;
  --c-success: #16a34a; --c-warn: #c2790a;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app { height: 100%; }
body { font-family: var(--font-body); background: var(--bg-2); color: var(--t-primary); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }

.home { min-height: 100vh; display: flex; flex-direction: column; }

/* ── Topbar ── */
.topbar { background: var(--bg); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
.topbar-inner { max-width: 1140px; margin: 0 auto; padding: 0 20px; height: 52px; display: flex; align-items: center; gap: 12px; }
.topbar-brand { display: flex; align-items: center; gap: 9px; min-width: 0; }
.topbar-brand-icon { width: 28px; height: 28px; background: var(--accent); color: #fff; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.topbar-brand-name { font-family: var(--font-display); font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.topbar-tags { display: flex; gap: 6px; margin-left: auto; flex-shrink: 0; }
.tag { font-size: 11px; font-family: var(--font-mono); padding: 3px 8px; border-radius: 5px; background: var(--bg-3); color: var(--t-muted); border: 1px solid var(--border); white-space: nowrap; }
.tag--accent { background: var(--accent-bg); color: var(--accent); border-color: #a7f3c4; font-weight: 600; }
.topbar-gh { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--t-secondary); text-decoration: none; border: 1px solid var(--border); border-radius: 7px; padding: 6px 12px; transition: all .15s; white-space: nowrap; flex-shrink: 0; }
.topbar-gh:hover { background: var(--bg-3); color: var(--t-primary); }
/* Tablet: hide the two plain tags, keep accent tag */
@media (max-width: 768px) { .topbar-tags .tag:not(.tag--accent) { display: none; } }
/* Mobile: hide all tags */
@media (max-width: 520px) { .topbar-tags { display: none; } .topbar-gh span { display: none; } .topbar-gh { padding: 6px 8px; } }

/* ── Hero ── */
.hero { max-width: 1140px; margin: 0 auto; padding: 56px 20px 40px; display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: center; }
.hero-inner { display: flex; flex-direction: column; gap: 20px; }
.hero-title { font-family: var(--font-display); font-size: clamp(26px, 5vw, 46px); font-weight: 700; line-height: 1.1; color: var(--t-primary); letter-spacing: -.02em; }
.hero-accent { color: var(--accent); }
.hero-sub { font-size: 15px; color: var(--t-secondary); line-height: 1.7; }
.hero-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.hero-pill { display: flex; align-items: center; gap: 6px; font-size: 12px; font-family: var(--font-display); font-weight: 500; padding: 5px 12px; border-radius: 20px; border: 1px solid; }
.hero-pill--green { background: #f0fdf4; color: #14532d; border-color: #86efac; }
.hero-pill--blue  { background: #eff6ff; color: #1e3a8a; border-color: #93c5fd; }
.hero-pill--amber { background: #fffbeb; color: #78350f; border-color: #fcd34d; }
.pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
/* Tablet: collapse stat grid */
@media (max-width: 860px) { .hero { grid-template-columns: 1fr; padding: 36px 20px 28px; } .hero-grid { display: none; } }
@media (max-width: 480px) { .hero { padding: 28px 16px 20px; } }

/* Hero stat grid */
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.hero-stat-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; display: flex; flex-direction: column; gap: 4px; }
.hero-stat-card--wide { grid-column: 1 / -1; }
.hs-num { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--t-primary); line-height: 1; }
.hs-lbl { font-size: 11px; color: var(--t-faint); text-transform: uppercase; letter-spacing: .05em; }

/* ── Presentation Banner Strip ── */
.ppt-strip {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  height: 44px;
}
.ppt-strip-left {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  flex-shrink: 0;
  color: var(--t-muted);
  border-right: 1px solid var(--border);
  height: 100%;
}
.ppt-strip-title {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--t-primary);
  white-space: nowrap;
}
.ppt-strip-divider { display: none; }
/* Scrolling ticker */
.ppt-strip-ticker {
  flex: 1;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  min-width: 0;
}
.ppt-strip-track {
  display: flex;
  align-items: center;
  gap: 10px;
  width: max-content;
  animation: ppt-scroll 20s linear infinite;
  padding: 0 12px;
}
.ppt-strip-track:hover { animation-play-state: paused; }
@keyframes ppt-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.ppt-chip {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}
.ppt-chip--blue  { background: #eff6ff; color: #1e40af; }
.ppt-chip--green { background: #f0fdf4; color: #14532d; }
.ppt-chip--amber { background: #fffbeb; color: #78350f; }
.ppt-chip-sep { color: var(--border-2); font-size: 14px; flex-shrink: 0; }
.ppt-strip-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 14px;
  height: 44px;
  background: var(--bg-3);
  border-left: 1px solid var(--border);
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background .15s, color .15s;
}
.ppt-strip-btn:hover { background: var(--accent); color: #fff; }
/* Mobile: hide the label, keep ticker + button */
@media (max-width: 520px) { .ppt-strip-left { display: none; } }

/* ── Server cards ── */
.servers { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 40px 0; }
.servers-inner { max-width: 1140px; margin: 0 auto; padding: 0 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 900px) { .servers-inner { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .servers-inner { grid-template-columns: 1fr; } .servers { padding: 28px 0; } }

.server-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: transform .2s cubic-bezier(.4,0,.2,1), box-shadow .2s; }
.server-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,.09); }
.sc-stripe { height: 4px; }
.server-card--green .sc-stripe { background: #16a34a; }
.server-card--blue  .sc-stripe { background: #2563eb; }
.server-card--amber .sc-stripe { background: #d97706; }
.sc-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; flex: 1; }
.sc-top { display: flex; align-items: flex-start; gap: 12px; }
.sc-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sc-icon--green { background: #dcfce7; color: #15803d; }
.sc-icon--blue  { background: #dbeafe; color: #1d4ed8; }
.sc-icon--amber { background: #fef3c7; color: #b45309; }
.sc-meta { flex: 1; min-width: 0; }
.sc-name { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--t-primary); line-height: 1.2; }
.sc-pkg { font-size: 10px; color: var(--t-muted); font-family: var(--font-mono); display: block; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sc-badge { font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; flex-shrink: 0; }
.sc-badge--green { background: #dcfce7; color: #14532d; }
.sc-badge--blue  { background: #dbeafe; color: #1e40af; }
.sc-badge--amber { background: #fef3c7; color: #92400e; }
.sc-desc { font-size: 13px; color: var(--t-secondary); line-height: 1.65; }
.sc-cats { display: flex; flex-wrap: wrap; gap: 5px; }
.sc-cat { font-size: 10px; font-family: var(--font-mono); padding: 2px 8px; border-radius: 5px; border: 1px solid; }
.sc-cat--purple { background: #ede9fe; color: #5b21b6; border-color: #c4b5fd; }
.sc-cat--blue   { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
.sc-cat--teal   { background: #ccfbf1; color: #0f5c4c; border-color: #5eead4; }
.sc-cat--amber  { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
.sc-cat--green  { background: #dcfce7; color: #14532d; border-color: #86efac; }
.sc-cat--coral  { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
.sc-stats { display: flex; align-items: center; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; }
.sc-stat { display: flex; flex-direction: column; align-items: center; flex: 1; }
.sc-stat-n { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--t-primary); line-height: 1; }
.sc-stat-l { font-size: 9px; color: var(--t-faint); text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }
.sc-stat-sep { width: 1px; height: 24px; background: var(--border); }
.sc-btn { display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 9px; padding: 11px 18px; font-family: var(--font-body); font-size: 13px; font-weight: 600; text-decoration: none; transition: all .15s; margin-top: auto; }
.sc-btn--green { background: #007560; color: #fff; }
.sc-btn--green:hover { background: #005a49; }
.sc-btn--blue  { background: #1d4ed8; color: #fff; }
.sc-btn--blue:hover  { background: #1e40af; }
.sc-btn--amber { background: #b45309; color: #fff; }
.sc-btn--amber:hover { background: #92400e; }

/* ── How it works ── */
.how { padding: 48px 0 40px; }
.how-inner { max-width: 1140px; margin: 0 auto; padding: 0 20px; }
.how-header { margin-bottom: 24px; }
.how-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--t-primary); margin-bottom: 6px; }
.how-sub { font-size: 14px; color: var(--t-secondary); }
.how-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.how-step { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.how-num { width: 30px; height: 30px; background: var(--accent); color: #fff; border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.how-step-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--t-primary); }
.how-step-desc { font-size: 13px; color: var(--t-secondary); line-height: 1.65; }
@media (max-width: 700px) { .how-steps { grid-template-columns: 1fr; } .how { padding: 32px 0 28px; } }
@media (max-width: 480px) { .how-inner { padding: 0 16px; } }

/* Corner credit */
.corner-credit { text-align: right; margin-top: 20px; font-size: 11px; font-family: var(--font-mono); color: var(--t-faint); letter-spacing: .03em; }
</style>
