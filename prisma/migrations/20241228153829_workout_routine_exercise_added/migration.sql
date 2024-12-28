/*
  Warnings:

  - You are about to drop the column `sessionId` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `sessionSetId` on the `exercise` table. All the data in the column will be lost.
  - Added the required column `exerciseId` to the `workoutRoutine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_sessionSetId_fkey";

-- AlterTable
ALTER TABLE "exercise" DROP COLUMN "sessionId",
DROP COLUMN "sessionSetId";

-- AlterTable
ALTER TABLE "workoutRoutine" ADD COLUMN     "exerciseId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "workoutRoutineExercise" (
    "id" SERIAL NOT NULL,
    "routineId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "workoutRoutineExercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workoutRoutineExercise" ADD CONSTRAINT "workoutRoutineExercise_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "workoutRoutine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workoutRoutineExercise" ADD CONSTRAINT "workoutRoutineExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
