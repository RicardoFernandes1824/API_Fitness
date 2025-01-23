const prisma = require('../utils/prisma')


const createWorkoutRoutine = async (req, res) => {
    const {name, ex1, ex2, ex3, video} = req.body;

    try {
        const newWorkoutRoutine = await prisma.workoutRoutine.create({
            name,
            ex1,
            ex2,
            ex3,
            video
        })
        return res.status(201).json(newWorkoutRoutine);
    } catch (error) {
        return res.status(400).json({
            error: error,
        })
    }
}

const getWorkoutRoutineById = async (req, res) => {
    try {
        const workoutRoutine = await prisma.workoutRoutine.findUnique({
            where: {
                id: +req.params.id
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