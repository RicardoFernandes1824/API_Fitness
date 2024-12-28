const express = require('express');
const exerciseRouter = express.Router();
const {createExercise} = require('../controllers/exerciseControllers');
const verifyJWT = require('../middleware/verifyJWT');


exerciseRouter.post('/exercise', createExercise)


module.exports = {
    exerciseRouter
}