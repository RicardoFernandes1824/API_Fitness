/*
  Warnings:

  - Added the required column `userId` to the `trainningSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trainningSession" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "workoutRoutineExercise" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "workoutRoutineId" INTEGER NOT NULL,

    CONSTRAINT "workoutRoutineExercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trainningSession" ADD CONSTRAINT "trainningSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workoutRoutineExercise" ADD CONSTRAINT "workoutRoutineExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workoutRoutineExercise" ADD CONSTRAINT "workoutRoutineExercise_workoutRoutineId_fkey" FOREIGN KEY ("workoutRoutineId") REFERENCES "workoutRoutine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
