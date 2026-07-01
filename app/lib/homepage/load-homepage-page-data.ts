import "server-only";

import { loadHomepageBelowFoldData } from "./load-homepage-below-fold-data";
import { loadHomepageHeroData } from "./load-homepage-hero-data";

export async function loadHomepagePageData() {
  const [hero, belowFold] = await Promise.all([
    loadHomepageHeroData(),
    loadHomepageBelowFoldData(),
  ]);

  return {
    hero,
    ...belowFold,
  };
}
