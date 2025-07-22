const express = require('express');
const usersRouter = express.Router();
const {updateUser, createUser, getUserById, deleteUser, updateUserPhoto} = require('../controllers/usersControllers');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({
    dest: path.join(__dirname, '../uploads/profile_pics/')
});
const imageController = require('../controllers/imageController');


usersRouter.post('/users', createUser)
usersRouter.get('/users/:id', getUserById)
usersRouter.patch('/users/:id', updateUser)
usersRouter.delete('/users/:id', deleteUser)
usersRouter.post('/user/:id/photo', upload.single('photo'), imageController.uploadUserPhoto);


module.exports = {
    usersRouter
}