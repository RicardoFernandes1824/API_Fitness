/*
  Warnings:

  - You are about to drop the column `ex1` on the `workoutRoutine` table. All the data in the column will be lost.
  - You are about to drop the column `ex2` on the `workoutRoutine` table. All the data in the column will be lost.
  - You are about to drop the column `ex3` on the `workoutRoutine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workoutRoutine" DROP COLUMN "ex1",
DROP COLUMN "ex2",
DROP COLUMN "ex3";
