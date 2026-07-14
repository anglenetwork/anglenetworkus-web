import { articleTitleLink } from "./article-links";

/** My profile — section header block (title + description) */
export const profileSectionHeader =
  "mb-8 border-news-primary border-l-8 bg-news-surface px-4 py-4 xl:mb-12 xl:px-5 xl:py-5";

/** My profile — section header title */
export const profileSectionTitle =
  "mb-2 font-bold font-display text-2xl text-news-text leading-tight tracking-tight xl:text-3xl";

/** My profile — section header description */
export const profileSectionDescription =
  "font-sans text-base text-news-text leading-relaxed";

/** My profile — profile details display name */
export const profileDetailsDisplayName =
  "font-bold font-display text-3xl text-news-text leading-tight tracking-tight";

/** My profile — profile details email subtitle */
export const profileDetailsEmail =
  "mt-1 font-sans text-sm font-medium text-news-muted";

/** My profile — profile details field card value (compact) */
export const profileDetailsFieldValue =
  "font-semibold font-sans text-lg text-news-text leading-snug";

/** My profile — profile details empty field placeholder */
export const profileDetailsEmptyValue =
  "font-sans text-lg font-normal text-news-muted italic";

/** My profile — sidebar navigation link (desktop) */
export const profileSidebarNavLink =
  "flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-base font-semibold leading-snug tracking-normal text-news-text transition-colors";

/** My profile — sidebar navigation link (mobile) */
export const profileSidebarNavLinkMobile =
  "flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 font-sans text-xs font-semibold text-news-text transition-colors";

/** My profile — form field label */
export const profileFormLabel =
  "mb-3 block font-sans text-sm font-semibold text-news-text";

/** My profile — read-only field value */
const profileFormValue = "font-sans text-base font-normal text-news-text";

/** My profile — text input */
export const profileFormInput =
  "w-full max-w-xl font-sans focus-visible:border-news-text focus-visible:ring-0 focus-visible:ring-offset-0";

/** My profile — field validation error */
export const profileFormError =
  "mt-1 font-sans text-sm font-medium text-news-primary";

/** My profile — form status messages */
export const profileFormMessageError =
  "font-sans text-sm font-medium text-news-primary";

export const profileFormMessageSuccess =
  "font-sans text-sm font-medium text-green-600";

/** My profile — primary / secondary actions */
export const profileButtonPrimary =
  "bg-news-secondary font-sans font-semibold text-white hover:bg-news-text";

export const profileButtonSecondary =
  "border-news-text bg-transparent font-sans font-semibold text-news-text hover:bg-news-surface";

/** My profile — card title (sign in, error, not found) */
export const profileCardTitle =
  "font-bold font-display text-2xl text-news-text leading-tight tracking-tight";

/** My profile — card / empty body copy */
export const profileCardBody =
  "font-sans text-base text-news-muted leading-relaxed";

/** My profile — sign-in field label */
export const profileSignInLabel =
  "font-sans text-sm font-semibold text-news-text";

/** My profile — BookmarksList saved article title */
export const bookmarksListTitle = `mb-2 line-clamp-2 font-display text-lg font-semibold leading-snug tracking-normal text-news-text ${articleTitleLink}`;

/** My profile — BookmarksList metadata */
export const bookmarksListMeta =
  "mb-1 font-sans text-sm font-medium text-news-muted";

const bookmarksListDate =
  "mb-4 font-sans text-xs font-medium uppercase tracking-wide text-news-muted xl:mb-0";

export const bookmarksListAction =
  "font-sans text-sm font-semibold text-news-primary transition-colors hover:text-news-primary-hover";

export const bookmarksSortLabel =
  "whitespace-nowrap font-sans text-sm font-semibold text-news-text";

export const bookmarksSortSelect =
  "w-auto cursor-pointer appearance-none rounded-lg border border-news-border bg-white px-4 py-2 pr-8 font-sans text-sm font-semibold text-news-text transition-colors hover:border-news-border focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2";

