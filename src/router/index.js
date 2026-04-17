import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ServerExplorerView from '../views/ServerExplorerView.vue'
import AbapDiagramsView from '../views/AbapDiagramsView.vue'
import FioriUi5ArchView from '../views/FioriUi5ArchView.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/abap',  component: ServerExplorerView, meta: { server: 'abap'  } },
    { path: '/abap/diagrams', component: AbapDiagramsView },
    { path: '/fiori', component: ServerExplorerView, meta: { server: 'fiori' } },
    { path: '/fiori/diagrams', component: FioriUi5ArchView },
    { path: '/ui5',   component: ServerExplorerView, meta: { server: 'ui5'   } },
    { path: '/ui5/diagrams',   component: FioriUi5ArchView },
    { path: '/explorer', redirect: '/abap' }
  ]
})
