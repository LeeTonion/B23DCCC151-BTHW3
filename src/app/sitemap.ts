import { MetadataRoute } from "next";
import { getDeadlines, getSubjects } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const deadlines = getDeadlines();
  const subjects = getSubjects();

  const deadlineUrls = deadlines.map((d) => ({
    url: `${baseUrl}/deadlines/${d.id}`,
    lastModified: new Date(d.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const subjectUrls = subjects.map((s) => ({
    url: `${baseUrl}/subjects/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    ...deadlineUrls,
    ...subjectUrls,
  ];
}

