/**
 * Whether a carousel slide should be mounted (current + previous + next with wrap-around).
 */
export function shouldRenderCarouselSlide(
  index: number,
  currentIndex: number,
  total: number,
): boolean {
  if (total <= 0) return false;
  if (total === 1) return index === 0;
  if (index === currentIndex) return true;

  const prev = (currentIndex - 1 + total) % total;
  const next = (currentIndex + 1) % total;
  return index === prev || index === next;
}

/**
 * True only for the first visible slide on initial load (index 0 when current is 0).
 */
export function isCarouselLcpCandidate(
  index: number,
  currentIndex: number,
): boolean {
  return index === currentIndex && currentIndex === 0;
}
