const express = require('express');
const exerciseRouter = express.Router();
const {createExercise, getAllExercises, updateExercise} = require('../controllers/exerciseControllers');


exerciseRouter.post('/exercise', createExercise)
exerciseRouter.get('/exercise', getAllExercises)
exerciseRouter.patch('/exercise/:id', updateExercise)


module.exports = {
    exerciseRouter
}