import "server-only";

export const readToken = process.env.SANITY_API_READ_TOKEN;

export const writeToken = process.env.SANITY_API_WRITE_TOKEN;

/** Read-only token for live content, draft mode, and preview. */
export const token = readToken;

if (!readToken) {
  throw new Error("Missing SANITY_API_READ_TOKEN");
}
