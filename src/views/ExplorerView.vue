<template>
  <div class="layout">

    <!-- ── Sidebar ── -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">

      <div class="sidebar-header">
        <div class="brand" v-show="!sidebarCollapsed">
          <div class="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <div class="brand-name">ABAP MCP</div>
            <div class="brand-sub">ADT REST · S/4HANA</div>
          </div>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expand' : 'Collapse'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path :d="sidebarCollapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <template v-if="!sidebarCollapsed">

        <!-- Search -->
        <div class="sidebar-search">
          <div class="search-wrap">
            <svg class="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input v-model="searchQuery" placeholder="Search tools…" class="search-input" />
            <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
          </div>
        </div>

        <!-- Categories -->
        <div class="sidebar-section-label">Categories</div>
        <nav class="sidebar-cats">
          <button
            v-for="(cat, key) in cats"
            :key="key"
            class="cat-item"
            :class="[`cat-item--${cat.color}`, { active: currentCat === key && !searchQuery }]"
            @click="selectCat(key)"
          >
            <span class="cat-pip" :class="`pip--${cat.color}`"></span>
            <span class="cat-name">{{ cat.label }}</span>
            <span class="cat-badge">{{ cat.tools.length }}</span>
          </button>
        </nav>

        <!-- Tool list -->
        <template v-if="!searchQuery">
          <div class="sidebar-section-label" style="margin-top:4px">Tools</div>
          <nav class="sidebar-tools">
            <button
              v-for="toolKey in currentCatData.tools"
              :key="toolKey"
              class="tool-item"
              :class="{ active: currentTool === toolKey }"
              @click="selectTool(toolKey)"
            >
              <span class="tool-item-name">{{ toolKey }}</span>
              <span class="http-pill" :class="`http--${tools[toolKey].method.toLowerCase()}`">
                {{ tools[toolKey].method === 'NONE' ? '—' : tools[toolKey].method }}
              </span>
            </button>
          </nav>
        </template>

        <!-- Search results -->
        <template v-else>
          <div class="sidebar-section-label" style="margin-top:4px">Results ({{ searchResults.length }})</div>
          <nav class="sidebar-tools">
            <button
              v-for="result in searchResults"
              :key="result.key"
              class="tool-item"
              :class="{ active: currentTool === result.key }"
              @click="selectFromSearch(result)"
            >
              <span class="tool-item-name">{{ result.key }}</span>
              <span class="cat-pip" :class="`pip--${cats[result.cat].color}`" style="margin-left:auto;flex-shrink:0"></span>
            </button>
            <div v-if="searchResults.length === 0" class="no-results">No tools found</div>
          </nav>
        </template>

        <!-- Stats footer -->
        <div class="sidebar-footer">
          <div class="stat-item">
            <span class="stat-num">14</span>
            <span class="stat-lbl">tools</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num" style="color:var(--c-success)">13</span>
            <span class="stat-lbl">read-only</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num" style="color:var(--c-warn)">1</span>
            <span class="stat-lbl">writes SAP</span>
          </div>
        </div>

      </template>

      <!-- Collapsed state: just pip icons -->
      <template v-else>
        <nav class="collapsed-cats">
          <button
            v-for="(cat, key) in cats"
            :key="key"
            class="collapsed-cat"
            :class="{ active: currentCat === key }"
            @click="selectCat(key); sidebarCollapsed = false"
            :title="cat.label"
          >
            <span class="cat-pip" :class="`pip--${cat.color}`" style="width:10px;height:10px"></span>
          </button>
        </nav>
      </template>

    </aside>

    <!-- ── Main ── -->
    <div class="main">

      <!-- Top nav bar -->
      <header class="topnav">
        <div class="topnav-left">
          <RouterLink to="/" class="home-link" title="Home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
          <div class="topnav-sep"></div>
          <div class="page-title">
            <span class="page-title-cat" :class="`cat-badge-pill--${currentCatData?.color}`">{{ currentCatData?.label }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="color:var(--t-muted)"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span class="page-title-tool">{{ currentTool }}</span>
          </div>
        </div>

        <div class="topnav-tabs">
          <button
            v-for="toolKey in currentCatData?.tools"
            :key="toolKey"
            class="nav-tab"
            :class="{ active: currentTool === toolKey }"
            @click="selectTool(toolKey)"
          >
            {{ toolKey }}
          </button>
        </div>

        <div class="topnav-right">
          <div class="tool-counter">
            {{ currentCatToolIndex + 1 }} / {{ currentCatData?.tools.length }}
          </div>
          <button class="nav-arrow" :disabled="currentCatToolIndex === 0" @click="prevTool">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <button class="nav-arrow" :disabled="currentCatToolIndex === currentCatData?.tools.length - 1" @click="nextTool">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </header>

      <!-- Content area -->
      <div class="content" ref="contentEl">
        <div class="content-inner">
          <Transition name="tool-fade" mode="out-in">
            <ToolCard
              v-if="currentToolData"
              :key="currentTool"
              :tool="currentToolData"
              :toolName="currentTool"
              :catColor="currentCatData?.color"
              :relatedTools="relatedTools"
              @ask="handleAsk"
              @select-tool="selectTool"
            />
          </Transition>
        </div>
      </div>
    </div>

    <!-- ── Ask Panel ── -->
    <Transition name="slide-panel">
      <div class="ask-panel" v-if="askPanelOpen">
        <div class="ask-panel-header">
          <div class="ask-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Ask Claude
          </div>
          <button class="ask-panel-close" @click="askPanelOpen = false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="ask-panel-body">
          <div class="ask-label">Suggested prompt</div>
          <div class="ask-prompt-box">{{ askPrompt }}</div>
          <p class="ask-hint">Paste into a Claude conversation or use directly in Claude Code with the MCP server connected.</p>
        </div>
        <div class="ask-panel-footer">
          <button class="copy-btn" :class="{ copied }" @click="copyPrompt">
            <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ copied ? 'Copied!' : 'Copy prompt' }}
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { cats, tools } from '../data/tools.js'
import ToolCard from '../components/ToolCard.vue'

