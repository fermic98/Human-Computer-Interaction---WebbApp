/*
  trainingsEXE API calls
 */

const BASEURL = "/api"; //the base URL is /api

async function getTrainings(id) {
  const response = await fetch(BASEURL + "/trainings");
  const trainings = await response.json();
  if (response.ok) {
    return trainings;
  } else {
    throw trainings;
  }
}

async function getExercisesByTrainingId(id) {
  const response = await fetch(BASEURL + "/exercise/" + id);
  const exercises = await response.json();
  if (response.ok) {
    return exercises;
  } else {
    throw exercises;
  }
}

async function getSeriesByExerciseId(id) {
  const response = await fetch(BASEURL + "/series/" + id);
  const series = await response.json();
  if (response.ok) {
    return series;
  } else {
    throw series;
  }
}

async function updateCompletedTrainings(id, completed_value) {
  const response = await fetch(BASEURL + "/trainings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      training_id: id,
      completed_value: completed_value,
    }),
  });

  return response;
}

async function updateCompletedExercises(id, completed_value) {
  const response = await fetch(BASEURL + "/exercises", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      training_id: id,
      completed_value: completed_value,
    }),
  });
  return response;
}

async function updateCompletedSeries(
  exercise_id,
  series_number,
  completed_value
) {
  const response = await fetch(BASEURL + "/series", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exercise_id: exercise_id,

      series_number: series_number,
      completed_value: completed_value,
    }),
  });
  return response;
}

async function updateCompletedExercise(exercise_id, completed_value) {
  const response = await fetch(BASEURL + "/exercise", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exercise_id: exercise_id,

      completed_value: completed_value,
    }),
  });
  return response;
}

const trainingExeAPI = {
  getTrainings,
  getExercisesByTrainingId,
  updateCompletedTrainings,
  updateCompletedExercises,
  getSeriesByExerciseId,
  updateCompletedSeries,
  updateCompletedExercise,
};
export default trainingExeAPI;
