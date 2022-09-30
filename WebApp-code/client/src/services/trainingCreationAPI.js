/*
  trainingsEXE API calls
 */

const BASEURL = "/api"; //the base URL is /api

async function getModelExercies(id) {
  const response = await fetch(BASEURL + "/ModelExercises");
  const modelExercises = await response.json();
  if (response.ok) {
    return modelExercises;
  } else {
    throw modelExercises;
  }
}

function createTraining(trainingName) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + "/createTraining", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainingName: trainingName }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

async function createExercisesAndSeries(trainingId, exerciseList) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + "/createExercisesAndSeries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trainingId: trainingId,
        exerciseList: exerciseList,
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

async function createSeries(exerciseId, series) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + "/createSeries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exerciseId: exerciseId, series: series }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

// DELETE API

function deleteExerciseAndSeries(exerciseList) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + "/deleteExerciseAndSeries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseList: exerciseList }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function deleteTraining(trainingId) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + "/deleteTraining", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainingId: trainingId }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function renameWorkout(trainingName, trainingId) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + "/renameWorkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainingName: trainingName,
        trainingId: trainingId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const trainingCreationAPI = {
  getModelExercies,
  createTraining,
  createExercisesAndSeries,
  createSeries,
  deleteExerciseAndSeries,
  deleteTraining,
  renameWorkout,
};
export default trainingCreationAPI;
