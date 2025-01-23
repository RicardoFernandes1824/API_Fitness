const express = require('express');
const usersRouter = express.Router();
const {updateUser, createUser, getUserById} = require('../controllers/usersControllers');


usersRouter.post('/users', createUser)
usersRouter.get('/users/:id', getUserById)
usersRouter.patch('/users/:id', updateUser)


module.exports = {
    usersRouter
}