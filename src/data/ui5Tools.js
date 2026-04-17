export const cats = {
  scaffolding: {
    color: 'amber',
    label: 'Scaffolding',
    tools: ['create_ui5_app', 'create_integration_card']
  },
  docs: {
    color: 'blue',
    label: 'Documentation',
    tools: ['get_api_reference', 'get_guidelines', 'get_integration_cards_guidelines', 'get_typescript_conversion_guidelines', 'get_version_info']
  },
  analysis: {
    color: 'purple',
    label: 'Analysis',
    tools: ['get_project_info']
  },
  quality: {
    color: 'green',
    label: 'Quality',
    tools: ['run_ui5_linter', 'run_manifest_validation']
  }
}

export const tools = {
  create_ui5_app: {
    method: 'POST',
    readonly: false,
    endpoint: 'OData V4 $metadata (optional) + local filesystem writes',
    desc: 'Scaffolds a new SAPUI5 or OpenUI5 application from templates. Optionally pre-configures an OData V4 model from a provided service URL.',
    req: `Tool input:
{
  projectName: "incidents-app",
  namespace: "com.myorg.incidents",
  template: "ts-app",
  oDataV4Url: "https://myhost/odata/v4/
    IncidentService",
  entitySet: "Incidents",
  targetFolder: "/workspace/projects"
}

Templates available:
- app (JavaScript standalone)
- ts-app (TypeScript standalone)
- cap-app (JavaScript + CAP)
- ts-cap-app (TypeScript + CAP)
- worklist-app

If oDataV4Url provided → MCP calls:
GET {oDataV4Url}/$metadata
to fetch service model.
Domain must be in
UI5_MCP_SERVER_ALLOWED_DOMAINS.`,
    res: `✓ UI5 app scaffolded successfully

Generated:
/workspace/projects/incidents-app/
  package.json
  ui5.yaml
  tsconfig.json       (TypeScript only)
  webapp/
    manifest.json
    index.html
    Component.ts
    controller/
      Main.controller.ts
    view/
      Main.view.xml
    model/
      formatter.ts
    i18n/
      i18n.properties

OData model pre-configured:
  Service: IncidentService
  Entity: Incidents (8 properties)
  Binding: /Incidents in Main.view.xml`,
    note: 'WRITES TO DISK. Domain of oDataV4Url must be in UI5_MCP_SERVER_ALLOWED_DOMAINS env var, or set to "" to allow all.'
  },

  create_integration_card: {
    method: 'NONE',
    readonly: false,
    endpoint: 'No SAP call — local filesystem writes only',
    desc: 'Scaffolds a new UI Integration Card project. Supports List, Table, Object, Calendar, Timeline, and Analytical card types.',
    req: `Tool input:
{
  cardType: "List",
  projectName: "my-list-card",
  targetFolder: "/workspace/cards"
}

Card types supported:
- List       → list items with icon/title
- Table      → columnar data display
- Object     → header + sections layout
- Calendar   → calendar with appointments
- Timeline   → chronological events
- Analytical → charts (44 chart types)

No SAP backend call during scaffolding.
Card connects to SAP BTP destinations
at runtime via manifest.json config.`,
    res: `✓ Integration Card scaffolded

Generated:
/workspace/cards/my-list-card/
  manifest.json      (card descriptor)
  package.json
  i18n/
    i18n.properties
  dt/
    Configuration.js  (config editor)
  preview/
    index.html        (local preview)

manifest.json pre-configured:
  type: "List"
  data.request configured for
  {{destinations.myDestination}}/path
  Ready for SAP Work Zone deployment`,
    note: 'WRITES TO DISK. Use run_manifest_validation after editing manifest.json. Preview locally with npm start.'
  },

  get_api_reference: {
    method: 'GET',
    readonly: true,
    endpoint: 'https://ui5.sap.com (SAPUI5) or https://sdk.openui5.org (OpenUI5)',
    desc: 'Fetches and formats official UI5 API documentation for a specific control or module. Version-aware — always returns docs for the exact UI5 version your project uses.',
    req: `Tool input:
{
  projectPath: "/workspace/incidents-app",
  apiName: "sap.m.Table"
}

MCP reads project config:
1. ui5.yaml → framework + version
2. package.json → @ui5/webcomponents version

Then fetches:
GET https://ui5.sap.com/{version}/
    docs/api/api.json?symbol=sap.m.Table

Results cached in UI5_DATA_DIR (~/.ui5)
for offline reuse.

API name formats accepted:
- sap.m.Button
- sap/m/Table
- sap.ui.model.json.JSONModel
- sap.f.FlexibleColumnLayout`,
    res: `## sap.m.Table (SAPUI5 1.120.0)

Extends: sap.m.ListBase
Module: sap/m/Table

### Constructor
new sap.m.Table(sId?, mSettings?)

### Properties
- autoPopinMode (boolean, default: false)
  Enables automatic popin behavior
- contextualWidth (string, default: "inherit")
  Defines contextual width threshold

### Aggregations
- columns (sap.m.Column [0..*])
  Defines the columns of the table

### Events
- selectionChange (since 1.16)
  Fired when selection is changed

[+ full API reference continues]`,
    note: 'Version-aware — fetches exact version from your ui5.yaml. Results cached locally in ~/.ui5 for offline access.'
  },

  get_guidelines: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — returns bundled guideline documents',
    desc: 'Provides the full set of UI5 development best practices and mandatory coding rules. Topic-filtered for targeted guidance.',
    req: `Tool input:
{ topic: "typescript" }

Topics available:
- general       → module loading, binding rules,
                  OData types, i18n standards
- typescript    → tsconfig, ES class conversion,
                  event handler typing, enums
- cap-integration → CAP + UI5 patterns,
                  service binding, delta load
- forms         → Form layout, SmartForm,
                  validation patterns
- performance   → lazy loading, model sizing,
                  bundle optimization

Omit topic for all guidelines.
No SAP backend call required.`,
    res: `## UI5 TypeScript Guidelines

### Module Loading (MANDATORY)
Use ES6 imports with TypeScript:
  import Button from "sap/m/Button"
  NOT: sap.ui.require(["sap/m/Button"], ...)

### Event Handler Typing
Always type event parameters:
  onPress(oEvent: Button$PressEvent): void {
    const oSource = oEvent.getSource()
  }
  NOT: onPress(oEvent: Event): void

### Control Runtime Methods
Controls generated via @ui5/ts-interface-generator
  Run: npx @ui5/ts-interface-generator
  Commit: .gen/ folder to version control

### OData Types
Use sap.ui.model.odata.type.* not primitives
  type: "sap.ui.model.odata.type.Decimal"
  constraints: { precision: 10, scale: 2 }

[+ more guidelines...]`,
    note: 'Guidelines are updated with each server release. Covers SAPUI5 1.108+ and TypeScript 5.x patterns.'
  },

  get_integration_cards_guidelines: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — returns bundled integration cards guidelines',
    desc: 'Provides the complete best-practice guide for developing UI Integration Cards including all card types, destinations, manifest structure, and validation workflow.',
    req: `Tool input: none

No parameters required.
No SAP backend call.

Returns comprehensive guidelines for:
- All 6 card types
  (List, Table, Object, Calendar,
   Timeline, Analytical)
- Analytical card: 44 chart types
- SAP BTP destination configuration
- dt/Configuration.js editor setup
- i18n for card properties
- Manifest JSON schema rules
- SAP Work Zone deployment
- Local preview setup`,
    res: `## UI Integration Cards Guidelines

### Card Types
List: Simple list items with icon/title/info
Table: Multi-column tabular display
Object: Header image + attribute sections
Calendar: Appointments visualization
Timeline: Chronological event feed
Analytical: 44 chart types (Bar, Line,
  Donut, Bullet, Scatter, Waterfall, ...)

### Destination Configuration
Use BTP destinations — never hardcode URLs:
  "data": {
    "request": {
      "url": "{{destinations.NorthWind}}/
              Customers"
    }
  }

### Manifest Validation (REQUIRED)
"sap.app": { "type": "card" }   ← required
Run run_manifest_validation before deploy

### Configuration Editor
dt/Configuration.js defines design-time
config UI for card consumers in Work Zone`,
    note: 'Analytical card supports 44 chart types including Bullet, Waterfall, Scatter, and all standard chart types.'
  },

  get_typescript_conversion_guidelines: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — returns bundled TypeScript conversion guidelines',
    desc: 'Provides the comprehensive guide for converting UI5 apps from JavaScript to TypeScript — tsconfig, class conversion, OPA tests, and library patterns.',
    req: `Tool input:
{
  projectPath: "/workspace/my-js-app"
}

MCP reads project config to determine
current UI5 version and framework,
then returns version-appropriate
TypeScript conversion guidelines.

No SAP backend call required.
Returns bundled guidelines +
project-specific recommendations.`,
    res: `## UI5 TypeScript Conversion Guide

### 1. Setup tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "strict": true
  }
}

### 2. Update ui5.yaml
builder:
  customTasks:
    - name: ui5-tooling-transpile-task
      afterTask: replaceVersion

### 3. Convert Controllers
BEFORE (JS):
  sap.ui.define(["sap/ui/core/mvc/Controller"],
    function(Controller) { ... })

AFTER (TS):
  import Controller from "sap/ui/core/mvc/Controller"
  export default class Main extends Controller { ... }

### 4. Control Runtime Methods
Run: npx @ui5/ts-interface-generator
Commit .gen/ folder

[+ OPA test conversion, enum patterns...]`,
    note: 'Run run_ui5_linter after conversion to catch deprecated APIs. TypeScript requires UI5 1.108+.'
  },

  get_version_info: {
    method: 'GET',
    readonly: true,
    endpoint: 'https://ui5.sap.com/version.json (SAPUI5) or OpenUI5 CDN equivalent',
    desc: 'Retrieves current version information for the UI5 framework from the official CDN — latest stable, available versions, and maintenance windows.',
    req: `Tool input:
{ frameworkName: "SAPUI5" }

frameworkName options:
- "SAPUI5"   → fetches from ui5.sap.com
- "OpenUI5"  → fetches from sdk.openui5.org

MCP calls:
GET https://ui5.sap.com/version.json

Live CDN call — requires internet.
Returns cached result if CDN unavailable.`,
    res: `{
  frameworkName: "SAPUI5",
  latestVersion: "1.132.1",
  currentLTS: "1.120.21",

  versions: [
    {
      version: "1.132.1",
      support: "Maintenance",
      lts: false,
      eom: "Q3 2025"
    },
    {
      version: "1.120.21",
      support: "Long-Term Maintenance",
      lts: true,
      eom: "Q4 2026"
    },
    {
      version: "1.108.42",
      support: "Long-Term Maintenance",
      lts: true,
      eom: "Q4 2025"
    }
  ],

  recommendation: "Use 1.120.x (LTS) for
    new projects. Upgrade from 1.96 now —
    EOL reached."
}`,
    note: 'Live CDN call to ui5.sap.com or sdk.openui5.org. Use UI5_MCP_SERVER_CDN_URL to override for air-gapped environments.'
  },

  get_project_info: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — reads local project files only',
    desc: 'Extracts metadata and configuration from an existing UI5 project by reading ui5.yaml, package.json, and manifest.json.',
    req: `Tool input:
{
  projectPath: "/workspace/incidents-app"
}

MCP reads local files:
1. ui5.yaml
   → framework, version, middleware config
2. package.json
   → dependencies, scripts, custom tasks
3. webapp/manifest.json
   → app ID, title, type, data sources,
     routing, models configuration

No SAP backend call required.
No network access needed.`,
    res: `{
  framework: "SAPUI5",
  version: "1.120.21",
  type: "application",
  namespace: "com.myorg.incidents",
  appId: "ns.incidents",
  title: "Incident Management",
  language: "TypeScript",

  dataSources: [
    {
      name: "IncidentService",
      uri: "/odata/v4/IncidentService/",
      type: "OData",
      version: "4.0"
    }
  ],

  middleware: [
    "fiori-tools-proxy",
    "fiori-tools-appreload"
  ],

  routing: {
    pattern: "main",
    targets: ["IncidentsList", "IncidentDetail"]
  }
}`,
    note: 'Read-only. Used by Claude to understand project context before suggesting modifications or generating code.'
  },

  run_ui5_linter: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — local analysis using @ui5/linter + UI5 API reference',
    desc: 'Runs @ui5/linter against a UI5 project to detect deprecated APIs, accessibility issues, and coding violations. Can auto-fix simple issues.',
    req: `Tool input:
{
  projectPath: "/workspace/incidents-app",
  fix: false
}

MCP runs @ui5/linter locally:
- Scans all .js, .ts, .xml, .json files
- Cross-references deprecated APIs from
  UI5 SDK for the project's version
- Checks accessibility rules
- Validates deprecated control usage

fix: true → auto-applies fixes for
  issues that @ui5/linter can correct
  (WRITES to source files)

fix: false (default) → report only`,
    res: `## UI5 Linter Report

ERRORS (must fix):
━━━━━━━━━━━━━━━━
controller/Main.controller.ts:45
  no-deprecated-api: sap.ui.commons.Button
  → Migrate to: sap.m.Button
  Deprecated since: 1.38
  EOL: 1.120

view/Main.view.xml:12
  no-deprecated-prop: sap.m.Table.fixedLayout
  → Remove property (auto-calculated)
  Deprecated since: 1.86

WARNINGS (review recommended):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component.js:8
  prefer-async-hints: synchronous module
  loading detected

Summary: 2 errors, 1 warning
Auto-fixable: 1 of 3 issues`,
    note: 'Set fix: true to auto-apply fixable issues. WRITES source files when fix is true. Always review changes after auto-fix.'
  },

  run_manifest_validation: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — validates against bundled UI5 manifest JSON schema',
    desc: 'Validates a project\'s manifest.json against the official UI5 Manifest JSON schema. Essential before deploying Integration Cards.',
    req: `Tool input:
{
  projectPath: "/workspace/my-list-card"
}

MCP locates manifest.json automatically:
- Checks webapp/manifest.json
- Also checks root manifest.json
  (Integration Cards)

Validates against bundled schema:
- sap.app section (required fields)
- sap.ui section
- sap.fiori section
- sap.card section (cards only)
  → "sap.app.type": "card" is REQUIRED
    for Integration Card manifests`,
    res: `## Manifest Validation Report
File: webapp/manifest.json

ERRORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
sap.app.type: required field missing
→ Add: "type": "card"
  Path: /sap.app/type

sap.card.data.request.url: invalid format
→ Use destination placeholder:
  "{{destinations.myDest}}/path"
  not: "https://hardcoded-url.com/path"
  Path: /sap.card/data/request/url

WARNINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
sap.app.i18n: missing (recommended)
→ Add i18n bundle path for translations

Summary: 2 errors, 1 warning
Status: ✗ INVALID — fix errors before deploy`,
    note: 'Read-only. For Integration Cards: sap.app.type = "card" is mandatory. Always run before SAP Work Zone deployment.'
  }
}
