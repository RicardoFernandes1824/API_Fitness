const prisma = require('../utils/prisma')


const createWorkoutRoutine = async (req, res) => {
    const {name, video, workoutRoutineExercise, workoutRoutineTemplate, user} = req.body;
    try {
        const newWorkoutRoutine = await prisma.workoutRoutine.create({
            data: {
                name,
                video,
                workoutRoutineExercise: {
                    create: (workoutRoutineExercise).map((exercise) => ({
                        exercise: {
                            connect: {id: exercise.id}
                        }
                    }))
                },
                workoutRoutineTemplate: {
                    create: (workoutRoutineTemplate).map((template) => ({
                        reps: template.reps,
                        sets: template.sets,
                        exercise: {
                            connect: {id: template.exerciseId}
                        }
                    }))
                },
                userId: user
            }
        });
        return res.status(201).json(newWorkoutRoutine);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error.message || "An error occurred while creating the workout routine."
        });
    }
}

const getWorkoutRoutineById = async (req, res) => {
    try {
        const workoutRoutine = await prisma.workoutRoutine.findUnique({
            where: {
                id: +req.params.id
            },
            select: {
                id: true,
                name: true,
                workoutRoutineExercise: true,
                workoutRoutineTemplate: true,
            }
        })
        return res.status(200).json(workoutRoutine);
    } catch (error) {
        return res.status(400).json({
            error: error,
        })
    }
}

const updateWorkoutRoutineById = async (req, res) => {
    try {
        const workoutRoutine = await prisma.workoutRoutine.update({
            where: {
                id: +req.params.id
            },
            data: {
                name: req.body.name,
                ex1: req.body.ex1,
                ex2: req.body.ex2,
                ex3: req.body.ex3,
                video: req.body.video
            }
        })
        res.status(200).json(workoutRoutine);
    } catch (error) {
        return res.status(400).json({
            error: error,
        })
    }
}

module.exports = {
    createWorkoutRoutine,
    getWorkoutRoutineById,
    updateWorkoutRoutineById,
}