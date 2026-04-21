<template>
  <div class="arch-layout">

    <!-- Top bar -->
    <header class="arch-topbar">
      <div class="arch-topbar-left">
        <RouterLink :to="backRoute" class="back-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ backLabel }}
        </RouterLink>
        <div class="arch-sep"></div>
        <div class="arch-topbar-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          {{ isUi5 ? 'UI5 MCP Server — Architecture' : 'Claude + SAP Fiori / UI5 — Architecture' }}
        </div>
      </div>

      <div class="arch-topbar-right">
        <a v-if="!isUi5" :href="svgBase + 'claude_sap_fiori_architecture.svg'" download="claude_sap_fiori_architecture.svg" class="download-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Download SVG
        </a>
      </div>
    </header>

    <!-- Content -->
    <div class="arch-content">

      <!-- Fiori: show SVG -->
      <div v-if="!isUi5" class="arch-panel">
        <div class="arch-panel-header">
          <div class="arch-panel-meta">
            <span class="arch-badge arch-badge--blue">SVG</span>
            <span class="arch-panel-name">Claude + SAP Fiori / UI5 Architecture</span>
          </div>
          <span class="arch-panel-file">claude_sap_fiori_architecture.svg</span>
        </div>
        <div class="arch-render-wrap">
          <img
            :src="svgBase + 'claude_sap_fiori_architecture.svg'"
            alt="Claude + SAP Fiori/UI5 Architecture"
            class="arch-svg-img"
          />
        </div>
      </div>

      <!-- UI5: Mermaid diagram -->
      <div v-else class="arch-panel">
        <div class="arch-panel-header">
          <div class="arch-panel-meta">
            <span class="arch-badge arch-badge--amber">Mermaid</span>
            <span class="arch-panel-name">@ui5/mcp-server — Architecture Overview</span>
          </div>
          <span class="arch-panel-file">10 tools · 4 categories</span>
        </div>
        <div class="arch-render-wrap">
          <div v-if="loading" class="arch-loading">Rendering diagram…</div>
          <div v-if="error" class="arch-error">{{ error }}</div>
          <div ref="diagEl" class="diag-render"></div>
        </div>

        <!-- Legend -->
        <div class="arch-legend">
          <div class="legend-item"><span class="legend-dot" style="background:#d97706"></span>Scaffolding — writes files</div>
          <div class="legend-item"><span class="legend-dot" style="background:#2563eb"></span>Documentation — fetches docs</div>
          <div class="legend-item"><span class="legend-dot" style="background:#7c3aed"></span>Analysis — reads project</div>
          <div class="legend-item"><span class="legend-dot" style="background:#16a34a"></span>Quality — lints &amp; validates</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import mermaid from 'mermaid'

const route = useRoute()
const isUi5 = computed(() => route.path.startsWith('/ui5'))
const backRoute = computed(() => isUi5.value ? '/ui5' : '/fiori')
const backLabel = computed(() => isUi5.value ? 'UI5 Explorer' : 'Fiori Explorer')

const svgBase = import.meta.env.BASE_URL
const diagEl = ref(null)
const loading = ref(true)
const error = ref('')

const ui5Diagram = `
flowchart LR
  CLAUDE["Claude / Copilot"]

  subgraph MCP["@ui5/mcp-server  —  10 Tools"]
    direction TB
    subgraph SC["Scaffolding"]
      createApp["create_ui5_app"]
      createCard["create_integration_card"]
    end
    subgraph DX["Documentation"]
      apiRef["get_api_reference"]
      verInfo["get_version_info"]
      tsGuide["get_typescript_conversion_guidelines"]
      guidelines["get_guidelines"]
      cardGuide["get_integration_cards_guidelines"]
    end
    subgraph AN["Analysis"]
      projInfo["get_project_info"]
    end
    subgraph QA["Quality"]
      linter["run_ui5_linter"]
      manifest["run_manifest_validation"]
    end
  end

  FS["Local File System"]
  UI5DOCS["UI5 API Docs"]

  CLAUDE -->|MCP Protocol| MCP
  SC -->|writes| FS
  AN -->|reads| FS
  QA -->|reads| FS
  DX -->|fetches| UI5DOCS
`

