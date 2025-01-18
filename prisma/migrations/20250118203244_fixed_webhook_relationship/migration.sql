/*
  Warnings:

  - A unique constraint covering the columns `[webhook_id]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_form_id_fkey";

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "webhook_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Form_webhook_id_key" ON "Form"("webhook_id");

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
