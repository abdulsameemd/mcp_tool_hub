<template>
  <div class="layout">

    <!-- Mobile backdrop -->
    <div class="sidebar-backdrop" v-if="!sidebarCollapsed" @click="sidebarCollapsed = true"></div>

    <!-- ── Sidebar ── -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">

      <div class="sidebar-header">
        <div class="brand" v-show="!sidebarCollapsed">
          <div class="brand-icon" :style="`background:${server.accentHex}`">
            <svg v-if="server.icon==='layers'" width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-if="server.icon==='layout'" width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <svg v-if="server.icon==='code'" width="17" height="17" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="8 6 2 12 8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <div class="brand-name">{{ server.name }}</div>
            <div class="brand-sub">{{ server.subtitle }}</div>
          </div>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
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
            v-for="(cat, key) in serverCats"
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
              v-for="toolKey in currentCatData?.tools"
              :key="toolKey"
              class="tool-item"
              :class="{ active: currentTool === toolKey }"
              @click="selectTool(toolKey)"
            >
              <span class="tool-item-name">{{ toolKey }}</span>
              <span class="http-pill" :class="`http--${serverTools[toolKey]?.method?.toLowerCase()}`">
                {{ serverTools[toolKey]?.method === 'NONE' ? '—' : serverTools[toolKey]?.method }}
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
              <span class="cat-pip" :class="`pip--${serverCats[result.cat]?.color}`" style="margin-left:auto;flex-shrink:0"></span>
            </button>
            <div v-if="searchResults.length === 0" class="no-results">No tools found</div>
          </nav>
        </template>

        <!-- Stats footer -->
        <div class="sidebar-footer">
          <div class="stat-item">
            <span class="stat-num">{{ server.totalTools }}</span>
            <span class="stat-lbl">tools</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num" style="color:var(--c-success)">{{ server.readOnly }}</span>
            <span class="stat-lbl">read-only</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num" style="color:var(--c-warn)">{{ server.writes }}</span>
            <span class="stat-lbl">writes</span>
          </div>
        </div>

        <!-- ABAP: MOROHUB credit -->
        <div v-if="server.key === 'abap'" class="built-by">
          <span class="built-by-label">Built by</span>
          <span class="built-by-name">MOROHUB</span>
          <span class="built-by-sub">SAP Technical Services</span>
        </div>

        <!-- Fiori / UI5: SAP SE verified publisher -->
        <div v-else class="built-by">
          <span class="built-by-label">Publisher</span>
          <div class="built-by-sap-row">
            <span class="built-by-sap-name">SAP SE</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#0070f3"/>
              <polyline points="4.5,8.5 7,11 11.5,5.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <a class="built-by-link" href="https://sap.com" target="_blank" rel="noopener">sap.com</a>
          </div>
        </div>

      </template>

      <!-- Collapsed: pip icons -->
      <template v-else>
        <nav class="collapsed-cats">
          <button
            v-for="(cat, key) in serverCats"
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
          <button class="mobile-menu-btn" @click="sidebarCollapsed = !sidebarCollapsed" title="Menu">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <RouterLink to="/" class="home-link" title="Back to Hub">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
          <RouterLink :to="`/${server.key}/diagrams`" class="arch-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Architecture
          </RouterLink>
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
      </div>
    </div>

    <!-- ── Chat Bot Panel ── -->
    <Transition name="slide-panel">
      <div class="ask-panel" v-if="askPanelOpen">

        <!-- Header -->
        <div class="ask-panel-header">
          <div class="ask-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            MCP Assistant
          </div>
          <div class="ask-panel-header-actions">
            <button class="ask-panel-close" title="Clear chat" @click="clearChat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="ask-panel-close" @click="askPanelOpen = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <!-- API Key setup -->
        <div v-if="!apiKey" class="chat-setup">
          <div class="chat-setup-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <p class="chat-setup-title">Enter your Anthropic API Key</p>
          <p class="chat-setup-desc">Your key is stored locally in your browser and never sent anywhere except the Anthropic API.</p>
          <input
            v-model="apiKeyInput"
            type="password"
            placeholder="sk-ant-..."
            class="chat-key-input"
            @keydown.enter="saveApiKey"
          />
          <button class="chat-key-btn" @click="saveApiKey" :disabled="!apiKeyInput.trim()">
            Connect
          </button>
          <a href="https://console.anthropic.com/settings/keys" target="_blank" class="chat-key-link">Get API key →</a>
        </div>

        <!-- Chat messages -->
        <div v-else class="chat-messages" ref="chatEl">
          <div v-if="chatMessages.length === 0" class="chat-empty">
            <div class="chat-empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <p class="chat-empty-title">Ask me anything about the MCP servers</p>
            <div class="chat-suggestions">
              <button v-for="s in suggestions" :key="s" class="chat-suggestion" @click="sendSuggestion(s)">{{ s }}</button>
            </div>
          </div>
          <div v-for="(msg, i) in chatMessages" :key="i" class="chat-msg" :class="`chat-msg--${msg.role}`">
            <div class="chat-msg-bubble">{{ msg.content }}</div>
          </div>
          <div v-if="chatLoading" class="chat-msg chat-msg--assistant">
            <div class="chat-msg-bubble chat-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div v-if="apiKey" class="chat-input-area">
          <div v-if="chatError" class="chat-error">{{ chatError }}</div>
          <div class="chat-input-row">
            <textarea
              v-model="chatInput"
              class="chat-input"
              placeholder="Ask about any MCP tool, server or usage…"
              rows="2"
              @keydown.enter.exact.prevent="sendMessage"
            ></textarea>
            <button class="chat-send-btn" @click="sendMessage" :disabled="chatLoading || !chatInput.trim()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </button>
          </div>
          <div class="chat-input-footer">
            <span>Enter to send · Shift+Enter for newline</span>
            <button class="chat-key-reset" @click="resetApiKey">Change key</button>
          </div>
        </div>

      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { servers } from '../data/serverRegistry.js'
