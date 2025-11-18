-- CreateEnum for new SubmissionStatus values
-- AlterEnum: Add new values to existing SubmissionStatus enum
ALTER TYPE "SubmissionStatus" ADD VALUE 'AWAITING_PAYMENT';
ALTER TYPE "SubmissionStatus" ADD VALUE 'PAYMENT_RECEIVED';
ALTER TYPE "SubmissionStatus" ADD VALUE 'PAYMENT_FAILED';
 
-- AlterEnum: Update BookingStatus enum
-- First, rename SCHEDULED to PENDING
-- Note: This might require data migration in production
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BookingStatus') THEN
    -- Add new values
    ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'PENDING';
    ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'CONFIRMED';
  END IF;
END
$$;
 
-- CreateTable: AvailabilitySlot
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slot_duration" INTEGER NOT NULL DEFAULT 60,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "session_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
 
    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);
 
-- CreateTable: AvailabilityException
CREATE TABLE "availability_exceptions" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slot_id" TEXT,
    "booking_id" TEXT,
 
    CONSTRAINT "availability_exceptions_pkey" PRIMARY KEY ("id")
);
 
-- CreateIndex
CREATE UNIQUE INDEX "availability_exceptions_booking_id_key" ON "availability_exceptions"("booking_id");
 
-- AlterTable: Booking
-- Remove google_event_id column
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "google_event_id";
 
-- Add submission_id column
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "submission_id" TEXT;
 
-- CreateIndex for submission_id
CREATE UNIQUE INDEX "bookings_submission_id_key" ON "bookings"("submission_id");
 
-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_submission_id_fkey"
    FOREIGN KEY ("submission_id") REFERENCES "replay_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 
-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_slot_id_fkey"
    FOREIGN KEY ("slot_id") REFERENCES "availability_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 
-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_booking_id_fkey"
    FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 