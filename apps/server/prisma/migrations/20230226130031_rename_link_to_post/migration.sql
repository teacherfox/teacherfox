-- AlterTable
ALTER TABLE "Post" RENAME CONSTRAINT "Link_pkey" TO "Post_pkey";

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "postId" SET DEFAULT 1;