import ToolCard from '../components/ToolCard.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)
const askPanelOpen = ref(false)
const searchQuery = ref('')
const contentEl = ref(null)

// ── Chat state ──
const apiKey = ref(localStorage.getItem('anthropic_key') || '')
const apiKeyInput = ref('')
const chatMessages = ref([])
const chatLoading = ref(false)
const chatInput = ref('')
const chatError = ref('')
const chatEl = ref(null)

const suggestions = [
  'What tools does the ABAP MCP server have?',
  'How do I use the UI5 MCP to create an app?',
  'What is the difference between Fiori and UI5 MCP?',
  'How does the searchObject tool work?',
]

const server = computed(() => servers[route.meta?.server] || servers.abap)
const serverCats = computed(() => server.value.cats)
const serverTools = computed(() => server.value.tools)

const firstCat = computed(() => Object.keys(serverCats.value)[0])
const currentCat = ref(firstCat.value)
const currentTool = ref(serverCats.value[firstCat.value]?.tools[0])

// Reset when server changes
watch(server, (newServer) => {
  const cat = Object.keys(newServer.cats)[0]
  currentCat.value = cat
  currentTool.value = newServer.cats[cat]?.tools[0]
  searchQuery.value = ''
  askPanelOpen.value = false
})

onMounted(() => {
  // Auto-collapse sidebar on mobile
  if (window.innerWidth < 768) sidebarCollapsed.value = true

  const cat = route.query.cat
  if (cat && serverCats.value[cat]) {
    currentCat.value = cat
    currentTool.value = serverCats.value[cat].tools[0]
  }
})

const currentCatData = computed(() => serverCats.value[currentCat.value])
const currentToolData = computed(() => serverTools.value[currentTool.value])
const currentCatToolIndex = computed(() => currentCatData.value?.tools.indexOf(currentTool.value) ?? 0)

const relatedTools = computed(() => {
  const catTools = currentCatData.value?.tools ?? []
  return catTools
    .filter(k => k !== currentTool.value)
    .map(k => ({ key: k, tool: serverTools.value[k] }))
})

const searchResults = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return []
  const results = []
  for (const [catKey, cat] of Object.entries(serverCats.value)) {
    for (const toolKey of cat.tools) {
      const t = serverTools.value[toolKey]
      if (
        toolKey.toLowerCase().includes(q) ||
        t?.desc?.toLowerCase().includes(q) ||
        t?.endpoint?.toLowerCase().includes(q)
      ) {
        results.push({ key: toolKey, cat: catKey })
      }
    }
  }
  return results
})

