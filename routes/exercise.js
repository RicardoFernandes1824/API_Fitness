const express = require('express');
const exerciseRouter = express.Router();
const {createExercise, getAllExercises, updateExercise, getExerciseById, getExerciseProgress} = require('../controllers/exerciseControllers');


exerciseRouter.post('/exercise', createExercise)
exerciseRouter.get('/exercise', getAllExercises)
exerciseRouter.patch('/exercise/:id', updateExercise)
exerciseRouter.get('/exercise/:id', getExerciseById);
exerciseRouter.get('/:id/progress', getExerciseProgress);


module.exports = {
    exerciseRouter
}