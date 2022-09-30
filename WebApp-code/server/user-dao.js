"use strict";
/* Data Access Object (DAO) module for accessing users */

const db = require("./db");

const bcrypt = require("bcrypt");

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE User_Id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "User not found." });
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        const user = {
          id: row.User_Id,
          email: row.User_Email,
        };
        resolve(user);
      }
    });
  });
};

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE User_Email = ?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = {
          id: row.User_Id,

          email: row.User_Email,
          name: row.User_Name,
        };

        // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        bcrypt.compare(password, row.User_Password).then((result) => {
          if (result) resolve(user);
          else resolve(false);
        });
      }
    });
  });
};
