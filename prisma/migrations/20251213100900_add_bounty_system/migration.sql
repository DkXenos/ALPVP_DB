-- CreateTable
CREATE TABLE "bounties" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "reward" VARCHAR(100) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "requirements" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bounties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bounty_applications" (
    "id" SERIAL NOT NULL,
    "bounty_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cover_letter" TEXT NOT NULL,
    "cv_url" VARCHAR(500),
    "why_hire_you" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bounty_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" SERIAL NOT NULL,
    "bounty_application_id" INTEGER NOT NULL,
    "portfolio_url" VARCHAR(500) NOT NULL,
    "portfolio_number" SMALLINT NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bounty_applications_bounty_id_user_id_key" ON "bounty_applications"("bounty_id", "user_id");

-- AddForeignKey
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bounty_applications" ADD CONSTRAINT "bounty_applications_bounty_id_fkey" FOREIGN KEY ("bounty_id") REFERENCES "bounties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bounty_applications" ADD CONSTRAINT "bounty_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_bounty_application_id_fkey" FOREIGN KEY ("bounty_application_id") REFERENCES "bounty_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
