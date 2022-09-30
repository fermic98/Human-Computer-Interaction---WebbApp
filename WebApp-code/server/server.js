"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const passport = require("passport");
const { check, validationResult, body } = require("express-validator"); // validation middleware
const LocalStrategy = require("passport-local").Strategy; // username+psw
const session = require("express-session");

const trainingsDao = require("./trainings-dao");
const userDao = require("./user-dao");
const { json } = require("express");

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const idnew = json.toString(id);
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated!" });
};

// enable sessions in Express
app.use(
  session({
    // set up here express-session
    secret: "ajs5sd6f5sd6fiufadds8f9865d6fsgeifgefleids89fwu",
    resave: false,
    saveUninitialized: false,
    time: null,
  })
);

function getTime() {
  if (session.time) return session.time;
  return { weekDay: dayjs().format("dddd"), hour: Number(dayjs().format("H")) };
}

// init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

/*** USER APIs ***/

// Login --> POST /sessions
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// Logout --> DELETE /sessions/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", isLoggedIn, (req, res) => {
  res.status(200).json(req.user);
});

app.get("/api/user/:id", (req, res) => {
  try {
    userDao
      .getUserById(req.params.id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

/*  Trainings API  */
//API to get all the Model exercises
app.get("/api/ModelExercises/", isLoggedIn, async function (req, res) {
  try {
    const exercises = await trainingsDao.getAllModelExercises();
    return res.status(200).json(exercises);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

app.get("/api/trainings/", isLoggedIn, async function (req, res) {
  try {
    const trainings = await trainingsDao.getTrainings(req.user.id);
    return res.status(200).json(trainings);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

app.get("/api/exercise/:training_id", isLoggedIn, async function (req, res) {
  try {
    const exercises = await trainingsDao.getExercisesByTrainingId(
      req.params.training_id
    );
    return res.status(200).json(exercises);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

app.get("/api/series/:exercise_id", isLoggedIn, async function (req, res) {
  try {
    const series = await trainingsDao.getSeries(req.params.exercise_id);
    return res.status(200).json(series);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

app.put("/api/trainings", isLoggedIn, async function (req, res) {
  try {
    const result = await trainingsDao.updateCompletedTrainings(
      req.body.training_id,
      req.body.completed_value
    );
    return res.status(200).json(result);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

app.put("/api/exercises", isLoggedIn, async function (req, res) {
  try {
    const result = await trainingsDao.updateCompletedExercises(
      req.body.training_id,
      req.body.completed_value
    );
    return res.status(200).json(result);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

app.put("/api/exercise", isLoggedIn, async function (req, res) {
  try {
    const result = await trainingsDao.updateCompletedExercise(
      req.body.exercise_id,
      req.body.completed_value
    );
    return res.status(200).json(result);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

app.put("/api/series", isLoggedIn, async function (req, res) {
  try {
    const result = await trainingsDao.updateCompletedSeries(
      req.body.exercise_id,
      req.body.series_number,
      req.body.completed_value
    );
    return res.status(200).json(result);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

/*  Trainings creation API  */
//API to create a training with its exercises and relatives series
app.post("/api/createTraining", async function (req, res) {
  try {
    const result = await trainingsDao.insertTraining(
      req.body.trainingName,
      req.user.id
    );
    return res.status(200).json(result);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

app.post("/api/createExercisesAndSeries", async function (req, res) {
  var trainingId = req.body.trainingId;
  //Variabili temporanee con le info inerenti il singolo esercizio in creazione
  var exerciseId;

  try {
    req.body.exerciseList
      .forEach(async (exercise) => {
        trainingsDao
          .insertExercise(
            exercise.exerciseNumber,
            trainingId,
            exercise.exerciseName,
            exercise.seriesNumber
          )
          .then((exerciseId) => {
            exercise.series.forEach(async (serie) => {
              await trainingsDao.insertSeries(
                exerciseId,
                serie.seriesId,
                serie.repetitions,
                serie.weight,
                serie.restingTime
              );
            });
          });
      })
      .then(res.status(200));
  } catch (err) {}
});

//UPDATE
app.post("/api/renameWorkout", function (req, res) {
  try {
    trainingsDao.updateTrainingName(req.body.trainingName, req.body.trainingId);
    res.status(200);
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
});

//DELETE
app.delete("/api/deleteTraining", async (req, res) => {
  let id = req.body.trainingId;

  try {
    let trainingDeleted = await trainingsDao.deleteTraining(id);
    res.json(trainingDeleted);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/api/deleteExerciseAndSeries", async (req, res) => {
  let exerciseList = req.body.exerciseList;
  var ret = [];
  try {
    exerciseList.forEach((exercise) => {
      ret.push(
        trainingsDao
          .deleteSeries(exercise.exerciseId)
          .then(() => trainingsDao.deleteExercise(exercise.exerciseId))
      );
    });
    return res.status(200).json(ret);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* app.put("/api/createSeries", async function (req, res) {

  var seriesId;
  var repetitions;
  var weight;
  var restingTime;

  try {
    req.body.series.forEach((serie) => {
      console.log(serie);
      seriesId = serie.seriesId;
      repetitions = serierepetitions;
      weight = serie.weight;
      restingTime = serie.restingTime;
      await trainingsDao.insertSeries(seriesId, repetitions, weight, restingTime);
    })
  } catch (err) {
    res.status(503).json({
      error: `Error`,
    });
  }
}); */

/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-gymMe5-server listening at http://localhost:${port}`);
});

app.get("/api/userTest", (req, res) => {
  console.log(req.user);
});
