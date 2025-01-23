const express = require('express');
const workoutRoutineRouter = express.Router();
const {
    createWorkoutRoutine,
    getWorkoutRoutineById,
    updateWorkoutRoutineById
} = require('../controllers/workoutRoutineControllers');


workoutRoutineRouter.post('/workoutRoutine', createWorkoutRoutine)
workoutRoutineRouter.get('/workoutRoutine/:id', getWorkoutRoutineById)
workoutRoutineRouter.patch('/workoutRoutine/:id', updateWorkoutRoutineById)


module.exports = {
    workoutRoutineRouter
}