const sidebarCollapsed = ref(false)
const currentCat = ref('analysis')
const currentTool = ref('searchObject')
const askPanelOpen = ref(false)
const askPrompt = ref('')
const copied = ref(false)
const searchQuery = ref('')
const contentEl = ref(null)
const route = useRoute()

onMounted(() => {
  const cat = route.query.cat
  if (cat && cats[cat]) {
    currentCat.value = cat
    currentTool.value = cats[cat].tools[0]
  }
})

const currentCatData = computed(() => cats[currentCat.value])
const currentToolData = computed(() => tools[currentTool.value])
const currentCatToolIndex = computed(() => currentCatData.value?.tools.indexOf(currentTool.value) ?? 0)

const relatedTools = computed(() => {
  const catTools = currentCatData.value?.tools ?? []
  return catTools
    .filter(k => k !== currentTool.value)
    .map(k => ({ key: k, tool: tools[k] }))
})

const searchResults = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return []
  const results = []
  for (const [catKey, cat] of Object.entries(cats)) {
    for (const toolKey of cat.tools) {
      const t = tools[toolKey]
      if (
        toolKey.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.endpoint.toLowerCase().includes(q)
      ) {
        results.push({ key: toolKey, cat: catKey })
      }
    }
  }
  return results
})

function selectCat(key) {
  currentCat.value = key
  currentTool.value = cats[key].tools[0]
  askPanelOpen.value = false
  searchQuery.value = ''
  scrollTop()
}

function selectTool(key) {
  currentTool.value = key
  askPanelOpen.value = false
  scrollTop()
}

function selectFromSearch(result) {
  currentCat.value = result.cat
  currentTool.value = result.key
  searchQuery.value = ''
  askPanelOpen.value = false
  scrollTop()
}

function prevTool() {
  const tools = currentCatData.value.tools
  const i = currentCatToolIndex.value
  if (i > 0) selectTool(tools[i - 1])
}

function nextTool() {
  const list = currentCatData.value.tools
  const i = currentCatToolIndex.value
  if (i < list.length - 1) selectTool(list[i + 1])
}

