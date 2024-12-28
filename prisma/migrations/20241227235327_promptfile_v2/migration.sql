/*
  Warnings:

  - Added the required column `base64_content` to the `PromptFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `PromptFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptFile" ADD COLUMN     "base64_content" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
