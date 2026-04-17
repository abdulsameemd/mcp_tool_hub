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
          Claude + SAP Fiori / UI5 — Architecture
        </div>
      </div>

      <div class="arch-topbar-right">
        <a href="/claude_sap_fiori_architecture.svg" download="claude_sap_fiori_architecture.svg" class="download-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Download SVG
        </a>
      </div>
    </header>

    <!-- Diagram area -->
    <div class="arch-content">
      <div class="arch-panel">
        <div class="arch-panel-header">
          <div class="arch-panel-meta">
            <span class="arch-badge">SVG</span>
            <span class="arch-panel-name">Claude + SAP Fiori / UI5 Architecture — DEWA</span>
          </div>
          <span class="arch-panel-file">claude_sap_fiori_architecture.svg</span>
        </div>
        <div class="arch-render-wrap">
          <img
            src="/claude_sap_fiori_architecture.svg"
            alt="Claude + SAP Fiori/UI5 Architecture"
            class="arch-svg-img"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isUi5 = computed(() => route.path.startsWith('/ui5'))
const backRoute = computed(() => isUi5.value ? '/ui5' : '/fiori')
const backLabel = computed(() => isUi5.value ? 'UI5 Explorer' : 'Fiori Explorer')
</script>

<style>
.arch-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-2);
  font-family: var(--font-body);
  position: relative;
}

/* ── Top bar ── */
.arch-topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 52px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.arch-topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
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
  flex-shrink: 0;
}
.back-link:hover { background: var(--bg-3); color: var(--t-primary); border-color: var(--border-2); }

.arch-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }

.arch-topbar-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--t-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arch-topbar-right { flex-shrink: 0; }

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
.arch-content {
  flex: 1;
  overflow: auto;
  padding: 16px 20px;
}

.arch-panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.arch-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-2);
  flex-wrap: wrap;
  gap: 8px;
}

.arch-panel-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arch-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 5px;
  letter-spacing: .04em;
  background: #dbeafe;
  color: #1e40af;
}

.arch-panel-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--t-primary);
}

.arch-panel-file {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--t-muted);
}

/* ── SVG image ── */
.arch-render-wrap {
  padding: 28px 32px;
  display: flex;
  justify-content: center;
}

.arch-svg-img {
  max-width: 860px;
  width: 100%;
  height: auto;
  border-radius: 8px;
}

</style>
