export const cats = {
  discovery: {
    color: 'purple',
    label: 'Discovery',
    tools: ['search_docs', 'list_fiori_apps']
  },
  workflow: {
    color: 'blue',
    label: 'App Generation',
    tools: ['list_functionalities', 'get_functionality_details', 'execute_functionality']
  }
}

export const tools = {
  search_docs: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — searches bundled documentation index',
    desc: 'Searches SAP Fiori elements, OData Annotations, UI5, and SAP Fiori Tools documentation for a given query string.',
    req: `Tool input:
{ query: "how to add custom column
  to List Report table" }

Internally searches locally bundled index of:
- SAP Fiori elements documentation
- OData Annotations reference
- SAPUI5 SDK documentation
- SAP Fiori Tools guides

No live SAP backend call required.
Index is bundled with the MCP server.`,
    res: `MCP returns relevant documentation
snippets and references:

## Results for "custom column List Report"

### Fiori Elements: Custom Columns
Path: fiori-elements/table-building-blocks
...Adding a custom column requires registering
a fragment via manifest.json:

"customColumns": {
  "MyColumn": {
    "header": "Custom",
    "template": "MyApp.ext.CustomCol",
    "position": { "placement": "After",
                  "anchor": "DataField::Rating" }
  }
}

[+ 3 more results with excerpts]`,
    note: 'Documentation index is updated with each server release. Works offline — no internet required.'
  },

  list_fiori_apps: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — scans local filesystem only',
    desc: 'Scans a specified directory path to discover all existing SAP Fiori applications that can be modified by execute_functionality.',
    req: `Tool input:
{ directory: "/workspace/my-cap-project" }

Internally reads local filesystem:
- Scans all subdirectories for
  manifest.json files
- Identifies Fiori app structure by
  checking for ui5.yaml and
  sap.app/type = "application"
- Reads package.json for UI5 framework
  and version info`,
    res: `MCP returns list of discovered apps:

[
  {
    path: "/workspace/my-cap-project/app/incidents",
    appId: "ns.incidents",
    title: "Incidents Management",
    type: "ListReport",
    framework: "SAPUI5",
    version: "1.120.0",
    service: "IncidentService"
  },
  {
    path: "/workspace/my-cap-project/app/customers",
    appId: "ns.customers",
    title: "Customer List",
    type: "ListReport",
    framework: "SAPUI5",
    version: "1.120.0",
    service: "CustomerService"
  }
]`,
    note: 'Prerequisite step before calling execute_functionality. Provides the appPath needed for modification operations.'
  },

  list_functionalities: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — returns static capability catalog',
    desc: 'Step 1 of 3. Returns the full catalog of supported operations for creating new or modifying existing SAP Fiori elements applications.',
    req: `Tool input: none

No parameters required.
No SAP backend call.
Returns static capability list
bundled with the MCP server.

Typical usage:
Claude calls this first to understand
what the server can do, then presents
options to the user.`,
    res: `MCP returns capability catalog:

GENERATE:
- generate_fiori_cap: Generate Fiori elements
  app in a CAP Node.js project
  (List Report + Object Page)
- generate_fiori_odata: Generate Fiori elements
  app for existing OData service (ABAP RAP,
  OData V2/V4)

MODIFY (requires existing app):
- add_page: Add page to existing app
  (Object Page, Custom Page, etc.)
- delete_page: Remove a page from routing
- add_controller_extension: Add controller
  extension to an existing page
- enable_fcl: Enable Flexible Column Layout
- modify_manifest: Update manifest.json
  properties (routing, load settings, etc.)`,
    note: '3-step workflow: list_functionalities → get_functionality_details → execute_functionality. Always start here.'
  },

  get_functionality_details: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No SAP call — returns parameter schema for chosen functionality',
    desc: 'Step 2 of 3. Returns the full parameter schema and documentation needed to execute a specific functionality from list_functionalities.',
    req: `Tool input:
{ functionality: "generate_fiori_odata" }

No SAP backend call.
Returns parameter schema for the
chosen functionality.

Claude uses this to know exactly
what to ask the user / gather from
context before Step 3.`,
    res: `MCP returns JSON schema:

Functionality: generate_fiori_odata
Description: Generate Fiori elements app
  for an existing OData service

Required parameters:
- serviceUrl (string)
  The OData service URL
  e.g. https://host/sap/opu/odata/sap/...

- entitySet (string)
  Target OData entity set
  e.g. "BusinessPartnerSet"

- targetFolder (string)
  Where to generate the app

Optional parameters:
- appTitle (string) Default: entity set name
- namespace (string) Default: "ns"
- authentication (object)
  { username, password } for metadata fetch`,
    note: 'Always call this before execute_functionality. The schema changes per functionality — never guess parameters.'
  },

  execute_functionality: {
    method: 'POST',
    readonly: false,
    endpoint: 'OData $metadata endpoint (when generating from OData service) + local filesystem writes',
    desc: 'Step 3 of 3. Executes the chosen functionality. The ONLY write tool — generates or modifies Fiori app files on disk.',
    req: `Tool input (example: generate_fiori_odata):
{
  functionality: "generate_fiori_odata",
  serviceUrl: "https://myhost/sap/opu/
    odata/sap/ZINCIDENTS_SRV",
  entitySet: "IncidentSet",
  targetFolder: "/workspace/my-cap/app",
  appTitle: "Incident Management",
  namespace: "ns.incidents"
}

For OData-based generation, MCP calls:
GET {serviceUrl}/$metadata
Authorization: Basic ...
→ Parses annotations, entity types,
  navigation properties

For CAP-based generation:
Reads local CDS model files instead.`,
    res: `HTTP 200 from $metadata → parses model

Then writes to disk:
✓ /workspace/my-cap/app/incidents/
    manifest.json
    package.json
    ui5.yaml
    webapp/
      index.html
      Component.js
      view/
        ListReport.view.xml
        ObjectPage.view.xml
      annotations/
        annotation.xml
      i18n/
        i18n.properties

MCP returns:
✓ App generated successfully
  Path: /workspace/my-cap/app/incidents
  Pages: ListReport, ObjectPage
  Entity: IncidentSet (12 properties)
  Annotations: 8 line items, 4 field groups`,
    note: 'WRITES TO DISK — generates/modifies manifest.json, view XMLs, controller files, annotations. Recommended timeout: 600 seconds.'
  }
}
