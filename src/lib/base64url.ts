/** URL-safe base64 encode/decode shared by the team share codes. The
 * encodeURIComponent round-trip keeps non-ASCII input safe; the output
 * alphabet is URL-safe (no +, /, or trailing = padding). */
export function encodeBase64Url(raw: string): string {
  return btoa(unescape(encodeURIComponent(raw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/** Inverse of encodeBase64Url. Throws on malformed input. */
export function decodeBase64Url(code: string): string {
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
  return decodeURIComponent(escape(atob(b64)))
}
