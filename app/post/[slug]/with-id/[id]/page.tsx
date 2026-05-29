import type { Metadata } from "next";
import { RenderPostPage } from "../../render-post-page";
import { buildPostPageMetadata } from "../../post-page-metadata";

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
