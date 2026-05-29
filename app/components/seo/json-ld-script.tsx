/** Server-built JSON-LD only — never pass user-controlled HTML. */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {JSON.stringify(data).replace(/</g, "\\u003c")}
    </script>
  );
}
