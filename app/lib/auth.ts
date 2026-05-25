import type { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN!, // read-only, server-side only
});

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/logineditor",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      // Check against author docs in Sanity
      const author = await sanityClient.fetch<{ cmsRole?: string } | null>(
        `*[
          _type == "author" &&
          defined(email) &&
          lower(email) == $email &&
          canAccessStudio == true &&
          cmsRole in ["admin", "editor", "author"]
        ][0]{ cmsRole }`,
        { email },
      );

      if (!author) {
        return false;
      }

      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const email = session.user.email.toLowerCase();
        const author = await sanityClient.fetch<{ cmsRole?: string } | null>(
          `*[
            _type == "author" &&
            defined(email) &&
            lower(email) == $email &&
            canAccessStudio == true
          ][0]{ cmsRole }`,
          { email },
        );

        (session as any).cmsRole = author?.cmsRole || null;
      }

      return session;
    },
  },
};