function closeSidebarOnMobile() {
  if (window.innerWidth < 768) sidebarCollapsed.value = true
}

function selectCat(key) {
  currentCat.value = key
  currentTool.value = serverCats.value[key].tools[0]
  askPanelOpen.value = false
  searchQuery.value = ''
  closeSidebarOnMobile()
  scrollTop()
}

function selectTool(key) {
  currentTool.value = key
  askPanelOpen.value = false
  closeSidebarOnMobile()
  scrollTop()
}

function selectFromSearch(result) {
  currentCat.value = result.cat
  currentTool.value = result.key
  searchQuery.value = ''
  askPanelOpen.value = false
  closeSidebarOnMobile()
  scrollTop()
}

function prevTool() {
  const list = currentCatData.value.tools
  const i = currentCatToolIndex.value
  if (i > 0) selectTool(list[i - 1])
}

function nextTool() {
  const list = currentCatData.value.tools
  const i = currentCatToolIndex.value
  if (i < list.length - 1) selectTool(list[i + 1])
}

function scrollTop() {
  if (contentEl.value) contentEl.value.scrollTop = 0
}

function scrollChat() {
  nextTick(() => {
    if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
  })
}

function handleAsk(toolName) {
  askPanelOpen.value = true
  if (apiKey.value) {
    chatInput.value = `Tell me more about the ${toolName} tool in ${server.value.name} and when I should use it`
  }
}

function saveApiKey() {
  const key = apiKeyInput.value.trim()
  if (!key) return
  apiKey.value = key
  localStorage.setItem('anthropic_key', key)
  apiKeyInput.value = ''
}

function resetApiKey() {
  apiKey.value = ''
  apiKeyInput.value = ''
  localStorage.removeItem('anthropic_key')
  chatMessages.value = []
  chatError.value = ''
}

function clearChat() {
  chatMessages.value = []
  chatError.value = ''
}

async function sendSuggestion(text) {
  chatInput.value = text
  await sendMessage()
}

