/*
  Warnings:

  - Added the required column `title` to the `PromptFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptFile" ADD COLUMN     "title" TEXT NOT NULL;
