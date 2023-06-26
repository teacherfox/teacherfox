/*
  Warnings:

  - You are about to drop the column `linkId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `linkId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[postId,userId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_linkId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_postedById_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_linkId_fkey";

-- DropIndex
DROP INDEX "Vote_linkId_userId_key";

-- AlterTable
ALTER TABLE "Comment" rename COLUMN "linkId" to "postId";

-- AlterTable
ALTER TABLE "Vote" rename COLUMN "linkId" to "postId";

-- DropTable
Alter TABLE "Link" rename to "Post";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_postId_userId_key" ON "Vote"("postId", "userId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
