const express = require('express');
const workoutSessionRouter = express.Router();
const { createSessionFromTemplate, saveSessionResults, getAllSessionsByUser, getSessionById, saveFullSession } = require('../controllers/workoutSessionControllers');

workoutSessionRouter.post('/workoutSession/fromTemplate/:templateId/:userId', createSessionFromTemplate);
workoutSessionRouter.post('/workoutSession/saveResults', saveSessionResults);
workoutSessionRouter.post('/workoutSession/saveFullSession', saveFullSession);
workoutSessionRouter.get('/workoutSession/user/:userId', getAllSessionsByUser);
workoutSessionRouter.get('/workoutSession/:sessionId', getSessionById);

module.exports = { workoutSessionRouter }; 