-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_form_id_fkey";

-- DropForeignKey
ALTER TABLE "FieldOption" DROP CONSTRAINT "FieldOption_field_id_fkey";

-- DropForeignKey
ALTER TABLE "PublishedForm" DROP CONSTRAINT "PublishedForm_form_id_fkey";

-- AlterTable
ALTER TABLE "Field" ALTER COLUMN "order" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldOption" ADD CONSTRAINT "FieldOption_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedForm" ADD CONSTRAINT "PublishedForm_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
