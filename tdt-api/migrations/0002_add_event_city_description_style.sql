-- CreateTable
ALTER TABLE "Event" ADD COLUMN "city" TEXT;
ALTER TABLE "Event" ADD COLUMN "description" TEXT;

-- CreateTable
CREATE TABLE "Style" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToStyle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EventToStyle_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToStyle_B_fkey" FOREIGN KEY ("B") REFERENCES "Style" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Style_name_key" ON "Style"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToStyle_AB_unique" ON "_EventToStyle"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToStyle_B_index" ON "_EventToStyle"("B");