function scrollTop() {
  if (contentEl.value) contentEl.value.scrollTop = 0
}

function handleAsk(toolName) {
  askPrompt.value = `Tell me more about the ${toolName} tool and when I should use it`
  askPanelOpen.value = true
  copied.value = false
}

async function copyPrompt() {
  await navigator.clipboard.writeText(askPrompt.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --bg:       #faf9f7;
  --bg-2:     #f5f4f1;
  --bg-3:     #eeedea;
  --bg-4:     #e5e3de;

  --t-primary:   #1e1d1a;
  --t-secondary: #5a5852;
  --t-muted:     #8a8780;
  --t-faint:     #b0ada6;

  --border:      #e0deda;
  --border-2:    #cbc9c3;

  --accent:      #0f4024;
  --accent-2:    #0a2e1a;
  --accent-bg:   #e8f5ec;

  --c-get:     #2563eb; --c-get-bg:  #eff6ff;
  --c-post:    #16a34a; --c-post-bg: #f0fdf4;
  --c-put:     #c2790a; --c-put-bg:  #fffbeb;
  --c-none:    #6b7280; --c-none-bg: #f3f4f6;

  --c-success: #16a34a;
  --c-warn:    #c2790a;
  --c-error:   #dc2626;
  --c-info:    #2563eb;

  --pip-purple: #7c3aed;
  --pip-blue:   #2563eb;
  --pip-teal:   #0d9488;
  --pip-amber:  #d97706;
  --pip-green:  #16a34a;
  --pip-coral:  #dc2626;

  --sidebar-w: 232px;
  --topnav-h:  52px;
  --radius:    8px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app { height: 100%; }
body { font-family: var(--font-body); background: var(--bg-2); color: var(--t-primary); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }

/* ── Layout shell ──────────────────────────────────────────── */
.layout { display: flex; height: 100vh; overflow: hidden; }

/* ── Sidebar ───────────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.2s cubic-bezier(.4,0,.2,1);
}
.sidebar.collapsed { width: 48px; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 12px;
  border-bottom: 1px solid var(--border);
  gap: 8px;
  min-height: 56px;
  flex-shrink: 0;
}
.brand { display: flex; align-items: center; gap: 9px; overflow: hidden; }
.brand-icon {
  width: 32px; height: 32px;
  background: var(--accent);
  color: #fff;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.brand-name { font-family: var(--font-display); font-weight: 700; font-size: 14px; white-space: nowrap; }
.brand-sub { font-size: 10px; color: var(--t-muted); font-family: var(--font-mono); white-space: nowrap; }

.collapse-btn {
  width: 26px; height: 26px;
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--t-muted);
  transition: all .15s;
  flex-shrink: 0;
}
.collapse-btn:hover { background: var(--bg-4); color: var(--t-primary); }

/* Search */
.sidebar-search { padding: 10px 12px 4px; flex-shrink: 0; }
.search-wrap {
  display: flex; align-items: center; gap: 7px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 6px 10px;
  transition: border-color .15s;
}
.search-wrap:focus-within { border-color: var(--accent); }
.search-icon { color: var(--t-muted); flex-shrink: 0; }
.search-input {
  flex: 1; border: none; background: none; outline: none;
  font-family: var(--font-body); font-size: 12.5px;
  color: var(--t-primary);
}
.search-input::placeholder { color: var(--t-faint); }
.search-clear {
  background: none; border: none; cursor: pointer;
  color: var(--t-muted); font-size: 11px; padding: 0 2px;
}
.search-clear:hover { color: var(--t-primary); }

.sidebar-section-label {
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: .07em;
  color: var(--t-faint);
  padding: 10px 16px 4px;
  flex-shrink: 0;
}

.sidebar-cats { padding: 0 8px 4px; overflow-y: auto; }
.cat-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 7px 8px;
  border: none; background: none; border-radius: 7px;
  cursor: pointer; transition: background .12s;
  margin-bottom: 1px;
}
.cat-item:hover { background: var(--bg-3); }
.cat-item.active { background: var(--bg-3); }
.cat-name { font-family: var(--font-display); font-size: 13px; font-weight: 500; color: var(--t-secondary); flex: 1; text-align: left; }
.cat-item.active .cat-name { color: var(--t-primary); }
.cat-badge { font-family: var(--font-mono); font-size: 10px; color: var(--t-faint); background: var(--bg-4); border-radius: 20px; padding: 1px 6px; }

.sidebar-tools { padding: 0 8px; overflow-y: auto; flex: 1; }
.tool-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 6px 8px;
  border: none; background: none; border-radius: 6px;
  cursor: pointer; transition: background .12s;
  margin-bottom: 1px;
}
.tool-item:hover { background: var(--bg-2); }
.tool-item.active { background: var(--accent-bg); }
.tool-item-name { font-family: var(--font-mono); font-size: 12px; color: var(--t-secondary); flex: 1; text-align: left; }
.tool-item.active .tool-item-name { color: var(--accent); font-weight: 500; }
.no-results { font-size: 12px; color: var(--t-muted); padding: 12px 8px; }

