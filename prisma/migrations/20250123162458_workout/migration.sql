/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `workoutRoutine` table. All the data in the column will be lost.
  - You are about to drop the `workoutRoutineExercise` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `ex1` on the `workoutRoutine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ex2` on the `workoutRoutine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ex3` on the `workoutRoutine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "workoutRoutineExercise" DROP CONSTRAINT "workoutRoutineExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "workoutRoutineExercise" DROP CONSTRAINT "workoutRoutineExercise_routineId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "height" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "workoutRoutine" DROP COLUMN "exerciseId",
DROP COLUMN "ex1",
ADD COLUMN     "ex1" INTEGER NOT NULL,
DROP COLUMN "ex2",
ADD COLUMN     "ex2" INTEGER NOT NULL,
DROP COLUMN "ex3",
ADD COLUMN     "ex3" INTEGER NOT NULL;

-- DropTable
DROP TABLE "workoutRoutineExercise";
