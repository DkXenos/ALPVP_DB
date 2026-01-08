-- CreateTable
CREATE TABLE "post_votes" (
    "post_id" INTEGER NOT NULL,
    "vote_id" INTEGER NOT NULL,

    CONSTRAINT "post_votes_pkey" PRIMARY KEY ("post_id","vote_id")
);

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
