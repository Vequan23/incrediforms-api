/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `StripeUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StripeUser_user_id_key" ON "StripeUser"("user_id");
