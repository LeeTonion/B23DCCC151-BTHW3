// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/deadlines", "/deadlines/", "/subjects/"],
        disallow: ["/dashboard", "/admin", "/login", "/api/", "/403"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

