-- CreateTable
CREATE TABLE "payable" (
    "id" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "emissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignor" TEXT NOT NULL,
    CONSTRAINT "payable_assignor_fkey" FOREIGN KEY ("assignor") REFERENCES "assignor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assignor" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "payable_id_key" ON "payable"("id");

-- CreateIndex
CREATE UNIQUE INDEX "assignor_id_key" ON "assignor"("id");
