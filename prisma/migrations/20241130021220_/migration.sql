/*
  Warnings:

  - You are about to drop the column `user_id` on the `Submission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_user_id_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "user_id";
