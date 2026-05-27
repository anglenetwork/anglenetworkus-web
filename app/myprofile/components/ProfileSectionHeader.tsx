import { cn } from "@/lib/utils";
import {
  profileSectionDescription,
  profileSectionHeader,
  profileSectionTitle,
} from "@/app/lib/typography/myprofile-page";

interface ProfileSectionHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function ProfileSectionHeader({
  title,
  description,
  className,
}: ProfileSectionHeaderProps) {
  return (
    <div className={cn(profileSectionHeader, className)}>
      <h1 className={profileSectionTitle}>{title}</h1>
      <p className={profileSectionDescription}>{description}</p>
    </div>
  );
}
