-- CreateIndex
CREATE INDEX "availability_exceptions_date_idx" ON "availability_exceptions"("date");

-- CreateIndex
CREATE INDEX "availability_exceptions_slot_id_idx" ON "availability_exceptions"("slot_id");

-- CreateIndex
CREATE INDEX "availability_slots_dayOfWeek_idx" ON "availability_slots"("dayOfWeek");

-- CreateIndex
CREATE INDEX "blog_posts_published_idx" ON "blog_posts"("published");

-- CreateIndex
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts"("published_at");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_scheduled_at_idx" ON "bookings"("scheduled_at");

-- CreateIndex
CREATE INDEX "bookings_email_idx" ON "bookings"("email");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_customer_email_idx" ON "payments"("customer_email");

-- CreateIndex
CREATE INDEX "replay_codes_submission_id_idx" ON "replay_codes"("submission_id");

-- CreateIndex
CREATE INDEX "replay_submissions_status_idx" ON "replay_submissions"("status");

-- CreateIndex
CREATE INDEX "replay_submissions_email_idx" ON "replay_submissions"("email");

-- CreateIndex
CREATE INDEX "replay_submissions_discord_id_idx" ON "replay_submissions"("discord_id");

-- CreateIndex
CREATE INDEX "replay_submissions_submitted_at_idx" ON "replay_submissions"("submitted_at");
