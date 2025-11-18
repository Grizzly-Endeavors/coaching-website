/*
  Warnings:

  - You are about to drop the column `notes` on the `replay_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `replay_code` on the `replay_submissions` table. All the data in the column will be lost.
  - Added the required column `coaching_type` to the `replay_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "replay_submissions" DROP COLUMN "notes",
DROP COLUMN "replay_code",
ADD COLUMN     "coaching_type" TEXT NOT NULL DEFAULT 'vod-review';

-- CreateTable
CREATE TABLE "replay_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "map_name" TEXT NOT NULL,
    "notes" TEXT,
    "submission_id" TEXT NOT NULL,

    CONSTRAINT "replay_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "replay_codes" ADD CONSTRAINT "replay_codes_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "replay_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
