import type { Metadata } from "next";
import { RenderPostPage, buildPostPageMetadata } from "../../render-post-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}): Promise<Metadata> {
  const { slug, id } = await params;
  return buildPostPageMetadata(slug, id);
}

export default async function PostPageWithId({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  return <RenderPostPage slug={slug} id={id} />;
}
