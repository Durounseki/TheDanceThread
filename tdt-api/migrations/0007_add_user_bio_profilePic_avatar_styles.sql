-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
ALTER TABLE "User" ADD COLUMN "bio" TEXT;
ALTER TABLE "User" ADD COLUMN "createdAt" DATETIME;

-- CreateTable
CREATE TABLE "ProfilePic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    CONSTRAINT "ProfilePic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_StyleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_StyleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Style" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StyleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePic_userId_key" ON "ProfilePic"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_StyleToUser_AB_unique" ON "_StyleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StyleToUser_B_index" ON "_StyleToUser"("B");
