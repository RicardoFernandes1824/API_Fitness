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

const getWorkoutRoutineByUser = async (req, res) => {
    const {userId} = req.params;

    try {
        const workoutRoutines = await prisma.workoutRoutine.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                workoutRoutineExercise: {
                    include: {
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                description: true  // Add if needed
                            }
                        }
                    }
                },
                workoutRoutineTemplate: {
                    select: {
                        reps: true,
                        sets: true,
                        exercise: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json(workoutRoutines);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to fetch workout routines"});
    }
};


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

const getWorkoutRoutineTemplateByExerciseId = async (req, res) => {
    try {
        const {exerciseId} = req.params;

        if (!exerciseId) {
            return res.status(400).json({error: "exerciseId is required"});
        }

        const routines = await prisma.workoutRoutineTemplate.findMany({
            where: {exerciseId: parseInt(exerciseId)},
            select: {
                id: true,
                reps: true,
                sets: true,
                exercise: {
                    select: {
                        id: true,
                        name: true,
                        video: true
                    }
                }
            }
        });

        if (routines.length === 0) {
            return res.status(404).json({message: "No workout routine found for this exercise"});
        }

        res.json(routines);
    } catch (error) {
        console.error("Error fetching workout routine template:", error);
        res.status(500).json({error: "Internal server error"});
    }
};

module.exports = {
    createWorkoutRoutine,
    getWorkoutRoutineByUser,
    getWorkoutRoutineById,
    updateWorkoutRoutineById,
    getWorkoutRoutineTemplateByExerciseId
}