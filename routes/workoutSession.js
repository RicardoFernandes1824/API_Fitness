const express = require('express');
const workoutSessionRouter = express.Router();
const { createSessionFromTemplate, saveSessionResults, getAllSessionsByUser, getSessionById } = require('../controllers/workoutSessionControllers');

workoutSessionRouter.post('/workoutSession/fromTemplate/:templateId/:userId', createSessionFromTemplate);
workoutSessionRouter.post('/workoutSession/saveResults', saveSessionResults);
workoutSessionRouter.get('/workoutSession/user/:userId', getAllSessionsByUser);
workoutSessionRouter.get('/workoutSession/:sessionId', getSessionById);

module.exports = { workoutSessionRouter }; 