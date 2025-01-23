const express = require('express');
const {usersRouter} = require('./routes/users');
const {accountRouter} = require('./routes/authentication');
const {exerciseRouter} = require('./routes/exercise');
const {workoutRoutineRouter} = require('./routes/workoutRoutine');

const verifyJWT = require('./middleware/verifyJWT');

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());


app.use(accountRouter)

app.use(usersRouter)

app.use(exerciseRouter)

app.use(workoutRoutineRouter)

app.use(verifyJWT);

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});