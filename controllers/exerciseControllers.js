const prisma = require('../utils/prisma')


const createExercise = async (req, res) => {
    const {name, video, description, tips} = req.body;

    try {
        const newExercise = await prisma.exercise.create({
            data: {
                name,
                video,
                description,
                tips,
            },
        });
        res.status(201).json(newExercise);
    } catch (error) {
        console.error("Error creating exercise:", error.message);

        res.status(500).json({
            error: "An error occurred while creating the exercise. Please try again.",
        });
    }
};

const getAllExercises = async (req, res) => {
    try {
        const exercises = await prisma.exercise.findMany()
        return res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({error: "An error occurred while getAllExercises"});
    }
}

const updateExercise = async (req, res) => {
    try {
        const updateExercise = await prisma.exercise.update({
            where: {
                id: +req.params.id
            },
            data: {
                name: req.body.name,
                video: req.body.video,
                description: req.body.description,
                tips: req.body.tips
            }
        })
        res.status(201).json(updateExercise);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


module.exports = {
    createExercise,
    getAllExercises,
    updateExercise
}