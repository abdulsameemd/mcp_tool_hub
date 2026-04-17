<template>
  <div class="diagrams-layout">

    <!-- Top bar -->
    <header class="diag-topbar">
      <div class="diag-topbar-left">
        <RouterLink to="/abap" class="back-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ABAP Explorer
        </RouterLink>
        <div class="diag-sep"></div>
        <div class="diag-topbar-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          ABAP MCP — Architecture &amp; Sequence Diagrams
        </div>
      </div>

      <div class="diag-tabs">
        <button class="diag-tab" :class="{ active: activeTab === 'arch' }" @click="activeTab = 'arch'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Architecture
        </button>
        <button class="diag-tab" :class="{ active: activeTab === 'seq' }" @click="activeTab = 'seq'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 3h18M3 12h18M3 21h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Sequence: searchObject
        </button>
      </div>

      <div class="diag-topbar-right">
        <a :href="activeTab === 'arch' ? '/ABAP_MCP_Architecture.mmd' : '/ABAP_MCP_searchObject_Sequence.mmd'"
           :download="activeTab === 'arch' ? 'ABAP_MCP_Architecture.mmd' : 'ABAP_MCP_searchObject_Sequence.mmd'"
           class="download-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Download .mmd
        </a>
      </div>
    </header>

    <!-- Diagram area -->
    <div class="diag-content">

      <!-- Architecture -->
      <div v-show="activeTab === 'arch'" class="diag-panel">
        <div class="diag-panel-header">
          <div class="diag-panel-meta">
            <span class="diag-badge diag-badge--arch">graph TD</span>
            <span class="diag-panel-name">ABAP MCP Server — Architecture</span>
          </div>
          <span class="diag-panel-file">ABAP_MCP_Architecture.mmd</span>
        </div>
        <div class="diag-render-wrap">
          <div v-if="archLoading" class="diag-loading">
            <div class="diag-spinner"></div>
            Rendering diagram…
          </div>
          <div v-if="archError" class="diag-error">{{ archError }}</div>
          <div ref="archEl" class="diag-render" :class="{ ready: !archLoading }"></div>
        </div>
      </div>

      <!-- Sequence -->
      <div v-show="activeTab === 'seq'" class="diag-panel">
        <div class="diag-panel-header">
          <div class="diag-panel-meta">
            <span class="diag-badge diag-badge--seq">sequenceDiagram</span>
            <span class="diag-panel-name">searchObject — Full Sequence</span>
          </div>
          <span class="diag-panel-file">ABAP_MCP_searchObject_Sequence.mmd</span>
        </div>
        <div class="diag-render-wrap">
          <div v-if="seqLoading" class="diag-loading">
            <div class="diag-spinner"></div>
            Rendering diagram…
          </div>
          <div v-if="seqError" class="diag-error">{{ seqError }}</div>
          <div ref="seqEl" class="diag-render" :class="{ ready: !seqLoading }"></div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import mermaid from 'mermaid'

const activeTab = ref('arch')
const archEl = ref(null)
const seqEl = ref(null)
const archLoading = ref(true)
const seqLoading = ref(true)
const archError = ref('')
const seqError = ref('')

