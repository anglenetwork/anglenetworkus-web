import Link from "next/link";

export function SubscribeButton() {
  return (
    <Link
      href="/pricing"
      className="shrink-0 rounded-full bg-news-primary px-[18px] py-[9px] font-bold font-sans text-[13px] text-white no-underline transition-all duration-150 hover:-translate-y-px hover:bg-news-primary-hover"
    >
      Subscribe
    </Link>
  );
}
