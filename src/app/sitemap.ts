import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const users = await prisma.user.findMany({
    select: {
      username: true,
    },
  });

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/notifications`,
      lastModified: new Date(),
    },
  ];

  const userUrls = users.map((user) => ({
    url: `${baseUrl}/${user.username}`,
    lastModified: new Date(),
  }));

  return [...staticUrls, ...userUrls];
}
