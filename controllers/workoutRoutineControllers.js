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
                        reps: Number(template.reps),
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
                userId: parseInt(userId),
                deleted: false
            },
            include: {
                workoutRoutineExercise: {
                    include: {
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                description: true, 
                                imageURL: true 
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
                workoutRoutineExercise: {
                    select: {
                        id: true,
                        exerciseId: true,
                        workoutRoutineId: true,
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                imageURL: true 
                            }
                        }
                    }
                },
                workoutRoutineTemplate: {
                    select: {
                        exerciseId: true,
                        workoutRoutineId: true,
                        sets: true
                    }
                }
            }
        });

        // Sum sets from all matching workoutRoutineTemplate entries
        if (workoutRoutine) {
            workoutRoutine.workoutRoutineExercise = workoutRoutine.workoutRoutineExercise.map(ex => {
                const templates = workoutRoutine.workoutRoutineTemplate.filter(
                    t => Number(t.exerciseId) === Number(ex.exerciseId) &&
                         Number(t.workoutRoutineId) === Number(ex.workoutRoutineId)
                );
                const sets = templates.reduce((sum, t) => sum + (t.sets || 0), 0);
                return {
                    ...ex,
                    sets
                };
            });
        }

        return res.status(200).json(workoutRoutine);
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        });
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

const deleteWorkoutTemplate = async (req, res) => {
    const { id } = req.params;
    try {
        console.log("Attempting to delete workoutRoutine with id:", id);
        const result = await prisma.workoutRoutine.findUnique({ where: { id: Number(id) } });
        console.log("DeleteMany result:", result);
        if (result) {
            await prisma.workoutRoutine.update({"where": {
                id: result.id,
            }, data: {
                deleted: true
            }})
            res.json({ success: true, message: 'Workout routine deleted.' });
        } else {
            res.status(404).json({ success: false, message: 'No routine found with that ID.' });
        }
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, message: 'Failed to delete routine.', error: error.message });
    }
};

const getRoutineProgress = async (req, res) => {
    const routineId = Number(req.params.id);
    const userId = Number(req.query.userId);
    if (isNaN(routineId) || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid routine or user ID." });
    }
    try {
        const sessions = await prisma.trainningSession.findMany({
            where: {
                workoutRoutineId: routineId,
                userId: userId
            },
            select: {
                id: true,
                endTime: true,
                trainningSessionSet: { select: { weight: true, reps: true } }
            },
            orderBy: { endTime: 'asc' }
        });
        const progress = sessions.map(session => ({
            date: session.endTime,
            totalVolume: session.trainningSessionSet.reduce((sum, set) => sum + (set.weight * set.reps), 0)
        }));
        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch routine progress." });
    }
};

module.exports = {
    createWorkoutRoutine,
    getWorkoutRoutineByUser,
    getWorkoutRoutineById,
    updateWorkoutRoutineById,
    getWorkoutRoutineTemplateByExerciseId,
    deleteWorkoutTemplate,
    getRoutineProgress
}