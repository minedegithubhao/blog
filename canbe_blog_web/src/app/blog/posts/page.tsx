import { BlogPostsPage as BlogPostsPageView } from "@/modules/blog/components/blog-posts-page";

export const dynamic = "force-dynamic";

export default async function BlogPostsPage() {
  return <BlogPostsPageView />;
}
