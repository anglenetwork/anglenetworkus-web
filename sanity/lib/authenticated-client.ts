import "server-only";

export { publishedClient, client as previewClient } from "./client";

/** @deprecated Use `publishedClient` for published reads or `previewClient` for draft/live. */
export { publishedClient as authenticatedClient } from "./client";