const ARCH_MMD = `graph TD
    subgraph CLIENTS["CLIENT LAYER -- Your Machine"]
        direction LR
        CLI["Terminal\\nClaude Code CLI\\nclaude mcp add"]
        VSCODE["VS Code\\nClaude Code Extension\\nInline diffs + file context"]
        DESKTOP["Claude Desktop\\nclaude_desktop_config.json\\nConversational AI"]
    end

    subgraph MCP_SERVER["ABAP MCP SERVER -- Node.js + TypeScript"]
        direction TB
        START["start.js\\nEntry Point"]
        ADT_CLIENT["adtClient.ts\\nADT REST Client"]
        ENV[".env Config\\nSAP_URL / USER / PASSWORD\\nMOCK_MODE"]

        subgraph TOOLS["12 MCP TOOLS"]
            direction LR
            subgraph SEARCH_READ["Search and Read"]
                T1["searchObject"]
                T2["getObjectSource"]
                T3["getObjectMetadata"]
            end
            subgraph CODEGEN["Code Generation"]
                T4["generateAbapCode"]
                T5["writeObjectSource"]
            end
            subgraph REVIEW["Code Review"]
                T6["reviewAbapCode"]
                T7["syntaxCheck"]
                T8["runAtcCheck"]
            end
            subgraph TRANSPORT["Transport Mgmt"]
                T9["listTransports"]
                T10["getTransportDetails"]
                T11["validateTransport"]
            end
            subgraph SPECS["Spec and CDS"]
                T12["generateWricefSpec"]
                T13["generateCdsView"]
                T14["reviewCdsView"]
            end
        end

        START --> ADT_CLIENT
        ADT_CLIENT --> TOOLS
        ENV -.-> ADT_CLIENT
    end

    subgraph SAP["SAP S4HANA -- Your SAP System"]
        direction TB
        ADT_API["ADT REST API\\n/sap/bc/adt\\nActivated in SICF"]
        ABAP_OBJ["ABAP Objects\\nClasses / Reports\\nFMs / Interfaces"]
        CTS["Transport System\\nCTS / TMS\\nRead and Validate"]
        ATC["ATC Engine\\nVariant Z_ABAP_ATC\\nCode Quality Checks"]
        ADT_API --> ABAP_OBJ
        ADT_API --> CTS
        ADT_API --> ATC
    end

    subgraph STANDARDS["DEWA STANDARDS -- Auto-loaded via CLAUDE.md"]
        direction LR
        NAMING["DEWA Naming\\nZCL_ ZFI_ ZDFI"]
        WRICEF["WRICEF Format\\n9-Section Spec"]
        CLEAN["Clean Core\\nLevel A-D Framework\\nBTP-first"]
    end

    CLIENTS <-->|"stdio JSON-RPC\\nRequest and Response"| MCP_SERVER
    MCP_SERVER <-->|"HTTPS Port 44300\\nADT REST API\\nRequest and Response"| SAP
    STANDARDS -.->|"Applied to\\nevery output"| MCP_SERVER

    classDef clientBox fill:#1e3a5f,stroke:#5cbdb9,color:#fff
    classDef mcpBox fill:#0d7a5f,stroke:#c9a84c,color:#fff
    classDef sapBox fill:#065A82,stroke:#5cbdb9,color:#fff
    classDef toolBox fill:#2d5a3d,stroke:#97BC62,color:#fff
    classDef stdBox fill:#6D2E46,stroke:#ECE2D0,color:#fff

    class CLI,VSCODE,DESKTOP clientBox
    class START,ADT_CLIENT,ENV mcpBox
    class ADT_API,ABAP_OBJ,CTS,ATC sapBox
    class T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14 toolBox
    class NAMING,WRICEF,CLEAN stdBox`

const SEQ_MMD = `sequenceDiagram
    actor User
    participant Claude as Claude AI
    participant MCP as ABAP MCP Server<br/>(Node.js/TypeScript)
    participant ADT as ADT REST Client<br/>(adtClient.ts)
    participant SAP as SAP S/4HANA<br/>(Port 44300)

    User->>Claude: "Search for class ZCL_SALES_ORDER"

    Note over Claude: Parses intent and maps<br/>to searchObject tool

    Claude->>MCP: stdio JSON-RPC Request<br/>method: tools/call<br/>name: searchObject<br/>params: {query: "ZCL_SALES_ORDER",<br/>type: "CLAS", maxResults: 10}

    Note over MCP: Validates input params<br/>against tool schema

    MCP->>ADT: buildSearchUrl(query, type)
    ADT->>SAP: GET /sap/bc/adt/repository/informationsystem/search<br/>?operation=quickSearch<br/>&query=ZCL_SALES_ORDER*<br/>&objectType=CLAS<br/>&maxResults=10<br/>Headers: Authorization, x-csrf-token

    Note over SAP: ADT searches repository<br/>for matching objects

    SAP-->>ADT: HTTP 200 OK<br/>Content-Type: application/xml<br/><objectReferences><br/>  <objectReference name="ZCL_SALES_ORDER"<br/>    type="CLAS/OC"<br/>    uri="/sap/bc/adt/oo/classes/zcl_sales_order"<br/>    packageName="ZSALES" /><br/></objectReferences>

    ADT-->>MCP: Parsed JSON response<br/>[{name, type, uri, package}]

    Note over MCP: Formats results as<br/>structured content

    MCP-->>Claude: stdio JSON-RPC Response<br/>{content: [{type: "text",<br/>text: "Found 1 result:<br/>ZCL_SALES_ORDER (CLAS)<br/>Package: ZSALES"}]}

    Note over Claude: Interprets results and<br/>formulates natural language

    Claude-->>User: "I found the class ZCL_SALES_ORDER<br/>in package ZSALES. Would you like me<br/>to read its source code?"`

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    fontSize: '13px',
    primaryColor: '#0d7a5f',
    primaryTextColor: '#fff',
    primaryBorderColor: '#c9a84c',
    lineColor: '#5cbdb9',
    secondaryColor: '#065A82',
    tertiaryColor: '#1e3a5f',
    background: '#faf9f7',
    mainBkg: '#0d7a5f',
    nodeBorder: '#c9a84c',
    clusterBkg: '#f5f4f1',
    clusterBorder: '#e0deda',
    titleColor: '#1e1d1a',
    edgeLabelBackground: '#faf9f7',
    attributeBackgroundColorEven: '#f5f4f1',
    attributeBackgroundColorOdd: '#eeedea',
    actorBkg: '#1e3a5f',
    actorBorder: '#5cbdb9',
    actorTextColor: '#fff',
    actorLineColor: '#5cbdb9',
    signalColor: '#1e1d1a',
    signalTextColor: '#1e1d1a',
    noteBkgColor: '#fef3c7',
    noteTextColor: '#78350f',
    noteBorderColor: '#fcd34d',
    loopTextColor: '#1e1d1a',
    activationBorderColor: '#0d7a5f',
    activationBkgColor: '#dcfce7',
    sequenceNumberColor: '#fff'
  },
  flowchart: { curve: 'basis', padding: 10, nodeSpacing: 28, rankSpacing: 36, useMaxWidth: true },
  sequence: { diagramMarginX: 40, diagramMarginY: 20, actorMargin: 60, width: 180, height: 60, boxMargin: 10, boxTextMargin: 5, noteMargin: 10, messageMargin: 40, mirrorActors: false, bottomMarginAdj: 2, useMaxWidth: true }
})

