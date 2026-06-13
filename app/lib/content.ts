/**
 * Central content + brand configuration. Everything the marketing site renders
 * is driven from here so copy can be tuned without touching components.
 */

export const brand = {
  name: "CONDUIT",
  full: "Conduit Systems",
  tagline: "Integration engineering for commerce that refuses to break.",
  email: "hello@conduit.systems",
  domain: "conduit.systems",
};

export type SystemKey =
  | "shopify"
  | "erp"
  | "wms"
  | "tpl"
  | "pos"
  | "marketplace"
  | "payments"
  | "ledger";

export interface SystemDef {
  key: SystemKey;
  label: string;
  short: string;
  /** Hex color used for the node + glow in the 3D mesh. */
  color: string;
  blurb: string;
}

/** The systems we wire together, surfaced as nodes in the integration mesh. */
export const systems: SystemDef[] = [
  {
    key: "shopify",
    label: "Shopify / Plus",
    short: "STOREFRONT",
    color: "#7be08a",
    blurb:
      "Headless storefronts, checkout extensions, and Admin API sync that keeps catalog, pricing, and orders in lockstep.",
  },
  {
    key: "erp",
    label: "ERP",
    short: "NetSuite · SAP · MS Dynamics",
    color: "#5fa8ff",
    blurb:
      "Bi-directional financial truth — orders, invoices, COGS, and inventory valuation reconciled in real time.",
  },
  {
    key: "wms",
    label: "WMS",
    short: "Manhattan · Körber · custom",
    color: "#22d3ee",
    blurb:
      "Pick / pack / ship orchestration with deterministic event ordering, so the warehouse never sees a half-written order.",
  },
  {
    key: "tpl",
    label: "3PL",
    short: "ShipBob · Flexport · DHL",
    color: "#c084fc",
    blurb:
      "Multi-warehouse fulfillment routing, ASN/EDI translation, and tracking webhooks normalized into one schema.",
  },
  {
    key: "pos",
    label: "POS",
    short: "Square · Lightspeed · Shopify POS",
    color: "#f0abfc",
    blurb:
      "Unified inventory across retail floors and the web, with offline-tolerant sync and conflict resolution.",
  },
  {
    key: "marketplace",
    label: "Marketplaces",
    short: "Amazon · TikTok · Faire",
    color: "#fbbf24",
    blurb:
      "Listing, inventory, and order ingestion across channels with rate-limit-aware, idempotent connectors.",
  },
  {
    key: "payments",
    label: "Payments",
    short: "Stripe · Adyen · Braintree",
    color: "#34d399",
    blurb:
      "Authorizations, captures, refunds, and payouts reconciled against the ledger down to the cent.",
  },
  {
    key: "ledger",
    label: "Data Ledger",
    short: "Event store · CDC · BI",
    color: "#38bdf8",
    blurb:
      "An immutable event spine that every system reads from — replayable, auditable, and queryable.",
  },
];

export const capabilities = [
  {
    title: "Event-driven integration spine",
    body: "We model your business as a stream of immutable events, not brittle point-to-point syncs. Every system subscribes to the truth it needs.",
    tag: "ARCHITECTURE",
  },
  {
    title: "Idempotent, replayable connectors",
    body: "Webhooks fail. APIs rate-limit. Our connectors are built to retry, dedupe, and replay without ever double-charging or double-shipping.",
    tag: "RELIABILITY",
  },
  {
    title: "Real-time inventory & order sync",
    body: "Sub-second propagation across storefront, POS, WMS, and 3PL — with conflict resolution that survives partial outages.",
    tag: "THROUGHPUT",
  },
  {
    title: "Observability baked in",
    body: "Every message is traced end-to-end. When something drifts at 3am, you see exactly which hop, which payload, which version.",
    tag: "VISIBILITY",
  },
];

/** Steps in the pipeline visualization — a single order's journey. */
export const pipeline = [
  {
    step: "01",
    from: "Shopify",
    title: "Order captured",
    detail: "Checkout fires `orders/create`. We validate, enrich, and stamp an idempotency key before anything downstream moves.",
  },
  {
    step: "02",
    from: "Integration spine",
    title: "Normalized to a canonical event",
    detail: "The raw payload is mapped to a versioned internal schema. One shape, every channel — no per-system spaghetti.",
  },
  {
    step: "03",
    from: "ERP + WMS",
    title: "Reserved & routed",
    detail: "Inventory is reserved in the ERP and a pick task is dispatched to the WMS / 3PL closest to the customer.",
  },
  {
    step: "04",
    from: "3PL",
    title: "Fulfilled & tracked",
    detail: "ASN, label, and tracking webhooks flow back, normalized, and the customer + ledger are updated in the same breath.",
  },
];

export const stats = [
  { value: "99.99%", label: "connector uptime" },
  { value: "<200ms", label: "median sync latency" },
  { value: "120M+", label: "events / month routed" },
  { value: "0", label: "double-ships on record" },
];

export const navLinks = [
  { label: "Mesh", href: "#mesh" },
  { label: "Systems", href: "#systems" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

/**
 * Sample payloads shown in the "code stream" — a Shopify order being
 * transformed into a canonical event and then a WMS pick task. Purely
 * illustrative, but real-looking.
 */
export const codeSamples = {
  inbound: `// inbound · shopify orders/create webhook
{
  "id": 5821993402,
  "financial_status": "paid",
  "line_items": [
    { "sku": "TEE-BLK-M", "quantity": 2, "price": "38.00" }
  ],
  "shipping_address": { "country_code": "US", "zip": "97209" }
}`,
  canonical: `// spine · normalized → canonical.order.v3
const event = normalize(payload, "shopify");
emit("order.created", {
  idempotencyKey: hash(payload.id, "shopify"),
  currency: event.currency,
  lines: event.lines.map(toCanonicalLine),
  destination: route(event.shipTo),   // → nearest 3PL
});`,
  outbound: `// outbound · wms pick task dispatched
POST /wms/v2/pick-tasks
{
  "warehouse": "PDX-01",
  "priority": "standard",
  "lines": [{ "sku": "TEE-BLK-M", "qty": 2, "bin": "A-14-3" }],
  "trace": "ord_5821993402::canonical.v3"
}`,
};
