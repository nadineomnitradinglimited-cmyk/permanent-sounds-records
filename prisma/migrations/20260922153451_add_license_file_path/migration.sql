-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LicenseOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "beatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "fileFormat" TEXT NOT NULL,
    "deliverables" TEXT NOT NULL,
    "usageTerms" TEXT NOT NULL,
    "distributionLimit" INTEGER,
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "filePath" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "LicenseOption_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "Beat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LicenseOption" ("beatId", "deliverables", "distributionLimit", "fileFormat", "id", "isExclusive", "name", "priceCents", "sortOrder", "usageTerms") SELECT "beatId", "deliverables", "distributionLimit", "fileFormat", "id", "isExclusive", "name", "priceCents", "sortOrder", "usageTerms" FROM "LicenseOption";
DROP TABLE "LicenseOption";
ALTER TABLE "new_LicenseOption" RENAME TO "LicenseOption";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
