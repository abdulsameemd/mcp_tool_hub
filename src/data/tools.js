export const cats = {
  analysis: {
    color: 'purple',
    label: 'Analysis',
    tools: ['searchObject', 'getObjectSource', 'getObjectMetadata', 'syntaxCheck']
  },
  codegen: {
    color: 'blue',
    label: 'Code Gen',
    tools: ['generateAbapCode', 'writeObjectSource']
  },
  transport: {
    color: 'teal',
    label: 'Transport',
    tools: ['listTransports', 'getTransportDetails', 'validateTransport']
  },
  atc: {
    color: 'amber',
    label: 'ATC',
    tools: ['runAtcCheck']
  },
  wricef: {
    color: 'green',
    label: 'WRICEF',
    tools: ['generateWricefSpec']
  },
  cds: {
    color: 'coral',
    label: 'CDS',
    tools: ['generateCdsView', 'reviewCdsView', 'reviewAbapCode']
  }
}

export const tools = {
  searchObject: {
    method: 'GET',
    readonly: true,
    endpoint: '/sap/bc/adt/repository/informationsystem/search',
    desc: 'Searches SAP repository for ABAP objects by name and optional type filter.',
    req: `Authorization: Basic base64(user:pass)
sap-client: 100
Accept: application/xml

Query params:
?operation=quickSearch
&query=ZCL_INVOICE*
&objectType=CLAS
&maxResults=20`,
    res: `HTTP 200 OK — XML

<adtcore:objectReference
  adtcore:name="ZCL_INVOICE_PROCESSOR"
  adtcore:type="CLAS"
  adtcore:uri="/sap/bc/adt/oo/classes/zcl_invoice_processor"
  adtcore:description="Invoice processing class"/>

Parsed into:
{ name, type, uri, description, packageName }`,
    note: 'Object types: CLAS · PROG · INTF · FUGR · TABL · DDLS · BDEF · SRVD'
  },
  getObjectSource: {
    method: 'GET',
    readonly: true,
    endpoint: '/sap/bc/adt/oo/classes/{name}/source/main',
    desc: 'Reads the ABAP source code of any object directly from SAP.',
    req: `Authorization: Basic base64(user:pass)
sap-client: 100
Accept: text/plain
Cookie: SAP_SESSIONID=abc123

Path: /sap/bc/adt/oo/classes/
      zcl_invoice_processor/source/main`,
    res: `HTTP 200 OK — text/plain

CLASS zcl_invoice_processor
  DEFINITION PUBLIC FINAL.
  PUBLIC SECTION.
    METHODS process_invoice
      IMPORTING iv_id TYPE string
      RETURNING VALUE(rv_ok) TYPE abap_bool.
ENDCLASS.
CLASS zcl_invoice_processor IMPLEMENTATION.
  METHOD process_invoice.
    rv_ok = abap_true.
  ENDMETHOD.
ENDCLASS.`,
    note: 'Works for: CLAS · PROG · INTF · FUGR · DDLS (CDS) · BDEF (RAP behavior def)'
  },
  getObjectMetadata: {
    method: 'GET',
    readonly: true,
    endpoint: '/sap/bc/adt/oo/classes/{name}',
    desc: 'Fetches metadata of an ABAP object — package, description, responsible developer, created date.',
    req: `Authorization: Basic base64(user:pass)
sap-client: 100
Accept: application/xml
Cookie: SAP_SESSIONID=abc123

Path: /sap/bc/adt/oo/classes/
      zcl_invoice_processor`,
    res: `HTTP 200 OK — XML

adtcore:name="ZCL_INVOICE_PROCESSOR"
adtcore:type="CLAS"
adtcore:packageName="ZDFI"
adtcore:responsible="ABDSAMEE"
adtcore:description="Invoice processor"
adtcore:createdAt="2026-01-15"
adtcore:version="active"

Parsed into:
{ name, type, packageName, responsible,
  description, createdAt, version }`,
    note: 'Used by generateWricefSpec to populate document header automatically'
  },
  syntaxCheck: {
    method: 'POST',
    readonly: true,
    endpoint: '/sap/bc/adt/abapsource/syntaxcheck',
    desc: 'Runs a syntax check on ABAP source code. Returns errors with line numbers.',
    req: `Authorization: Basic base64(user:pass)
sap-client: 100
Content-Type: text/plain
Accept: application/xml

Body (raw ABAP source):
CLASS zcl_test DEFINITION PUBLIC.
  PUBLIC SECTION.
    METHODS run.
ENDCLASS.
CLASS zcl_test IMPLEMENTATION.
  METHOD run.
    DATA lv_x TYPE strig.  " typo
  ENDMETHOD.
ENDCLASS.

Optional param: ?adtMainUrl=/sap/bc/adt/...`,
    res: `HTTP 200 OK — XML (errors found)

<atom:category
  term="syntax error at line 8: unknown type STRIG"
  scheme="...severity#error"/>

No errors:
HTTP 200 OK — empty XML body
→ MCP returns "✓ Syntax check passed"

Parsed into:
[{ message, line, severity: error|warning }]`,
    note: 'Always called before writeObjectSource — if errors found, write is aborted automatically'
  },
  generateAbapCode: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No ADT call — Claude generates code',
    desc: 'Prepares structured instructions for Claude to generate DEWA-standard ABAP code. No SAP call needed.',
    req: `Tool input:
{ requirement: "Process vendor invoices
    and post to FI",
  objectType: "CLASS",
  objectName: "ZCL_FI_INVOICE_PROC",
  packageName: "ZDFI" }

CLAUDE.md is auto-loaded with:
- DEWA naming conventions
- Clean ABAP rules
- S/4HANA 2023 standards`,
    res: `MCP returns structured prompt to Claude:

## ABAP Code Generation Request
Object: ZCL_FI_INVOICE_PROC (CLASS)
Package: ZDFI
SAP Version: S4HANA

Coding Standards:
- ABAP 7.4+ inline declarations
- Clean ABAP (no Hungarian notation)
- TRY/CATCH exception handling
- No SELECT inside loops

Requirement: Process vendor invoices...

Claude generates complete CLASS source`,
    note: 'No Anthropic API credits used — Claude Code itself does the AI generation (correct MCP architecture)'
  },
  writeObjectSource: {
    method: 'PUT',
    readonly: false,
    endpoint: '/sap/bc/adt/oo/classes/{name}/source/main',
    desc: 'Writes ABAP source back to SAP. Full lock → write → syntax check → activate → unlock sequence.',
    req: `Step 1 — Lock object:
POST /sap/bc/adt/oo/classes/{name}
  ?method=_lock&accessMode=MODIFY
Header: X-sap-adt-sessiontype: stateful
→ Response: lockHandle = "abc123XYZ"

Step 2 — Write source:
PUT /sap/bc/adt/oo/classes/{name}/source/main
  ?lockHandle=abc123XYZ
  &corrNr=DEVK900123
Content-Type: text/plain
Body: <complete ABAP source code>

Step 3 — Syntax check (POST syntaxcheck)
Step 4 — Activate:
POST /sap/bc/adt/activation
  ?method=activate
Body: XML objectReference

Step 5 — Unlock:
DELETE /sap/bc/adt/oo/classes/{name}
  ?method=_lock&lockHandle=abc123XYZ`,
    res: `Lock:    200 OK + lockHandle
Write:   200 OK
Syntax:  200 OK (empty = no errors)
         If errors → unlock + abort
Activate: 200 OK
Unlock:  200 OK

MCP returns:
✓ Successfully wrote ZCL_FI_INVOICE_PROC
  Lines: 48
  Transport: DEVK900123
  Activated: yes
  Syntax: clean`,
    note: 'If syntax check fails — source is NOT saved. Object is unlocked automatically. Transport number is optional.'
  },
  listTransports: {
    method: 'GET',
    readonly: true,
    endpoint: '/sap/bc/adt/cts/transports',
    desc: 'Lists all open transport requests for a given SAP user.',
    req: `Authorization: Basic base64(user:pass)
sap-client: 100
Accept: application/xml
Cookie: SAP_SESSIONID=abc123

Query params:
?user=ABDSAMEE
&targets=true`,
    res: `HTTP 200 OK — XML

<tm:workbenchRequest
  tm:number="DEVK900123"
  tm:description="Invoice fix"
  tm:owner="ABDSAMEE"
  tm:status="D"/>
<tm:workbenchRequest
  tm:number="DEVK900124"
  tm:description="CDS views FI"
  tm:owner="ABDSAMEE"
  tm:status="D"/>

Status: D=modifiable · R=released · L=locked

Parsed into array of:
{ number, description, owner, status }`,
    note: "Defaults to configured SAP_USER in .env. Can pass any username to list another user's transports."
  },
  getTransportDetails: {
    method: 'GET',
    readonly: true,
    endpoint: '/sap/bc/adt/cts/transports/{TR_NUMBER}',
    desc: 'Fetches full contents of a transport — all objects, types and lock actions.',
    req: `Authorization: Basic base64(user:pass)
sap-client: 100
Accept: application/xml
Cookie: SAP_SESSIONID=abc123

Path:
/sap/bc/adt/cts/transports/DEVK900123`,
    res: `HTTP 200 OK — XML

<tm:workbenchRequest
  tm:number="DEVK900123"
  tm:description="Invoice fix"
  tm:owner="ABDSAMEE"
  tm:status="D">
  <tm:abapObject
    tm:name="ZCL_INVOICE_PROCESSOR"
    tm:type="CLAS"
    tm:lockAction="INSERT"/>
  <tm:abapObject
    tm:name="ZIF_INVOICE"
    tm:type="INTF"
    tm:lockAction="INSERT"/>
  <tm:abapObject
    tm:name="ZDFI_INVOICE_ITEMS"
    tm:type="TABL"
    tm:lockAction="INSERT"/>
</tm:workbenchRequest>

lockAction: INSERT=new · UPDATE=changed · DELETE`,
    note: 'Object types include: CLAS · INTF · PROG · FUGR · TABL · DDLS · BDEF · SRVD · SRVB'
  },
  validateTransport: {
    method: 'NONE',
    readonly: true,
    endpoint: 'No extra ADT call — MCP-side validation on top of getTransportDetails',
    desc: 'Calls getTransportDetails then applies validation rules. Zero additional SAP calls.',
    req: `Tool input:
{ transportNumber: "DEVK900123" }

Internally calls:
GET /sap/bc/adt/cts/transports/DEVK900123
→ gets objects[] and status

Then MCP applies rules:
if objects.length === 0  → EMPTY warning
if status === "R"        → already released
if status === "D" and
   objects.length > 0    → VALID`,
    res: `Valid transport:
✓ Transport DEVK900123 is valid
  - 3 objects found
  - Status: D (modifiable)
  - Owner: ABDSAMEE
  - Ready for release

Empty transport:
⚠ Transport is empty
  - No objects attached
  - Add objects before release

Released transport:
ℹ Transport already released
  - Status: R
  - Cannot modify`,
    note: 'Read-only. releaseTransport (in pipeline) will handle actual release with safety confirmation flow.'
  },
  runAtcCheck: {
    method: 'POST',
    readonly: true,
    endpoint: '/sap/bc/adt/atc/runs',
    desc: 'Triggers ATC check using configured DEWA variant Z_ABAP_ATC. Polls worklist for results.',
    req: `Step 1 — Create ATC run:
POST /sap/bc/adt/atc/runs
  ?checkVariant=Z_ABAP_ATC
Content-Type: application/xml

Body:
<atcrun:run maximumVerdicts="100">
  <objectSets>
    <objectSet kind="inclusive">
      <adtcore:objectReferences>
        <adtcore:objectReference
          adtcore:name="ZCL_INVOICE_PROC"
          adtcore:type="CLAS"/>
      </adtcore:objectReferences>
    </objectSet>
  </objectSets>
</atcrun:run>

Step 2 — Poll worklist:
GET {Location header from response}
  (wait 3s for ATC to complete)`,
    res: `ATC run: 200 OK
  Header: Location: /sap/bc/adt/atc/worklists/W001

Worklist: 200 OK — XML findings

<atcworklist:item
  atcworklist:priority="1"
  atcworklist:checkName="SELECT_LOOP"
  atcworklist:messageText="SELECT in LOOP"
  atcworklist:line="45"
  atcworklist:category="Performance"/>

Priority mapping:
1 = ERROR (must fix before transport)
2 = WARNING (review before transport)
3 = INFO (improvement suggestion)

MCP formats into readable report with
Priority 1/2/3 sections and fix guidance`,
    note: 'Uses Z_ABAP_ATC from ATC_VARIANT in .env. Can override per-call. Also supports ZCVAGLOBAL variant.'
  },
  generateWricefSpec: {
    method: 'GET',
    readonly: true,
    endpoint: 'getObjectSource + getObjectMetadata (optional)',
    desc: 'Fetches object source and metadata from SAP, then returns structured instructions for Claude to write the WRICEF spec.',
    req: `Tool input:
{ objectName: "ZCL_FI_INVOICE_PROC",
  objectUri: "/sap/bc/adt/oo/classes/...",
  wricefType: "I",
  description: "Vendor invoice interface",
  transportNumber: "DEVK900123" }

ADT calls made:
GET .../source/main  → ABAP source
GET .../             → metadata
GET .../transports/DEVK900123 → TR info`,
    res: `MCP returns prompt to Claude with:

## WRICEF Technical Specification Request
Object: ZCL_FI_INVOICE_PROC
Type: Interface (I)
Transport: DEVK900123 — Invoice fix (2 objects)
Date: 2026-04-13

Required sections:
1. Document Header & Control
2. Overview & Business Purpose
3. Technical Design & Architecture
4. Input / Output Specification
5. Interface / Integration Points
6. Error Handling & Logging
7. Transport & Deployment Steps
8. Test Scenarios & Expected Results
9. Sign-off & Approvals

+ ABAP source attached for analysis

Claude generates complete 9-section spec`,
    note: 'generateWricefDoc (pipeline) will save this as a proper .docx Word document with DEWA letterhead and tables.'
  },
  generateCdsView: {
    method: 'GET',
    readonly: true,
    endpoint: 'getObjectSource on base view (optional)',
    desc: 'Optionally reads base CDS view from SAP, then instructs Claude to generate DEWA-standard CDS view entity.',
    req: `Tool input:
{ viewName: "ZFI_I_VendorInvoice",
  viewType: "I",
  module: "FI",
  baseTable: "BKPF",
  description: "Vendor invoice header",
  withOdata: true,
  withAccessControl: true }

Optional ADT call (if baseView provided):
GET /sap/bc/adt/ddic/ddl/sources/
    {baseViewName}/source/main
→ reads existing CDS for reference`,
    res: `MCP returns generation prompt to Claude:

## CDS View Generation Request
View: ZFI_I_VendorInvoice
Type: Interface View (I)
Module: FI
Table: BKPF
SAP Version: S4HANA

DEWA naming rules:
- Z<Module>_I_<Description>
- Fields in PascalCase (CompanyCode not BUKRS)
- @AccessControl.authorizationCheck: #CHECK
- Use released APIs (I_CompanyCode not T001)
- Clean Core Level A compliance

Claude generates complete CDS DDL source
+ annotations + companion DCL suggestion`,
    note: 'DEWA convention enforced: ZFI_I_ for interface, ZFI_C_ for consumption, ZFI_R_ for root views.'
  },
  reviewCdsView: {
    method: 'GET',
    readonly: true,
    endpoint: '/sap/bc/adt/ddic/ddl/sources/{name}/source/main',
    desc: 'Reads CDS view source from SAP and returns it with DEWA-specific review instructions for Claude.',
    req: `Tool input:
{ viewName: "ZFI_I_VendorInvoice",
  reviewType: "full" }

Auto-derived ADT call:
GET /sap/bc/adt/ddic/ddl/sources/
    zfi_i_vendorinvoice/source/main
Accept: text/plain

Or provide viewUri directly:
GET {viewUri}/source/main

Review types:
full · naming · annotations
cleancore · performance`,
    res: `MCP returns CDS source + review prompt:

Check 1 — Naming conventions
  ZFI_I_ prefix correct? Fields PascalCase?

Check 2 — Annotation completeness
  @AbapCatalog · @EndUserText · @AccessControl
  @OData (for C views) · @UI (for Fiori)

Check 3 — Clean Core compliance
  Direct table BKPF? → suggest I_JournalEntry
  Direct table BUT000? → suggest I_BusinessPartner

Check 4 — Performance
  SELECT SINGLE inside CDS? (anti-pattern)
  Missing ON conditions? (Cartesian join risk)

Check 5 — RAP readiness
  ETag field present? Composition defined?

Claude returns score + issues + fixed DDL`,
    note: 'Same read-only ADT call as getObjectSource but targets /ddic/ddl/sources/ path for CDS objects.'
  },
  reviewAbapCode: {
    method: 'GET',
    readonly: true,
    endpoint: '/sap/bc/adt/oo/classes/{name}/source/main',
    desc: 'Reads ABAP source from SAP and returns it with Clean ABAP review instructions for Claude.',
    req: `Tool input:
{ objectName: "ZCL_INVOICE_PROCESSOR",
  objectUri: "/sap/bc/adt/oo/classes/...",
  ruleset: "all" }

ADT call:
GET /sap/bc/adt/.../source/main
Accept: text/plain

Rulesets:
all · clean-abap · performance
security (can combine)`,
    res: `MCP returns source + review prompt:

CRITICAL checks:
- SELECT inside LOOP (N+1 problem)
- Missing AUTHORITY-CHECK
- Hardcoded credentials
- Uncaught exceptions

WARNING checks:
- Magic numbers (use constants)
- Methods > 40 lines
- Dead code (unreachable)
- MOVE statement (use = instead)

INFO checks:
- Hungarian notation (lv_, ls_, lt_)
- Old syntax (WRITE, CONCATENATE)
- Naming convention violations

Claude returns:
- Score before/after (0-100)
- Per-issue BEFORE/AFTER code diff
- Complete fixed source code`,
    note: 'No Anthropic API credits used — Claude Code does the AI review. Ruleset from REVIEW_RULESET in .env.'
  }
}
