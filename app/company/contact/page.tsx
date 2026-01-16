import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { privacyPolicyConfig } from "@/lib/privacy-policy-setup/privacy-policy-config";

export default function ContactPage() {
  const contactEmail = privacyPolicyConfig.company.email.general;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-16 font-sans">
      <Card className="w-full max-w-md text-center font-sans">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold text-balance font-sans">Get in Touch</CardTitle>
          <CardDescription className="text-base text-pretty font-sans">
            We&apos;d love to hear from you. Whether you have a story tip, feedback, or just want to say hello — our team is
            here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 font-sans">
          <p className="text-muted-foreground text-sm font-sans">Reach out to us anytime at:</p>
          <Button variant="outline" className="gap-2 bg-transparent font-sans" asChild>
            <a href={`mailto:${contactEmail}`}>
              <Mail className="h-4 w-4" />
              {contactEmail}
            </a>
          </Button>
          <p className="text-xs text-muted-foreground pt-4 font-sans">We typically respond within 24-48 hours.</p>
        </CardContent>
      </Card>
    </main>
  );
}
