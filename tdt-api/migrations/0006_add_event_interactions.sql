-- CreateTable
CREATE TABLE "EventLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "EventLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventLike_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventSave" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "EventSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventSave_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "totalLikes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Event" ADD COLUMN "totalAttendees" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Event" ADD COLUMN "totalSaves" INTEGER NOT NULL DEFAULT 0;


-- CreateIndex
CREATE UNIQUE INDEX "EventLike_userId_eventId_key" ON "EventLike"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventSave_userId_eventId_key" ON "EventSave"("userId", "eventId");
