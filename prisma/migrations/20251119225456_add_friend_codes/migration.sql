-- CreateTable
CREATE TABLE "friend_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "max_uses" INTEGER,
    "uses_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friend_codes_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "replay_submissions" ADD COLUMN "friend_code_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "friend_codes_code_key" ON "friend_codes"("code");

-- AddForeignKey
ALTER TABLE "replay_submissions" ADD CONSTRAINT "replay_submissions_friend_code_id_fkey" FOREIGN KEY ("friend_code_id") REFERENCES "friend_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
