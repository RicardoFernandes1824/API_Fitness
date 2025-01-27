-- CreateTable
CREATE TABLE "workoutRoutineTemplate" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "workoutRoutineId" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,

    CONSTRAINT "workoutRoutineTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workoutRoutineTemplate" ADD CONSTRAINT "workoutRoutineTemplate_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workoutRoutineTemplate" ADD CONSTRAINT "workoutRoutineTemplate_workoutRoutineId_fkey" FOREIGN KEY ("workoutRoutineId") REFERENCES "workoutRoutine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
