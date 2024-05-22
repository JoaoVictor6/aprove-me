/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `assignor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "assignor_document_key" ON "assignor"("document");
