import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { allBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://rekit.tools";

  const staticPages = [
    "",
    "/tools",
    "/blog",
    "/about",
    "/faq",
    "/help",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
    "/disclaimer",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-10-23"),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : 0.7,
  }));

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}/${tool.slug}`,
    lastModified: new Date("2026-10-23"),
    changeFrequency: "weekly",
    priority: tool.popular ? 0.9 : 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = allBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...toolEntries, ...blogEntries];
}
