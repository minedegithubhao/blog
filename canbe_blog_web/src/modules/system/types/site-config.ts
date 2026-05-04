export type SiteConfig = {
  id: number;
  siteName: string;
  logoUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  profileAvatarUrl: string;
  githubUrl: string;
  twitterUrl: string;
  contactUrl: string;
  totalViews: number;
  projectCount: number;
  footerYear: string;
  footerText: string;
  gmtCreate: string | null;
  gmtModified: string | null;
};

export type SiteConfigPayload = Omit<SiteConfig, "id" | "gmtCreate" | "gmtModified">;
