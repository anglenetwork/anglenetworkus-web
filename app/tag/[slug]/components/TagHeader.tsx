import { SectionHeader } from "@/app/components/ui/section-header";

interface TagHeaderProps {
  title: string;
}

export function TagHeader({ title }: TagHeaderProps) {
  return (
    <div className="mb-6">
      <SectionHeader title={title} variant="gradient" />
    </div>
  );
}

