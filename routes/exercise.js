const express = require('express');
const exerciseRouter = express.Router();
const {createExercise, getAllExercises, updateExercise, getExerciseById} = require('../controllers/exerciseControllers');


exerciseRouter.post('/exercise', createExercise)
exerciseRouter.get('/exercise', getAllExercises)
exerciseRouter.patch('/exercise/:id', updateExercise)
exerciseRouter.get('/exercise/:id', getExerciseById);


module.exports = {
    exerciseRouter
}