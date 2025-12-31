/*
  Warnings:

  - The values [SCHEDULED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- Update existing bookings from SCHEDULED to PENDING
UPDATE "bookings" SET "status" = 'PENDING' WHERE "status" = 'SCHEDULED';

-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- Update existing replay_submissions from PENDING to AWAITING_PAYMENT
UPDATE "replay_submissions" SET "status" = 'AWAITING_PAYMENT' WHERE "status" = 'PENDING';

-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('AWAITING_PAYMENT', 'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');
ALTER TABLE "replay_submissions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "replay_submissions" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
ALTER TABLE "replay_submissions" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';
COMMIT;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "replay_submissions" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "stripe_payment_id" TEXT,
    "stripe_session_id" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "coaching_type" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "submission_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_payment_id_key" ON "payments"("stripe_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_session_id_key" ON "payments"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_submission_id_key" ON "payments"("submission_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "replay_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
