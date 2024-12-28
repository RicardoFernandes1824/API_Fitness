const prisma = require('../utils/prisma')


const createExercise = async (req, response) => {
    const exercises = req.body.exercise;
    const newExercise = await prisma.exercise.create({
        data: {
            name: req.body.name,
            video: req.body.video,
            description: req.body.description,
            tips: req.body.tips,
            sessionId: req.body.sessionId,
            sessionSetId:req.body.sessionSetId
        }})
        response.json(newExercise)
    }


    module.exports = {
        createExercise
    }