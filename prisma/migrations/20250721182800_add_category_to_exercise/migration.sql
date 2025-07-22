-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('Chest', 'Back', 'Arms', 'Legs', 'Shoulder');

-- AlterTable
ALTER TABLE "exercise" ADD COLUMN     "category" "ExerciseCategory" NOT NULL DEFAULT 'Chest';