async function renderDiagram(el, definition, id, opts = {}) {
  try {
    const { svg } = await mermaid.render(id, definition)
    el.innerHTML = svg
    const svgEl = el.querySelector('svg')
    if (svgEl) {
      svgEl.removeAttribute('width')
      svgEl.removeAttribute('height')
      svgEl.style.maxWidth = opts.maxWidth || '100%'
      svgEl.style.maxHeight = opts.maxHeight || 'none'
      svgEl.style.width = '100%'
      svgEl.style.height = 'auto'
    }
    return true
  } catch (e) {
    console.error('Mermaid render error:', e)
    return false
  }
}

onMounted(async () => {
  await nextTick()

  // Render architecture
  const archOk = await renderDiagram(archEl.value, ARCH_MMD, 'arch-diagram', { maxWidth: '960px' })
  archLoading.value = false
  if (!archOk) archError.value = 'Failed to render architecture diagram.'

  // Render sequence
  const seqOk = await renderDiagram(seqEl.value, SEQ_MMD, 'seq-diagram')
  seqLoading.value = false
  if (!seqOk) seqError.value = 'Failed to render sequence diagram.'
})
</script>

<style>
.diagrams-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-2);
  font-family: var(--font-body);
  position: relative;
}

/* ── Top bar ── */
.diag-topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 52px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.diag-topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-family: var(--font-body);
  color: var(--t-secondary);
  text-decoration: none;
  padding: 5px 10px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--bg-2);
  transition: all .15s;
  white-space: nowrap;
}
.back-link:hover { background: var(--bg-3); color: var(--t-primary); border-color: var(--border-2); }

.diag-sep { width: 1px; height: 20px; background: var(--border); }

.diag-topbar-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--t-primary);
  white-space: nowrap;
}

/* ── Tabs ── */
.diag-tabs {
  display: flex;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

.diag-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0 16px;
  height: 52px;
  font-family: var(--font-display);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--t-muted);
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}
.diag-tab:hover { color: var(--t-secondary); }
.diag-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

.diag-topbar-right { margin-left: auto; flex-shrink: 0; }

.download-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-family: var(--font-body);
  color: var(--t-secondary);
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--bg-2);
  transition: all .15s;
  white-space: nowrap;
}
.download-btn:hover { background: var(--bg-3); color: var(--t-primary); }

/* ── Content ── */
.diag-content {
  flex: 1;
  overflow: auto;
  padding: 16px 20px;
}

.diag-panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.diag-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-2);
  flex-wrap: wrap;
  gap: 8px;
}

.diag-panel-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.diag-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 5px;
  letter-spacing: .04em;
}
.diag-badge--arch { background: #dcfce7; color: #14532d; }
.diag-badge--seq  { background: #dbeafe; color: #1e40af; }

.diag-panel-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--t-primary);
}

.diag-panel-file {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--t-muted);
}

/* ── Render area ── */
.diag-render-wrap {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.diag-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px;
  font-size: 13px;
  color: var(--t-muted);
}

.diag-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.diag-error {
  padding: 16px 20px;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  color: #991b1b;
  font-size: 13px;
  margin: 24px;
}

.diag-render {
  width: 100%;
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: opacity .3s;
}
.diag-render.ready { opacity: 1; }
.diag-render svg {
  max-width: 100%;
  height: auto;
  width: auto;
  border-radius: 8px;
}

/* Fix white edge-label text on arch diagram */
.diag-render .edgeLabel { background: transparent !important; }
.diag-render .edgeLabel span,
.diag-render .edgeLabel p,
.diag-render .edgeLabel foreignObject div {
  color: #1e1d1a !important;
  background: rgba(250,249,247,.85) !important;
  border-radius: 3px;
  padding: 1px 3px;
}
.diag-render .edgeLabel .label { color: #1e1d1a !important; }

</style>
