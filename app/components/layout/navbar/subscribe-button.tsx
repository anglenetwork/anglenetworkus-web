import Link from "next/link";

export function SubscribeButton() {
  return (
    <Link
      href="/pricing"
      className="shrink-0 rounded-full bg-blue-600 px-[18px] py-[9px] font-bold font-sans text-[13px] text-white no-underline transition-all duration-150 hover:-translate-y-px hover:bg-blue-700"
    >
      Subscribe
    </Link>
  );
}
