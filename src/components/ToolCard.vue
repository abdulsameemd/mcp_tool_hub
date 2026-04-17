<template>
  <div class="card" :class="`card--${catColor}`">

    <!-- ── Card header ── -->
    <div class="card-header">
      <div class="card-header-top">
        <span class="method-badge" :class="`method-badge--${methodKey}`">
          {{ methodLabel }}
        </span>
        <div class="endpoint-bar">
          <span class="endpoint-text">{{ tool.endpoint }}</span>
        </div>
        <span class="access-chip" :class="tool.readonly ? 'access-chip--ro' : 'access-chip--rw'">
          <span class="access-dot"></span>
          {{ tool.readonly ? 'read-only' : 'writes to SAP' }}
        </span>
      </div>
      <h2 class="tool-title">{{ toolName }}</h2>
      <p class="tool-desc">{{ tool.desc }}</p>
    </div>

    <!-- ── Request / Response columns ── -->
    <div class="req-res">
      <div class="pane">
        <div class="pane-header">
          <div class="pane-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Request / Input
          </div>
          <button class="copy-code-btn" @click="copy(tool.req, 'req')" :title="'Copy'">
            <svg v-if="copied !== 'req'" width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ copied === 'req' ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <pre class="code-block">{{ tool.req }}</pre>
      </div>

      <div class="pane-divider">
        <div class="pane-divider-line"></div>
        <div class="pane-divider-arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="pane-divider-line"></div>
      </div>

      <div class="pane">
        <div class="pane-header">
          <div class="pane-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Response / Output
          </div>
          <button class="copy-code-btn" @click="copy(tool.res, 'res')" :title="'Copy'">
            <svg v-if="copied !== 'res'" width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ copied === 'res' ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <pre class="code-block">{{ tool.res }}</pre>
      </div>
    </div>

    <!-- ── Note banner ── -->
    <div class="note-banner" :class="tool.readonly ? 'note-banner--safe' : 'note-banner--warn'">
      <svg class="note-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path v-if="tool.readonly" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline v-if="tool.readonly" points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path v-if="!tool.readonly" d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line v-if="!tool.readonly" x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line v-if="!tool.readonly" x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>{{ tool.note }}</span>
    </div>

    <!-- ── Related tools ── -->
    <div class="related" v-if="relatedTools && relatedTools.length">
      <div class="related-label">Other tools in this category</div>
      <div class="related-grid">
        <button
          v-for="r in relatedTools"
          :key="r.key"
          class="related-card"
          @click="$emit('select-tool', r.key)"
        >
          <div class="related-top">
            <span class="related-name">{{ r.key }}</span>
            <span class="http-pill-sm" :class="`http--${r.tool.method.toLowerCase()}`">
              {{ r.tool.method === 'NONE' ? '—' : r.tool.method }}
            </span>
          </div>
          <div class="related-desc">{{ r.tool.desc }}</div>
        </button>
      </div>
    </div>

    <!-- ── Footer action ── -->
    <div class="card-footer">
      <button class="ask-btn" @click="$emit('ask', toolName)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Ask Claude about {{ toolName }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tool: { type: Object, required: true },
  toolName: { type: String, required: true },
  catColor: { type: String, default: 'purple' },
  relatedTools: { type: Array, default: () => [] }
})
defineEmits(['ask', 'select-tool'])

const copied = ref(null)

const methodKey = computed(() => props.tool.method.toLowerCase())
const methodLabel = computed(() => {
  const m = { GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE', NONE: 'No SAP call' }
  return m[props.tool.method] || props.tool.method
})

async function copy(text, which) {
  await navigator.clipboard.writeText(text)
  copied.value = which
  setTimeout(() => { copied.value = null }, 2000)
}
</script>

<style scoped>
/* ── Card shell ────────────────────────────────────────────── */
.card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.03);
}

