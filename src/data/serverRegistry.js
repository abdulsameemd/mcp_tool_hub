import { cats as abapCats, tools as abapTools } from './tools.js'
import { cats as fioriCats, tools as fioriTools } from './fioriTools.js'
import { cats as ui5Cats, tools as ui5Tools } from './ui5Tools.js'

export const servers = {
  abap: {
    key: 'abap',
    name: 'ABAP MCP',
    fullName: 'ABAP MCP Server',
    subtitle: 'ADT REST · S/4HANA',
    package: '@sap-ux/abap-mcp-server',
    desc: 'Search, analyse, generate, review and transport ABAP code through SAP ADT REST endpoints — all from natural language.',
    color: 'green',
    accentHex: '#0f4024',
    accentBg: '#dcfce7',
    tagline: '14 tools · Read + Write · ADT REST',
    cats: abapCats,
    tools: abapTools,
    totalTools: 14,
    readOnly: 13,
    writes: 1,
    icon: 'layers'
  },
  fiori: {
    key: 'fiori',
    name: 'Fiori Tools MCP',
    fullName: 'SAP Fiori Tools MCP Server',
    subtitle: '@sap-ux/fiori-mcp-server',
    package: '@sap-ux/fiori-mcp-server',
    desc: 'Generate and modify SAP Fiori elements apps from OData services and CAP projects. 3-step orchestration workflow.',
    color: 'blue',
    accentHex: '#1d4ed8',
    accentBg: '#dbeafe',
    tagline: '5 tools · 3-step workflow · CAP + OData',
    cats: fioriCats,
    tools: fioriTools,
    totalTools: 5,
    readOnly: 4,
    writes: 1,
    icon: 'layout'
  },
  ui5: {
    key: 'ui5',
    name: 'UI5 MCP',
    fullName: 'SAP UI5 MCP Server',
    subtitle: '@ui5/mcp-server',
    package: '@ui5/mcp-server',
    desc: 'Scaffold UI5 apps, fetch version-aware API docs, run the linter, validate manifests, and get TypeScript conversion guides.',
    color: 'amber',
    accentHex: '#b45309',
    accentBg: '#fef3c7',
    tagline: '10 tools · Scaffolding + Docs + Quality',
    cats: ui5Cats,
    tools: ui5Tools,
    totalTools: 10,
    readOnly: 7,
    writes: 3,
    icon: 'code'
  }
}