/** My profile — bookmarks section hero count */
export const bookmarksSectionCount = profileDetailsDisplayName;

/** My profile — bookmarks section subtitle */
export const bookmarksSectionSubtitle =
  "font-sans text-sm font-medium text-news-muted";

/** My profile — bookmarks empty state title */
export const bookmarksEmptyTitle =
  "font-semibold font-sans text-lg text-news-text";

/** My profile — bookmarks empty state body */
export const bookmarksEmptyBody = profileCardBody;

/** My profile — newsletter toggles */
export const profileNewsletterTitle =
  "font-sans text-base font-semibold text-news-text leading-snug";

export const profileNewsletterDescription =
  "mt-0.5 font-sans text-sm font-normal text-news-muted leading-relaxed";

export const profileNewsletterNote =
  "font-sans text-sm font-normal text-news-text leading-relaxed";

/** My profile — modal */
export const profileModalTitle =
  "font-bold font-display text-2xl text-news-text leading-tight tracking-tight";

export const profileModalDescription = profileCardBody;

/** My profile — subscriptions */
export const profileSubscriptionEyebrow =
  "mb-4 inline-block rounded-full bg-news-primary/10 px-3 py-1 font-sans text-sm font-semibold uppercase tracking-wide text-news-primary";

export const profileSubscriptionHeroTitle =
  "mb-2 font-bold font-display text-4xl text-news-text leading-tight tracking-tight";

export const profileSubscriptionHeroTitleAccent = "text-news-primary";

export const profileSubscriptionHeroSubtitle = profileCardBody;

export const profileSubscriptionSectionTitle =
  "mb-2 font-bold font-display text-3xl text-news-text leading-tight tracking-tight";

export const profileSubscriptionSectionSubtitle =
  "font-sans text-base text-news-muted leading-relaxed";

export const profileSubscriptionPlanPrice =
  "mb-2 font-bold font-display text-5xl text-news-text leading-tight tracking-tight";

export const profileSubscriptionPriceAmount =
  "font-semibold font-sans text-3xl text-news-text";

export const profileSubscriptionPricePeriod =
  "font-sans text-base text-news-muted";

export const profileSubscriptionMetaLabel =
  "mb-2 font-sans text-sm font-semibold uppercase tracking-wide text-news-muted";

export const profileSubscriptionMetaValue =
  "font-semibold font-sans text-news-text";

export const profileSubscriptionFeatureLabel =
  "mb-6 font-semibold font-sans text-sm uppercase tracking-wide text-news-muted";

export const profileSubscriptionFeatureText =
  "font-sans text-sm font-normal text-news-text";

export const profileSubscriptionStatLabel =
  "mb-1 font-sans text-sm font-medium text-news-muted";

export const profileSubscriptionStatValue =
  "font-bold font-display text-2xl text-news-text capitalize";

export const profileSubscriptionBadge =
  "mb-4 inline-block rounded-full bg-news-primary px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-white";

export const profileSubscriptionFaqTitle =
  "mb-8 font-bold font-display text-2xl text-news-text leading-tight tracking-tight";

export const profileSubscriptionFaqQuestion =
  "mb-2 font-semibold font-sans text-base text-news-text";

export const profileSubscriptionFaqAnswer =
  "font-sans text-sm font-normal text-news-muted leading-relaxed";

export const profileSubscriptionWarning =
  "mb-4 font-sans text-sm font-medium text-orange-600";

export const profileSubscriptionLoading = profileCardBody;

/** My profile — subscription success / alert */
export const profileAlertErrorTitle =
  "mb-2 font-bold font-display text-xl text-news-primary-hover";

export const profileAlertErrorBody =
  "font-sans text-base font-medium text-news-primary-hover";

export const profileSuccessTitle = profileCardTitle;

export const profileSuccessBody =
  "font-sans text-base text-news-text leading-relaxed";

export const profileSuccessMeta =
  "mt-2 font-sans text-sm font-medium text-news-muted";
