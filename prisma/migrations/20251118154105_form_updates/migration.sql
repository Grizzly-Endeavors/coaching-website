/*
  Warnings:

  - You are about to drop the `email_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "replay_submissions" ADD COLUMN     "discord_access_token" TEXT,
ADD COLUMN     "discord_id" TEXT,
ADD COLUMN     "discord_refresh_token" TEXT,
ADD COLUMN     "discord_token_expiry" TIMESTAMP(3),
ADD COLUMN     "discord_username" TEXT,
ALTER COLUMN "coaching_type" DROP DEFAULT;

-- DropTable
DROP TABLE "email_logs";

-- DropEnum
DROP TYPE "EmailStatus";

-- DropEnum
DROP TYPE "EmailType";