// Build a comprehensive system prompt from all server data
function buildSystemPrompt() {
  const lines = []
  lines.push(`You are an MCP Tool Assistant. You help developers understand and use SAP MCP (Model Context Protocol) servers. You have detailed knowledge of all three MCP servers listed below. Answer concisely and helpfully. Use markdown formatting where appropriate.`)
  lines.push('')

  for (const [serverKey, srv] of Object.entries(servers)) {
    lines.push(`## ${srv.name}`)
    lines.push(`${srv.subtitle}`)
    lines.push('')
    for (const [catKey, cat] of Object.entries(srv.cats)) {
      lines.push(`### Category: ${cat.label}`)
      for (const toolKey of cat.tools) {
        const t = srv.tools[toolKey]
        if (!t) continue
        lines.push(`**${toolKey}** (${t.method || 'NONE'})`)
        if (t.endpoint) lines.push(`  Endpoint: ${t.endpoint}`)
        if (t.desc) lines.push(`  Description: ${t.desc}`)
        if (t.params && t.params.length) {
          const paramList = t.params.map(p => `${p.name}${p.required ? '*' : ''} (${p.type}): ${p.desc}`).join('; ')
          lines.push(`  Parameters: ${paramList}`)
        }
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

async function sendMessage() {
  const text = chatInput.value.trim()
  if (!text || chatLoading.value) return

  chatError.value = ''
  chatMessages.value.push({ role: 'user', content: text })
  chatInput.value = ''
  chatLoading.value = true
  scrollChat()

  try {
    const messages = chatMessages.value
      .slice(0, -1) // exclude the one we just pushed (will be added fresh)
      .concat([{ role: 'user', content: text }])
      .map(m => ({ role: m.role, content: m.content }))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.value,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: buildSystemPrompt(),
        messages: messages,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `API error ${response.status}`)
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || '(no response)'
    chatMessages.value.push({ role: 'assistant', content: reply })
  } catch (e) {
    chatError.value = e.message || 'Something went wrong. Check your API key.'
    // Remove the user message on error so they can retry
    chatMessages.value.pop()
    chatInput.value = text
  } finally {
    chatLoading.value = false
    scrollChat()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
  --bg:       #faf9f7; --bg-2: #f5f4f1; --bg-3: #eeedea; --bg-4: #e5e3de;
  --t-primary: #1e1d1a; --t-secondary: #5a5852; --t-muted: #8a8780; --t-faint: #b0ada6;
  --border: #e0deda; --border-2: #cbc9c3;
  --accent: #0f4024; --accent-2: #0a2e1a; --accent-bg: #e8f5ec;
  --c-get: #2563eb; --c-get-bg: #eff6ff;
  --c-post: #16a34a; --c-post-bg: #f0fdf4;
  --c-put: #c2790a; --c-put-bg: #fffbeb;
  --c-success: #16a34a; --c-warn: #c2790a; --c-error: #dc2626;
  --pip-purple: #7c3aed; --pip-blue: #2563eb; --pip-teal: #0d9488;
  --pip-amber: #d97706; --pip-green: #16a34a; --pip-coral: #dc2626;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app { height: 100%; }
body { font-family: var(--font-body); background: var(--bg-2); color: var(--t-primary); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }

.layout { display: flex; height: 100vh; overflow: hidden; }

/* Sidebar */
.sidebar { width: 240px; background: var(--bg); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden; transition: width 0.2s cubic-bezier(.4,0,.2,1); }
.sidebar.collapsed { width: 48px; }
.sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 13px 12px; border-bottom: 1px solid var(--border); gap: 8px; min-height: 56px; flex-shrink: 0; }
.brand { display: flex; align-items: center; gap: 9px; overflow: hidden; }
.brand-icon { width: 32px; height: 32px; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.brand-name { font-family: var(--font-display); font-weight: 700; font-size: 14px; white-space: nowrap; }
.brand-sub { font-size: 10px; color: var(--t-muted); font-family: var(--font-mono); white-space: nowrap; }
.collapse-btn { width: 26px; height: 26px; background: var(--bg-3); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t-muted); transition: all .15s; flex-shrink: 0; }
.collapse-btn:hover { background: var(--bg-4); color: var(--t-primary); }
.sidebar-search { padding: 10px 12px 4px; flex-shrink: 0; }
.search-wrap { display: flex; align-items: center; gap: 7px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 7px; padding: 6px 10px; transition: border-color .15s; }
.search-wrap:focus-within { border-color: var(--accent); }
.search-icon { color: var(--t-muted); flex-shrink: 0; }
.search-input { flex: 1; border: none; background: none; outline: none; font-family: var(--font-body); font-size: 12.5px; color: var(--t-primary); }
.search-input::placeholder { color: var(--t-faint); }
.search-clear { background: none; border: none; cursor: pointer; color: var(--t-muted); font-size: 11px; }
.search-clear:hover { color: var(--t-primary); }
.sidebar-section-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t-faint); padding: 10px 16px 4px; flex-shrink: 0; }
.sidebar-cats { padding: 0 8px 4px; overflow-y: auto; }
.cat-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 8px; border: none; background: none; border-radius: 7px; cursor: pointer; transition: background .12s; margin-bottom: 1px; }
.cat-item:hover { background: var(--bg-3); }
.cat-item.active { background: var(--bg-3); }
.cat-name { font-family: var(--font-display); font-size: 13px; font-weight: 500; color: var(--t-secondary); flex: 1; text-align: left; }
.cat-item.active .cat-name { color: var(--t-primary); }
.cat-badge { font-family: var(--font-mono); font-size: 10px; color: var(--t-faint); background: var(--bg-4); border-radius: 20px; padding: 1px 6px; }
.sidebar-tools { padding: 0 8px; overflow-y: auto; flex: 1; }
.tool-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border: none; background: none; border-radius: 6px; cursor: pointer; transition: background .12s; margin-bottom: 1px; }
.tool-item:hover { background: var(--bg-2); }
.tool-item.active { background: var(--accent-bg); }
.tool-item-name { font-family: var(--font-mono); font-size: 12px; color: var(--t-secondary); flex: 1; text-align: left; }
.tool-item.active .tool-item-name { color: var(--accent); font-weight: 500; }
.no-results { font-size: 12px; color: var(--t-muted); padding: 12px 8px; }
.http-pill { font-family: var(--font-mono); font-size: 9px; font-weight: 600; padding: 2px 5px; border-radius: 4px; flex-shrink: 0; letter-spacing: .03em; }
.http--get { background: var(--c-get-bg); color: var(--c-get); }
.http--post { background: var(--c-post-bg); color: var(--c-post); }
.http--put { background: var(--c-put-bg); color: var(--c-put); }
.http--delete { background: #fef2f2; color: var(--c-error); }
.http--none { background: #f3f4f6; color: #4b5563; }
.cat-pip { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.pip--purple { background: var(--pip-purple); } .pip--blue { background: var(--pip-blue); }
.pip--teal { background: var(--pip-teal); } .pip--amber { background: var(--pip-amber); }
.pip--green { background: var(--pip-green); } .pip--coral { background: var(--pip-coral); }
.sidebar-footer { flex-shrink: 0; display: flex; align-items: center; border-top: 1px solid var(--border); padding: 10px 14px; }
.stat-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
.stat-num { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--t-primary); line-height: 1; }
.stat-lbl { font-size: 9px; color: var(--t-faint); text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }
.stat-divider { width: 1px; height: 28px; background: var(--border); flex-shrink: 0; }
.built-by { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding: 8px 14px 10px; border-top: 1px solid var(--border); gap: 2px; }
.built-by-label { font-size: 9px; color: var(--t-faint); text-transform: uppercase; letter-spacing: .07em; }
.built-by-name { font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--accent); letter-spacing: .04em; }
.built-by-sub { font-size: 10px; color: var(--t-muted); }
.built-by-sap-row { display: flex; align-items: center; gap: 5px; }
.built-by-sap-name { font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--t-primary); }
.built-by-link { font-size: 12px; color: #0070f3; text-decoration: none; font-family: var(--font-body); }
.built-by-link:hover { text-decoration: underline; }
.collapsed-cats { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 14px 0; }
.collapsed-cat { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: background .12s; }
.collapsed-cat:hover { background: var(--bg-3); }
.collapsed-cat.active { background: var(--accent-bg); }

/* Main */
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
.topnav { height: 52px; background: var(--bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 20px; gap: 12px; flex-shrink: 0; }
.topnav-left { flex-shrink: 0; display: flex; align-items: center; gap: 10px; }
.home-link { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 7px; color: var(--t-muted); text-decoration: none; background: var(--bg-2); border: 1px solid var(--border); transition: all .15s; flex-shrink: 0; }
.home-link:hover { background: var(--bg-3); color: var(--accent); border-color: var(--accent); }
.topnav-sep { width: 1px; height: 20px; background: var(--border); }
.page-title { display: flex; align-items: center; gap: 6px; }
.page-title-cat { font-family: var(--font-display); font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 5px; letter-spacing: .02em; }
.cat-badge-pill--purple { background: #ede9fe; color: #5b21b6; }
.cat-badge-pill--blue   { background: #dbeafe; color: #1e40af; }
.cat-badge-pill--teal   { background: #ccfbf1; color: #0f5c4c; }
.cat-badge-pill--amber  { background: #fef3c7; color: #92400e; }
.cat-badge-pill--green  { background: #dcfce7; color: #14532d; }
.cat-badge-pill--coral  { background: #fee2e2; color: #991b1b; }
.page-title-tool { font-family: var(--font-mono); font-size: 13px; color: var(--t-primary); font-weight: 500; }
.topnav-tabs { flex: 1; display: flex; overflow-x: auto; scrollbar-width: none; }
.topnav-tabs::-webkit-scrollbar { display: none; }
.nav-tab { background: none; border: none; border-bottom: 2px solid transparent; padding: 0 14px; height: 52px; font-family: var(--font-mono); font-size: 12px; color: var(--t-muted); cursor: pointer; transition: all .15s; white-space: nowrap; flex-shrink: 0; }
.nav-tab:hover { color: var(--t-secondary); }
.nav-tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 500; }
.topnav-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; margin-left: auto; }
.arch-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 6px; font-family: var(--font-sans); font-size: 12px; font-weight: 500; color: var(--t-secondary); text-decoration: none; transition: all .15s; white-space: nowrap; }
.arch-btn:hover { background: #0f4024; color: #fff; border-color: #0f4024; }
.tool-counter { font-family: var(--font-mono); font-size: 11px; color: var(--t-muted); }
.nav-arrow { width: 28px; height: 28px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--t-secondary); display: flex; align-items: center; justify-content: center; transition: all .15s; }
.nav-arrow:hover:not(:disabled) { background: var(--bg-3); color: var(--t-primary); }
.nav-arrow:disabled { opacity: .35; cursor: default; }
.content { flex: 1; overflow-y: auto; padding: 24px; }

/* Ask panel */
.ask-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 380px; background: var(--bg); border-left: 1px solid var(--border); box-shadow: -8px 0 32px rgba(0,0,0,.08); display: flex; flex-direction: column; z-index: 300; }
.ask-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.ask-panel-title { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--t-primary); }
.ask-panel-close { width: 28px; height: 28px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--t-muted); display: flex; align-items: center; justify-content: center; transition: all .15s; }
.ask-panel-close:hover { background: var(--bg-3); color: var(--t-primary); }
.ask-panel-body { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.ask-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t-faint); }
.ask-prompt-box { background: var(--bg-2); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; font-family: var(--font-mono); font-size: 12.5px; color: var(--t-primary); line-height: 1.65; }
.ask-hint { font-size: 12px; color: var(--t-muted); line-height: 1.65; }
.ask-panel-footer { padding: 16px 20px; border-top: 1px solid var(--border); }
.copy-btn { display: flex; align-items: center; gap: 7px; width: 100%; justify-content: center; background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 11px 20px; font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; transition: background .15s; }
.copy-btn:hover { background: var(--accent-2); }
.copy-btn.copied { background: var(--c-post); }
.slide-panel-enter-active, .slide-panel-leave-active { transition: transform .22s cubic-bezier(.4,0,.2,1), opacity .22s; }
.slide-panel-enter-from, .slide-panel-leave-to { transform: translateX(100%); opacity: 0; }

/* ── Chat UI ── */
.ask-panel-header-actions { display: flex; align-items: center; gap: 6px; }

/* API key setup screen */
.chat-setup { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; gap: 12px; text-align: center; }
.chat-setup-icon { width: 52px; height: 52px; background: var(--accent-bg); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--accent); margin-bottom: 4px; }
.chat-setup-title { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--t-primary); }
.chat-setup-desc { font-size: 12.5px; color: var(--t-muted); line-height: 1.6; max-width: 270px; }
.chat-key-input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-family: var(--font-mono); font-size: 12.5px; background: var(--bg-2); color: var(--t-primary); outline: none; transition: border-color .15s; }
.chat-key-input:focus { border-color: var(--accent); }
.chat-key-input::placeholder { color: var(--t-faint); }
.chat-key-btn { width: 100%; padding: 10px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; transition: background .15s; }
.chat-key-btn:hover:not(:disabled) { background: var(--accent-2); }
.chat-key-btn:disabled { opacity: .45; cursor: default; }
.chat-key-link { font-size: 12px; color: var(--accent); text-decoration: none; }
.chat-key-link:hover { text-decoration: underline; }

