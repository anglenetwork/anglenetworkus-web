import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

/** `/post/{slug}?id=…` → internal dynamic route; browser URL unchanged. */
function rewritePostIdDisambiguation(
  request: NextRequest,
): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;
  if (!pathname.startsWith("/post/") || pathname.includes("/with-id/")) {
    return null;
  }

  const segments = pathname.slice("/post/".length).split("/").filter(Boolean);
  if (segments.length !== 1) {
    return null;
  }

  const id = searchParams.get("id");
  if (!id) {
    return null;
  }

  const [slug] = segments;
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/post/${slug}/with-id/${encodeURIComponent(id)}`;
  rewriteUrl.search = "";
  return NextResponse.rewrite(rewriteUrl);
}

export async function proxy(request: NextRequest) {
  const postRewrite = rewritePostIdDisambiguation(request);
  if (postRewrite) {
    return postRewrite;
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
