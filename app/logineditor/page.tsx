import type { Metadata } from "next";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import LoginPageClient from "./login-editor-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Studio Sign In",
    "Sign in to access the Sanity content management studio.",
    "/logineditor",
    { private: true },
  );
}

export default function LoginPage() {
  return <LoginPageClient />;
}
