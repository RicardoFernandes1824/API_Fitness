const express = require('express');
const workoutRoutineRouter = express.Router();
const {
    createWorkoutRoutine,
    getWorkoutRoutineByUser,
    getWorkoutRoutineById,
    updateWorkoutRoutineById
} = require('../controllers/workoutRoutineControllers');


workoutRoutineRouter.post('/workoutRoutine', createWorkoutRoutine)
workoutRoutineRouter.get('/workoutRoutine/:userId', getWorkoutRoutineByUser)
workoutRoutineRouter.get('/workoutRoutine/:id', getWorkoutRoutineById)
workoutRoutineRouter.patch('/workoutRoutine/:id', updateWorkoutRoutineById)


module.exports = {
    workoutRoutineRouter
}