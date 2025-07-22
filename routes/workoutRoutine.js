const express = require('express');
const workoutRoutineRouter = express.Router();
const {
    createWorkoutRoutine,
    getWorkoutRoutineByUser,
    getWorkoutRoutineById,
    updateWorkoutRoutineById,
    getWorkoutRoutineTemplateByExerciseId,
    deleteWorkoutTemplate,
    getRoutineProgress
} = require('../controllers/workoutRoutineControllers');


workoutRoutineRouter.post('/workoutRoutine', createWorkoutRoutine)
workoutRoutineRouter.get('/workoutRoutine/:userId', getWorkoutRoutineByUser)
workoutRoutineRouter.get('/user/:id/workoutRoutine/:id', getWorkoutRoutineById)
workoutRoutineRouter.get('/workoutRoutine/template/:id', getWorkoutRoutineTemplateByExerciseId)
workoutRoutineRouter.patch('/workoutRoutine/:id', updateWorkoutRoutineById)
workoutRoutineRouter.delete('/workoutTemplate/:id', deleteWorkoutTemplate);
workoutRoutineRouter.get('/:id/progress', getRoutineProgress);


module.exports = {
    workoutRoutineRouter
}