-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(200) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);
