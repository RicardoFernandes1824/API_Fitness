const path = require('path');
const express = require('express');
const cors = require('cors');
const {usersRouter} = require('./routes/users');
const {accountRouter} = require('./routes/authentication');
const {exerciseRouter} = require('./routes/exercise');
const {workoutRoutineRouter} = require('./routes/workoutRoutine');
const { workoutSessionRouter } = require('./routes/workoutSession');


const verifyJWT = require('./middleware/verifyJWT');

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads/exercise_pics', express.static(path.join(__dirname, 'uploads/exercise_pics')));
app.use('/uploads/profile_pics', express.static(path.join(__dirname, 'uploads/profile_pics')));

app.use(accountRouter)

app.use(usersRouter)

app.use(exerciseRouter)

app.use(workoutRoutineRouter)
app.use(workoutSessionRouter);


// app.use(verifyJWT); 

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});