/* Subtle top accent stripe per category */
.card--purple { border-top: 3px solid #7c3aed; }
.card--blue   { border-top: 3px solid #2563eb; }
.card--teal   { border-top: 3px solid #0d9488; }
.card--amber  { border-top: 3px solid #d97706; }
.card--green  { border-top: 3px solid #16a34a; }
.card--coral  { border-top: 3px solid #dc2626; }

/* ── Header ────────────────────────────────────────────────── */
.card-header {
  padding: 20px 24px 18px;
  border-bottom: 1px solid var(--border);
}
.card-header-top {
  display: flex; align-items: center; gap: 10px;
  flex-wrap: wrap; margin-bottom: 12px;
}

.method-badge {
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 6px; letter-spacing: .04em;
  flex-shrink: 0;
}
.method-badge--get    { background: #eff6ff; color: #1d4ed8; }
.method-badge--post   { background: #f0fdf4; color: #15803d; }
.method-badge--put    { background: #fffbeb; color: #b45309; }
.method-badge--delete { background: #fef2f2; color: #b91c1c; }
.method-badge--none   { background: #f3f4f6; color: #4b5563; }

.endpoint-bar {
  flex: 1; min-width: 0;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 5px 12px;
  overflow: hidden;
}
.endpoint-text {
  font-family: var(--font-mono); font-size: 12px;
  color: var(--t-secondary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  display: block;
}

.access-chip {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; font-family: var(--font-mono);
  padding: 4px 9px; border-radius: 6px;
  flex-shrink: 0;
}
.access-chip--ro  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.access-chip--rw  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.access-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.tool-title {
  font-family: var(--font-display); font-size: 20px; font-weight: 700;
  color: var(--t-primary); margin-bottom: 6px; line-height: 1.25;
}
.tool-desc {
  font-size: 13.5px; color: var(--t-secondary); line-height: 1.65; max-width: 80ch;
}

/* ── Req / Res ─────────────────────────────────────────────── */
.req-res {
  display: grid;
  grid-template-columns: 1fr 32px 1fr;
  align-items: stretch;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
}

@media (max-width: 680px) {
  .req-res { grid-template-columns: 1fr; }
  .pane-divider { display: none; }
}

.pane { padding: 18px 20px; min-width: 0; display: flex; flex-direction: column; gap: 8px; }

.pane-header {
  display: flex; align-items: center; justify-content: space-between;
}
.pane-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: .06em; color: var(--t-muted);
}

.copy-code-btn {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-family: var(--font-body);
  color: var(--t-muted);
  background: var(--bg-3); border: 1px solid var(--border);
  border-radius: 5px; padding: 3px 8px;
  cursor: pointer; transition: all .15s;
}
.copy-code-btn:hover { color: var(--t-primary); background: var(--bg-4); }

.code-block {
  font-family: var(--font-mono); font-size: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px 16px;
  line-height: 1.8;
  color: var(--t-primary);
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  flex: 1;
}

.pane-divider {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 18px 0;
  gap: 6px;
}
.pane-divider-line { flex: 1; width: 1px; background: var(--border); }
.pane-divider-arrow {
  width: 26px; height: 26px;
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--t-muted); flex-shrink: 0;
}

/* ── Note banner ───────────────────────────────────────────── */
.note-banner {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 12px 24px;
  font-size: 12.5px; line-height: 1.55;
  border-bottom: 1px solid var(--border);
}
.note-banner--safe { background: #f0fdf4; color: #15803d; }
.note-banner--warn { background: #fffbeb; color: #b45309; }
.note-icon { flex-shrink: 0; margin-top: 1px; }

/* ── Related tools ─────────────────────────────────────────── */
.related {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-2);
}
.related-label {
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: .07em; color: var(--t-faint); margin-bottom: 12px;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
}
.related-card {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 8px; padding: 11px 14px;
  cursor: pointer; text-align: left; transition: all .15s;
}
.related-card:hover { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
.related-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px; }
.related-name { font-family: var(--font-mono); font-size: 12px; font-weight: 500; color: var(--t-primary); }
.related-desc { font-size: 11.5px; color: var(--t-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.http-pill-sm { font-family: var(--font-mono); font-size: 9px; font-weight: 700; padding: 2px 5px; border-radius: 4px; flex-shrink: 0; letter-spacing: .03em; }
.http--get    { background: #eff6ff; color: #1d4ed8; }
.http--post   { background: #f0fdf4; color: #15803d; }
.http--put    { background: #fffbeb; color: #b45309; }
.http--delete { background: #fef2f2; color: #b91c1c; }
.http--none   { background: #f3f4f6; color: #4b5563; }

/* ── Footer ────────────────────────────────────────────────── */
.card-footer {
  padding: 14px 24px;
  display: flex; align-items: center; justify-content: flex-end;
}
.ask-btn {
  display: flex; align-items: center; gap: 7px;
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: 8px; padding: 8px 16px;
  font-family: var(--font-body); font-size: 12.5px;
  color: var(--t-secondary); cursor: pointer;
  transition: all .15s;
}
.ask-btn:hover {
  background: var(--accent); color: #fff;
  border-color: var(--accent);
}
</style>