/* HTTP pill mini */
.http-pill { font-family: var(--font-mono); font-size: 9px; font-weight: 600; padding: 2px 5px; border-radius: 4px; flex-shrink: 0; letter-spacing: .03em; }
.http--get    { background: var(--c-get-bg);  color: var(--c-get); }
.http--post   { background: var(--c-post-bg); color: var(--c-post); }
.http--put    { background: var(--c-put-bg);  color: var(--c-put); }
.http--delete { background: #fef2f2; color: var(--c-error); }
.http--none   { background: var(--c-none-bg); color: var(--c-none); }

/* Color pips */
.cat-pip { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.pip--purple { background: var(--pip-purple); }
.pip--blue   { background: var(--pip-blue); }
.pip--teal   { background: var(--pip-teal); }
.pip--amber  { background: var(--pip-amber); }
.pip--green  { background: var(--pip-green); }
.pip--coral  { background: var(--pip-coral); }

/* Sidebar footer stats */
.sidebar-footer {
  margin-top: auto; flex-shrink: 0;
  display: flex; align-items: center; gap: 0;
  border-top: 1px solid var(--border);
  padding: 10px 14px;
}
.stat-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
.stat-num { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--t-primary); line-height: 1; }
.stat-lbl { font-size: 9px; color: var(--t-faint); text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }

/* Built-by credit */
.built-by {
  flex-shrink: 0;
  display: flex; flex-direction: column; align-items: center;
  padding: 9px 14px 11px;
  border-top: 1px solid var(--border);
  gap: 2px;
}
.built-by-label { font-size: 9px; color: var(--t-faint); text-transform: uppercase; letter-spacing: .07em; }
.built-by-name {
  font-family: var(--font-display); font-size: 12px; font-weight: 700;
  color: var(--accent); letter-spacing: .04em;
}
.built-by-sub { font-size: 10px; color: var(--t-muted); }
.stat-divider { width: 1px; height: 28px; background: var(--border); flex-shrink: 0; }

/* Collapsed sidebar */
.collapsed-cats { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 14px 0; }
.collapsed-cat { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: background .12s; }
.collapsed-cat:hover { background: var(--bg-3); }
.collapsed-cat.active { background: var(--accent-bg); }

/* ── Main area ─────────────────────────────────────────────── */
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

/* ── Top nav ───────────────────────────────────────────────── */
.topnav {
  height: var(--topnav-h);
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center;
  padding: 0 20px;
  gap: 12px;
  flex-shrink: 0;
}

.topnav-left { flex-shrink: 0; display: flex; align-items: center; gap: 10px; }
.home-link {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 7px;
  color: var(--t-muted); text-decoration: none;
  background: var(--bg-2); border: 1px solid var(--border);
  transition: all .15s; flex-shrink: 0;
}
.home-link:hover { background: var(--bg-3); color: var(--accent); border-color: var(--accent); }
.topnav-sep { width: 1px; height: 20px; background: var(--border); }
.page-title { display: flex; align-items: center; gap: 6px; }

.page-title-cat {
  font-family: var(--font-display); font-size: 11px; font-weight: 600;
  padding: 3px 8px; border-radius: 5px; letter-spacing: .02em;
}
.cat-badge-pill--purple { background: #ede9fe; color: #5b21b6; }
.cat-badge-pill--blue   { background: #dbeafe; color: #1e40af; }
.cat-badge-pill--teal   { background: #ccfbf1; color: #0f5c4c; }
.cat-badge-pill--amber  { background: #fef3c7; color: #92400e; }
.cat-badge-pill--green  { background: #dcfce7; color: #14532d; }
.cat-badge-pill--coral  { background: #fee2e2; color: #991b1b; }

.page-title-tool { font-family: var(--font-mono); font-size: 13px; color: var(--t-primary); font-weight: 500; }

.topnav-tabs { flex: 1; display: flex; overflow-x: auto; scrollbar-width: none; }
.topnav-tabs::-webkit-scrollbar { display: none; }

.nav-tab {
  background: none; border: none; border-bottom: 2px solid transparent;
  padding: 0 14px; height: var(--topnav-h);
  font-family: var(--font-mono); font-size: 12px; color: var(--t-muted);
  cursor: pointer; transition: all .15s; white-space: nowrap; flex-shrink: 0;
}
.nav-tab:hover { color: var(--t-secondary); }
.nav-tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 500; }

.topnav-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; margin-left: auto; }
.tool-counter { font-family: var(--font-mono); font-size: 11px; color: var(--t-muted); }
.nav-arrow {
  width: 28px; height: 28px;
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: 6px; cursor: pointer; color: var(--t-secondary);
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
.nav-arrow:hover:not(:disabled) { background: var(--bg-3); color: var(--t-primary); }
.nav-arrow:disabled { opacity: .35; cursor: default; }

/* ── Content ───────────────────────────────────────────────── */
.content { flex: 1; overflow-y: auto; padding: 24px; }
.content-inner { max-width: 1100px; margin: 0 auto; }

/* Tool switch transition */
.tool-fade-enter-active { transition: opacity .18s ease, transform .18s ease; }
.tool-fade-leave-active { transition: opacity .12s ease, transform .12s ease; }
.tool-fade-enter-from   { opacity: 0; transform: translateY(8px); }
.tool-fade-leave-to     { opacity: 0; transform: translateY(-4px); }

/* ── Ask panel ─────────────────────────────────────────────── */
.ask-panel {
  position: fixed; top: 0; right: 0; bottom: 0; width: 380px;
  background: var(--bg);
  border-left: 1px solid var(--border);
  box-shadow: -8px 0 32px rgba(0,0,0,.08);
  display: flex; flex-direction: column;
  z-index: 300;
}
.ask-panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.ask-panel-title {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-display); font-size: 15px; font-weight: 600;
  color: var(--t-primary);
}
.ask-panel-close {
  width: 28px; height: 28px;
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: 6px; cursor: pointer; color: var(--t-muted);
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
.ask-panel-close:hover { background: var(--bg-3); color: var(--t-primary); }
.ask-panel-body { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.ask-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t-faint); }
.ask-prompt-box {
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: 8px; padding: 14px 16px;
  font-family: var(--font-mono); font-size: 12.5px;
  color: var(--t-primary); line-height: 1.65;
}
.ask-hint { font-size: 12px; color: var(--t-muted); line-height: 1.65; }
.ask-panel-footer { padding: 16px 20px; border-top: 1px solid var(--border); }
.copy-btn {
  display: flex; align-items: center; gap: 7px;
  width: 100%; justify-content: center;
  background: var(--accent); color: #fff;
  border: none; border-radius: 8px;
  padding: 11px 20px;
  font-family: var(--font-body); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: background .15s;
}
.copy-btn:hover { background: var(--accent-2); }
.copy-btn.copied { background: var(--c-post); }

/* Panel transition */
.slide-panel-enter-active, .slide-panel-leave-active { transition: transform .22s cubic-bezier(.4,0,.2,1), opacity .22s; }
.slide-panel-enter-from, .slide-panel-leave-to { transform: translateX(100%); opacity: 0; }
</style>
