import { NextRequest } from "next/server";
import { sponsoredIndexQuery } from "@/sanity/lib/article-family-queries";
import { handleEditorialListApiRequest } from "@/app/lib/article-family/editorial-list-api-handler";

export async function GET(request: NextRequest) {
  return handleEditorialListApiRequest(request, {
    indexQuery: sponsoredIndexQuery,
  });
}
