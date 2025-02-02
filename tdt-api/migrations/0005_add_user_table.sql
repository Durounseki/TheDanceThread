-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT
);

-- CreateTable
CREATE TABLE "EventAttendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'GOING',
    CONSTRAINT "EventAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventAttendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_userId_eventId_type_key" ON "EventAttendance"("userId", "eventId", "type");

-- Save old data to temporary tables before dropping the tables

-- Create temporary Event table with new structure
CREATE TABLE "_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT,
    CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Copy data from old Event table to temporary table
INSERT INTO "_Event" ("id", "name", "date", "country", "city", "description", "createdAt")
SELECT "id", "name", "date", "country", "city", "description", "createdAt"
FROM "Event";

-- Create temporary SocialMedia table with new structure
CREATE TABLE "_SocialMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "faClass" TEXT NOT NULL,
    "userId" TEXT
);

-- Copy data from old SocialMedia table to temporary table
INSERT INTO "_SocialMedia" ("id", "eventId", "name", "url", "faClass")
SELECT "id", "eventId", "name", "url", "faClass"
FROM "SocialMedia";

-- Create temporary Flyer table with new structure
CREATE TABLE "_Flyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "src" TEXT NOT NULL
);

-- Copy data from old Flyer table to temporary table
INSERT INTO "_Flyer" ("id", "eventId", "alt", "src")
SELECT "id", "eventId", "alt", "src"
FROM "Flyer";

-- CreateTable temporary _EventToStyle table
CREATE TABLE "_EventToStyle_new" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
-- Copy data from old _EventToStyle table to temporary table
INSERT INTO "_EventToStyle_new" ("A", "B")
SELECT "A", "B"
FROM "_EventToStyle";

-- CreateTable temporary _EventToVenue table
CREATE TABLE "_EventToVenue_new" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
-- Copy data from old _EventToVenue table to temporary table
INSERT INTO "_EventToVenue_new" ("A", "B")
SELECT "A", "B"
FROM "_EventToVenue";

-- Drop old tables
DROP TABLE "Event";
DROP TABLE "SocialMedia";
DROP TABLE "Flyer";
DROP TABLE "_EventToStyle";
DROP TABLE "_EventToVenue";

-- Create new Event table with foreign keys
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT,
    CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create new SocialMedia table with foreign keys
CREATE TABLE "SocialMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "faClass" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "SocialMedia_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SocialMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create new Flyer table with foreign keys
CREATE TABLE "Flyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    CONSTRAINT "Flyer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventToStyle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EventToStyle_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToStyle_B_fkey" FOREIGN KEY ("B") REFERENCES "Style" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventToVenue" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EventToVenue_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToVenue_B_fkey" FOREIGN KEY ("B") REFERENCES "Venue" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy data from temporary tables to new tables, filling in foreign keys
INSERT INTO "Event" ("id", "name", "date", "country", "city", "description", "createdAt", "creatorId")
SELECT "id", "name", "date", "country", "city", "description", "createdAt", "creatorId"
FROM "_Event";

INSERT INTO "SocialMedia" ("id", "eventId", "name", "url", "faClass", "userId")
SELECT "id", "eventId", "name", "url", "faClass", "userId"
FROM "_SocialMedia";

INSERT INTO "Flyer" ("id", "eventId", "alt", "src")
SELECT "id", "eventId", "alt", "src"
FROM "_Flyer";

INSERT INTO "_EventToStyle" ("A", "B")
SELECT "A", "B"
FROM "_EventToStyle_new";

INSERT INTO "_EventToVenue" ("A", "B")
SELECT "A", "B"
FROM "_EventToVenue_new";


-- Drop temporary tables
DROP TABLE "_Event";
DROP TABLE "_SocialMedia";
DROP TABLE "_Flyer";
DROP TABLE "_EventToStyle_new";
DROP TABLE "_EventToVenue_new";

-- Recreate indexes if needed
CREATE UNIQUE INDEX "Flyer_eventId_key" ON "Flyer"("eventId");

CREATE UNIQUE INDEX "_EventToStyle_AB_unique" ON "_EventToStyle"("A", "B");

CREATE INDEX "_EventToStyle_B_index" ON "_EventToStyle"("B");

CREATE UNIQUE INDEX "_EventToVenue_AB_unique" ON "_EventToVenue"("A", "B");

CREATE INDEX "_EventToVenue_B_index" ON "_EventToVenue"("B");
