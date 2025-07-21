/*
  Warnings:

  - Added the required column `exerciseId` to the `trainningSessionSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trainningSessionSet" ADD COLUMN     "exerciseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "trainningSessionSet" ADD CONSTRAINT "trainningSessionSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
