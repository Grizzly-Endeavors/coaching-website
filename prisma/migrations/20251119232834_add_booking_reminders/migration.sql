-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "reminder_sent_24h" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminder_sent_30m" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminder_24h_sent_at" TIMESTAMP(3),
ADD COLUMN     "reminder_30m_sent_at" TIMESTAMP(3);
