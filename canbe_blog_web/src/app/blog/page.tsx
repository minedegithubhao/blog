import { BlogHomePage } from "@/modules/blog/components/blog-home-page";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  return <BlogHomePage />;
}
