"use strict";

const db = require("./db");

exports.getTrainings = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Training WHERE User_Id = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};


exports.getExercisesByTrainingId = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Exercise E INNER JOIN Exercise_Model M INNER JOIN Training T ON M.Exercise_Model_Name= E.Exercise_Model_Name AND T.Training_Id= E.Training_Id WHERE T.Training_Id = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) return resolve([]);
      const ex = rows.map((e) => {
        return Object.assign({}, e);
      });
      resolve(ex);
    });
  });
};


exports.updateCompletedTrainings = (id, completed_value) => {
  return new Promise((resolve, reject) => {
    let valid = true;
    const sql =
      "UPDATE Training set Training_Completed= ? where Training_Id= ?";

    db.run(sql, [completed_value, id], (err, row) => {
      if (err) {
        reject(err);
        return;
      } else valid = true;
    });

    if (valid) {
      const sql2 =
        "UPDATE Exercise set Exercise_Completed= ? where Training_Id= ?";
      db.run(sql2, [completed_value, id], (err, row) => {
        if (err) {
          reject(err);

          return;
        } else valid = true;
      });
    }

    if (valid) {
      const sql3 =
        "UPDATE Series set Series_Completed= ? where Exercise_Id in (Select Exercise_Id from Training where Training_Id= ?)";
      db.run(sql3, [completed_value, id], (err, row) => {
        if (err) {
          reject(err);
          return;
        } else resolve();
      });
    }
  });
};


exports.updateCompletedExercises = (id, completed_value) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Exercise set Exercise_Completed= ? where Training_Id= ?";

    db.run(sql, [completed_value, id], (err, row) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};


exports.updateCompletedExercise = (id, completed_value) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Exercise set Exercise_Completed= ? where Exercise_Id= ?";
    db.run(sql, [completed_value, id], (err, row) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};


exports.updateCompletedSeries = (
  exercise_id,
  series_number,
  completed_value
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Series set Series_Completed= ? where Exercise_Id= ? and Series_Number= ?";

    db.run(sql, [completed_value, exercise_id, series_number], (err, row) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};


exports.getSeries = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Series where Exercise_Id = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) return resolve([]);
      const series = rows.map((e) => {
        return Object.assign({}, e);
      });
      resolve(series);
    });
  });
};


exports.getAllModelExercises = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Exercise_Model";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const exercises = rows.map((e) => ({ exerciseName: e.Exercise_Model_Name, description: e.Exercise_Model_Description, path: e.Exercise_Model_VideoPath }));
      resolve(exercises);
    });
  });
};


//INSERT functions to crate user's training

exports.insertTraining = (trainingName, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Training (Training_Name, User_Id, Training_completed) VALUES(?,?,1)';
    db.run(sql, [trainingName, userId], function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      });
  });
};

exports.insertTrainingWithId = (trainingName, userId, trainingId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Training (Training_Id, Training_Name, User_Id, Training_completed) VALUES(?, ?, ?, 1)';
    db.run(sql, [trainingId, trainingName, userId], function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      });
  });
};

exports.insertExercise = (exerciseId, trainingId, exerciseName, seriesNumber) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Exercise (Exercise_Model_Name, Total_Series_Number, Exercise_Completed , Training_Id, Exercise_Number) VALUES(?,?,1,?,?)';
    db.run(sql, [exerciseName, seriesNumber, trainingId, exerciseId], function (err) {
        if (err) {
          console.log(err)
          reject(err);
          
        }
        resolve(this.lastID);
      });
  });
};


exports.insertSeries = (exerciseId, seriesId, repetitions, weight, restingTime) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Series (Exercise_Id, Series_Number, Series_Repetitions, Series_Weights, Series_RestingTime, Series_Completed) VALUES(?,?,?,?,?,1)';
    db.run(sql, [exerciseId, seriesId, repetitions, weight, restingTime], function (err) {
        if (err) {
          reject(err);

        }
        resolve(this.lastID);
      });
  });
};

exports.insertSeries = (exerciseId, seriesId, repetitions, weight, restingTime) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Series (Exercise_Id, Series_Number, Series_Repetitions, Series_Weights, Series_RestingTime, Series_Completed) VALUES(?,?,?,?,?,1)';
    db.run(sql, [exerciseId, seriesId, repetitions, weight, restingTime], function (err) {
        if (err) {
          reject(err);

        }
        resolve(this.lastID);
      });
  });
};


exports.updateTrainingName = (trainingName, trainingId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE training SET training_Name = ? WHERE training_id = ?';
    db.run(sql, [trainingName, trainingId], function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      });
  });
};



exports.deleteTraining = (trainingId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM TRAINING WHERE Training_Id = ? ';
    db.run(sql, [trainingId], function (err) {
        if (err) {
          reject(err);

        }
        resolve(this.lastID);
      });
  });
};


exports.deleteExercise = (exerciseId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM EXERCISE WHERE Exercise_Id = ?';
    db.run(sql, [exerciseId], (err) => {
      if (err) {
        reject(err);
        console.log(err);
      }
      resolve(this.lastID);
    });
  });
}

exports.deleteSeries = (exerciseId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM SERIES WHERE Exercise_Id = ?';
    db.run(sql, [exerciseId], (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(this.lastID);
    });
  });
}


//DELETE functions to delete user's training
