-- CreateTable
CREATE TABLE "workoutRoutine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ex1" TEXT NOT NULL,
    "ex2" TEXT NOT NULL,
    "ex3" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "workoutRoutine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainningSession" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),

    CONSTRAINT "trainningSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainningSessionSet" (
    "id" SERIAL NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,

    CONSTRAINT "trainningSessionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "video" TEXT,
    "description" TEXT,
    "tips" TEXT,
    "sessionId" INTEGER NOT NULL,
    "sessionSetId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workoutRoutine" ADD CONSTRAINT "workoutRoutine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainningSession" ADD CONSTRAINT "trainningSession_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workoutRoutine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainningSessionSet" ADD CONSTRAINT "trainningSessionSet_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "trainningSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "trainningSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_sessionSetId_fkey" FOREIGN KEY ("sessionSetId") REFERENCES "trainningSessionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
