/*
  Warnings:

  - A unique constraint covering the columns `[form_id]` on the table `PromptFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "FigCollection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prompt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "fig_collection_file_id" TEXT,

    CONSTRAINT "FigCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FigCollectionFile" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "extracted_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fig_collection_id" TEXT,

    CONSTRAINT "FigCollectionFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APIKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FigCollection_fig_collection_file_id_key" ON "FigCollection"("fig_collection_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "FigCollectionFile_fig_collection_id_key" ON "FigCollectionFile"("fig_collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "APIKey_key_key" ON "APIKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PromptFile_form_id_key" ON "PromptFile"("form_id");

-- AddForeignKey
ALTER TABLE "FigCollection" ADD CONSTRAINT "FigCollection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FigCollectionFile" ADD CONSTRAINT "FigCollectionFile_fig_collection_id_fkey" FOREIGN KEY ("fig_collection_id") REFERENCES "FigCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "APIKey" ADD CONSTRAINT "APIKey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