onMounted(async () => {
  if (!isUi5.value) { loading.value = false; return }

  await nextTick()

  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        fontSize: '13px',
        primaryColor: '#b45309',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#92400e',
        lineColor: '#0f4024',
        secondaryColor: '#2563eb',
        tertiaryColor: '#1e3a5f',
        background: '#f8f9fc',
        mainBkg: '#b45309',
        nodeBorder: '#92400e',
        clusterBkg: '#e8f0fe',
        clusterBorder: '#2563eb',
        titleColor: '#1e2a4a',
        edgeLabelBackground: '#f0f4ff',
        nodeTextColor: '#ffffff',
      },
      flowchart: { padding: 14, nodeSpacing: 36, rankSpacing: 50, curve: 'basis', useMaxWidth: true }
    })

    const { svg: rendered } = await mermaid.render('ui5-arch-diag', ui5Diagram.trim())

    // Parse the SVG to extract viewBox dimensions for proper aspect ratio
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(rendered, 'image/svg+xml')
    const svgEl = svgDoc.querySelector('svg')
    const vb = svgEl?.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 900, 400]
    const aspect = vb[3] > 0 ? (vb[2] / vb[3]).toFixed(4) : 2.5

    // Inject as img via blob URL for reliable cross-renderer display
    const blob = new Blob([rendered], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = document.createElement('img')
    img.src = url
    img.alt = 'UI5 MCP Server Architecture'
    img.style.cssText = `width:100%;max-width:900px;height:auto;aspect-ratio:${aspect};display:block;`
    img.onload = () => URL.revokeObjectURL(url)
    diagEl.value.innerHTML = ''
    diagEl.value.appendChild(img)
  } catch (e) {
    error.value = 'Failed to render diagram: ' + e.message
  } finally {
    loading.value = false
  }
})
</script>

<style>
:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --bg: #faf9f7; --bg-2: #f5f4f1; --bg-3: #eeedea; --bg-4: #e5e3de;
  --t-primary: #1e1d1a; --t-secondary: #5a5852; --t-muted: #8a8780; --t-faint: #b0ada6;
  --border: #e0deda; --border-2: #cbc9c3;
  --accent: #0f4024;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-body); background: var(--bg-2); color: var(--t-primary); font-size: 14px; -webkit-font-smoothing: antialiased; }

.arch-layout { display: flex; flex-direction: column; height: 100vh; background: var(--bg-2); }

/* Top bar */
.arch-topbar { display: flex; align-items: center; gap: 16px; padding: 0 20px; height: 52px; background: var(--bg); border-bottom: 1px solid var(--border); flex-shrink: 0; }
.arch-topbar-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.back-link { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--t-secondary); text-decoration: none; padding: 5px 10px; border: 1px solid var(--border); border-radius: 7px; background: var(--bg-2); transition: all .15s; white-space: nowrap; flex-shrink: 0; }
.back-link:hover { background: var(--bg-3); color: var(--t-primary); }
.arch-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
.arch-topbar-title { display: flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--t-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.arch-topbar-right { flex-shrink: 0; }
.download-btn { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--t-secondary); text-decoration: none; padding: 6px 12px; border: 1px solid var(--border); border-radius: 7px; background: var(--bg-2); transition: all .15s; white-space: nowrap; }
.download-btn:hover { background: var(--bg-3); color: var(--t-primary); }

/* Content */
.arch-content { flex: 1; overflow: auto; padding: 16px 20px; }
.arch-panel { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.arch-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; border-bottom: 1px solid var(--border); background: var(--bg-2); flex-wrap: wrap; gap: 8px; }
.arch-panel-meta { display: flex; align-items: center; gap: 10px; }
.arch-badge { font-family: var(--font-mono); font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 5px; letter-spacing: .04em; }
.arch-badge--blue  { background: #dbeafe; color: #1e40af; }
.arch-badge--amber { background: #fef3c7; color: #92400e; }
.arch-panel-name { font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--t-primary); }
.arch-panel-file { font-family: var(--font-mono); font-size: 11px; color: var(--t-muted); }

/* Render area */
.arch-render-wrap { padding: 28px 24px; display: flex; justify-content: center; overflow-x: auto; background: #f8f9fc; border-radius: 0 0 0 0; }
.arch-svg-img { max-width: 860px; width: 100%; height: auto; border-radius: 8px; }
.arch-loading { color: var(--t-muted); font-size: 13px; padding: 48px; }
.arch-error { color: #dc2626; font-size: 13px; padding: 48px; background: #fef2f2; border-radius: 8px; }

/* Mermaid diagram */
.diag-render { width: 100%; max-width: 900px; }
.diag-render svg { width: 100%; height: auto; }
.diag-render .edgeLabel span { color: #1e1d1a !important; background: rgba(250,249,247,.85) !important; }

/* Legend */
.arch-legend { display: flex; flex-wrap: wrap; gap: 16px; padding: 14px 20px; border-top: 1px solid var(--border); background: var(--bg-2); }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--t-secondary); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* Responsive */
@media (max-width: 600px) {
  .arch-topbar { padding: 0 12px; }
  .arch-topbar-title { font-size: 12px; }
  .arch-content { padding: 10px; }
  .arch-render-wrap { padding: 16px 10px; }
}
</style>
