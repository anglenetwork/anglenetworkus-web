import {
  MainFirstSection,
  MainSecondSection,
  MainThirdSection,
  MainFourthSection,
  MainSixthSection,
  MainSeventhSection,
  MainHighlightsStories,
} from "./components/Landing";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  indexQuery,
  fourthSectionQuery,
  thirdSectionQuery,
  mostReadQuery,
  sixthSectionQuery,
} from "@/sanity/lib/queries";

export default async function Page() {
  // Fetch posts for the news content
  const posts = await sanityFetchStatic({ query: indexQuery });

  // Fetch posts for the fourth section (US category)
  const fourthSectionPosts = await sanityFetchStatic({
    query: fourthSectionQuery,
    params: { categorySlug: "us" },
  });

  // Fetch posts for the third section (Politics category)
  const thirdSectionPosts = await sanityFetchStatic({
    query: thirdSectionQuery,
    params: { categorySlug: "politics" },
  });

  // Fetch most read posts
  const mostReadPosts = await sanityFetchStatic({ query: mostReadQuery });

  // Fetch posts for sixth section (International category)
  const sixthSectionPosts = await sanityFetchStatic({
    query: sixthSectionQuery,
    params: { categorySlug: "international" },
  });

  return (
    <div className="container mx-auto border-2 border-red-500">
      <MainFirstSection posts={posts} />
      <MainSecondSection />
      <MainHighlightsStories />
      <MainThirdSection
        posts={thirdSectionPosts}
        categoryTitle="POLITICS"
        mostReadPosts={mostReadPosts}
      />
      <MainSixthSection
        posts={sixthSectionPosts}
        categoryTitle="International"
      />
      <MainFourthSection
        posts={mostReadPosts}
        categoryTitle="politics"
        categorySlug="politics"
      />
      <MainSixthSection
        posts={sixthSectionPosts}
        categoryTitle="International"
      />
      <MainSeventhSection
        posts={sixthSectionPosts}
        categoryTitle="International"
      />
    </div>
  );
}