/* Messages area */
.chat-messages { flex: 1; overflow-y: auto; padding: 16px 16px 8px; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
.chat-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding-top: 24px; text-align: center; }
.chat-empty-icon { width: 44px; height: 44px; background: var(--bg-3); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--t-muted); }
.chat-empty-title { font-size: 13px; color: var(--t-secondary); font-weight: 500; }
.chat-suggestions { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.chat-suggestion { background: var(--bg-2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; font-family: var(--font-body); font-size: 12px; color: var(--t-secondary); cursor: pointer; text-align: left; transition: all .15s; line-height: 1.4; }
.chat-suggestion:hover { background: var(--accent-bg); border-color: var(--accent); color: var(--accent); }

/* Message bubbles */
.chat-msg { display: flex; }
.chat-msg--user { justify-content: flex-end; }
.chat-msg--assistant { justify-content: flex-start; }
.chat-msg-bubble { max-width: 88%; padding: 10px 13px; border-radius: 12px; font-size: 13px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
.chat-msg--user .chat-msg-bubble { background: var(--accent); color: #fff; border-bottom-right-radius: 4px; }
.chat-msg--assistant .chat-msg-bubble { background: var(--bg-2); border: 1px solid var(--border); color: var(--t-primary); border-bottom-left-radius: 4px; }

/* Typing indicator */
.chat-typing { display: flex; align-items: center; gap: 4px; padding: 12px 14px; }
.chat-typing span { width: 7px; height: 7px; background: var(--t-faint); border-radius: 50%; animation: chat-bounce .9s infinite ease-in-out; }
.chat-typing span:nth-child(1) { animation-delay: 0s; }
.chat-typing span:nth-child(2) { animation-delay: .18s; }
.chat-typing span:nth-child(3) { animation-delay: .36s; }
@keyframes chat-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}

/* Input area */
.chat-input-area { flex-shrink: 0; padding: 10px 12px 12px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 6px; }
.chat-error { font-size: 11.5px; color: var(--c-error); background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 7px 10px; line-height: 1.5; }
.chat-input-row { display: flex; gap: 8px; align-items: flex-end; }
.chat-input { flex: 1; padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px; font-family: var(--font-body); font-size: 13px; background: var(--bg-2); color: var(--t-primary); resize: none; outline: none; line-height: 1.5; transition: border-color .15s; max-height: 120px; }
.chat-input:focus { border-color: var(--accent); }
.chat-input::placeholder { color: var(--t-faint); }
.chat-send-btn { width: 36px; height: 36px; background: var(--accent); color: #fff; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .15s; }
.chat-send-btn:hover:not(:disabled) { background: var(--accent-2); }
.chat-send-btn:disabled { opacity: .4; cursor: default; }
.chat-input-footer { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--t-faint); }
.chat-key-reset { background: none; border: none; cursor: pointer; font-size: 11px; color: var(--t-muted); text-decoration: underline; padding: 0; }
.chat-key-reset:hover { color: var(--t-primary); }

/* ── Mobile menu button (hidden on desktop) ── */
.mobile-menu-btn { display: none; }

/* ── Responsive: Tablet ≤ 1024px ── */
@media (max-width: 1024px) {
  .topnav-tabs { display: none; }
  .tool-counter { display: none; }
  .arch-btn span { display: none; }
}

/* ── Responsive: Mobile ≤ 768px ── */
@media (max-width: 768px) {
  /* Show hamburger, hide desktop collapse btn */
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 7px;
    cursor: pointer;
    color: var(--t-secondary);
    flex-shrink: 0;
    transition: all .15s;
  }
  .mobile-menu-btn:hover { background: var(--bg-3); color: var(--t-primary); }

  /* Sidebar becomes a fixed overlay drawer */
  .sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 250;
    width: 268px !important;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(.4,0,.2,1);
    box-shadow: 4px 0 24px rgba(0,0,0,.15);
  }
  /* Open state: not collapsed */
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  /* Collapsed = hidden off-screen */
  .sidebar.collapsed {
    transform: translateX(-100%);
    width: 268px !important;
  }

  /* Backdrop */
  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    z-index: 240;
    backdrop-filter: blur(1px);
  }

  /* Topnav adjustments */
  .topnav { padding: 0 12px; gap: 8px; }
  .topnav-sep { display: none; }
  .page-title-tool { display: none; }
  .arch-btn { padding: 5px 8px; }
  .nav-arrow { width: 24px; height: 24px; }

  /* Content padding reduced */
  .content { padding: 14px; }

  /* Chat panel full-screen on mobile */
  .ask-panel { width: 100%; left: 0; }
}

/* Backdrop hidden on desktop */
@media (min-width: 769px) {
  .sidebar-backdrop { display: none; }
  .mobile-menu-btn { display: none; }
}

/* ── Responsive: Small mobile ≤ 480px ── */
@media (max-width: 480px) {
  .topnav { padding: 0 10px; gap: 6px; }
  .page-title-cat { font-size: 10px; padding: 2px 6px; }
  .arch-btn { display: none; }
  .content { padding: 10px; }
}
</style>
