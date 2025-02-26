const express = require('express');
const workoutRoutineRouter = express.Router();
const {
    createWorkoutRoutine,
    getWorkoutRoutineByUser,
    getWorkoutRoutineById,
    updateWorkoutRoutineById,
    getWorkoutRoutineTemplateByExerciseId
} = require('../controllers/workoutRoutineControllers');


workoutRoutineRouter.post('/workoutRoutine', createWorkoutRoutine)
workoutRoutineRouter.get('/workoutRoutine/:userId', getWorkoutRoutineByUser)
workoutRoutineRouter.get('/workoutRoutine/:id', getWorkoutRoutineById)
workoutRoutineRouter.get('/workoutRoutine/template/:id', getWorkoutRoutineTemplateByExerciseId)
workoutRoutineRouter.patch('/workoutRoutine/:id', updateWorkoutRoutineById)


module.exports = {
    workoutRoutineRouter
}