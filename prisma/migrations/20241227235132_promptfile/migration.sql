-- CreateTable
CREATE TABLE "PromptFile" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extracted_text" TEXT NOT NULL,

    CONSTRAINT "PromptFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromptFile" ADD CONSTRAINT "PromptFile_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
