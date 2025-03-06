/*
  Warnings:

  - Added the required column `date_range` to the `ScheduledReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_address` to the `ScheduledReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `ScheduledReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ScheduledReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduledReport" ADD COLUMN     "date_range" TEXT NOT NULL,
ADD COLUMN     "email_address" TEXT NOT NULL,
ADD COLUMN     "frequency" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
