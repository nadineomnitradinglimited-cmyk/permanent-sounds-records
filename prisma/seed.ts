import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@permanentsoundsrecords.com";
  const adminPassword = "changeme123";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Studio Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  const beats = [
    {
      slug: "midnight-drive",
      title: "Midnight Drive",
      bpm: 140,
      key: "F# Minor",
      genre: "Trap",
      tags: "dark,melodic,trap",
      coverArtUrl: "/uploads/beats/placeholder-cover.svg",
      previewAudioUrl: "/uploads/beats/placeholder-preview.mp3",
      featured: true,
    },
    {
      slug: "golden-hour",
      title: "Golden Hour",
      bpm: 92,
      key: "C Major",
      genre: "R&B",
      tags: "smooth,rnb,chill",
      coverArtUrl: "/uploads/beats/placeholder-cover.svg",
      previewAudioUrl: "/uploads/beats/placeholder-preview.mp3",
      featured: true,
    },
    {
      slug: "concrete-jungle",
      title: "Concrete Jungle",
      bpm: 150,
      key: "A Minor",
      genre: "Drill",
      tags: "drill,hard,uk",
      coverArtUrl: "/uploads/beats/placeholder-cover.svg",
      previewAudioUrl: "/uploads/beats/placeholder-preview.mp3",
      featured: false,
    },
  ];

  for (const beat of beats) {
    await prisma.beat.upsert({
      where: { slug: beat.slug },
      update: {},
      create: {
        ...beat,
        licenseOptions: {
          create: [
            {
              name: "MP3 Lease",
              priceCents: 2999,
              fileFormat: "MP3",
              deliverables: "Tagged MP3",
              usageTerms: "Up to 10,000 streams, non-exclusive.",
              distributionLimit: 10000,
              sortOrder: 0,
              filePath: "licenses/placeholder-deliverable.txt",
            },
            {
              name: "WAV Lease",
              priceCents: 4999,
              fileFormat: "WAV + MP3",
              deliverables: "Untagged WAV + MP3",
              usageTerms: "Up to 100,000 streams, non-exclusive.",
              distributionLimit: 100000,
              sortOrder: 1,
              filePath: "licenses/placeholder-deliverable.txt",
            },
            {
              name: "Trackout Lease",
              priceCents: 9999,
              fileFormat: "WAV + Trackouts",
              deliverables: "Untagged WAV, MP3, and stem trackouts",
              usageTerms: "Unlimited streams, non-exclusive.",
              distributionLimit: null,
              sortOrder: 2,
              filePath: "licenses/placeholder-deliverable.txt",
            },
            {
              name: "Exclusive Rights",
              priceCents: 39999,
              fileFormat: "WAV + Trackouts",
              deliverables: "Untagged WAV, MP3, stem trackouts, full ownership transfer",
              usageTerms: "Unlimited use. Beat is removed from the store after purchase.",
              distributionLimit: null,
              isExclusive: true,
              sortOrder: 3,
              filePath: "licenses/placeholder-deliverable.txt",
            },
          ],
        },
      },
    });
  }

  const services = [
    {
      name: "Recording Session",
      description: "Full engineer-assisted recording session.",
      durationMinutes: 60,
      priceCents: 5000,
      depositCents: 1500,
    },
    {
      name: "Mixing Session",
      description: "Professional mix of your recorded track.",
      durationMinutes: 90,
      priceCents: 8000,
      depositCents: 2000,
    },
    {
      name: "Mastering Session",
      description: "Final polish and loudness mastering.",
      durationMinutes: 45,
      priceCents: 4000,
      depositCents: 1000,
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name },
    });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }

  const weekdayHours = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
    dayOfWeek,
    startTime: "10:00",
    endTime: "18:00",
  }));

  for (const hours of weekdayHours) {
    const existing = await prisma.availability.findFirst({
      where: { dayOfWeek: hours.dayOfWeek },
    });
    if (!existing) {
      await prisma.availability.create({ data: hours });
    }
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
