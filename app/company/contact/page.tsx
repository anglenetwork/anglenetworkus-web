import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { privacyPolicyConfig } from "@/lib/privacy-policy-setup/privacy-policy-config";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Contact Us",
    "Get in touch with The Angle editorial and support teams.",
    "/company/contact",
  );
}

export default function ContactPage() {
  const contactEmail = privacyPolicyConfig.company.email.general;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 font-sans">
      <Card className="w-full max-w-md text-center font-sans">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary">
            <Mail className="size-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-balance font-sans font-semibold text-2xl">
            Get in Touch
          </CardTitle>
          <CardDescription className="text-pretty font-sans text-base">
            We&apos;d love to hear from you. Whether you have a story tip,
            feedback, or just want to say hello. Our team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 font-sans">
          <p className="font-sans text-muted-foreground text-sm">
            Reach out to us anytime at:
          </p>
          <Button
            variant="outline"
            className="gap-2 bg-transparent font-sans"
            asChild
          >
            <a href={`mailto:${contactEmail}`}>
              <Mail className="size-4" />
              {contactEmail}
            </a>
          </Button>
          <p className="pt-4 font-sans text-muted-foreground text-xs">
            We typically respond within 24-48 hours.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
