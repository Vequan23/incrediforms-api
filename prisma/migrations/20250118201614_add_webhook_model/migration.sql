-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT DEFAULT 'POST',
    "api_key" TEXT,
    "api_key_header" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_form_id_key" ON "Webhook"("form_id");

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
