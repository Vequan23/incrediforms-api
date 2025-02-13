-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_form_id_fkey";

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
