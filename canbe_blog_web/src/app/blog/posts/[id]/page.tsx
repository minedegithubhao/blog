import { BlogPostDetailPage as BlogPostDetailPageView } from "@/modules/blog/components/blog-post-detail-page";

export const dynamic = "force-dynamic";

export default async function BlogPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogPostDetailPageView id={Number(id)} />;
}
