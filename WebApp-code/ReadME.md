# API

## Auth API

**Login User**

- Description: authenticates the user who is trying to do the login if username and password are correct.

* POST `/api/sessions`

- Request body: username and password of the user.

```json
POST /api/sessions HTTP/1.1
Content-Type: application/json

{
    "username": "user@user.it",
    "password":"password"
}

```

- Response: `200 OK` (success)

* Response body content:

```json
{
  "id": 1,
  "email": "user@user.it",
  "name": "Mario"
}
```

- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

**Logout User**

- Description: logs out the current user.

* DELETE `/api/sessions/current`

- Request parameters: _None_

```json
DELETE /api/sessions/current HTTP/1.1
```

- Response: `200 OK` (success)

* Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

**Get Current User**

- Description: check if the current user is logged and retrieves his data (id, username (email) and name).

* GET `/api/sessions/current`

- Request parameters: _None_

```json
GET /api/sessions/current HTTP/1.1
```

- Response: `200 OK` (success)

* Response body content:

```json
{
  "id": 1,
  "email": "user@user.it",
  "name": "Mario"
}
```

- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

## Trainings Execution API

**Get trainings**

- Description: get all the trainings of the logged user.

```json
GET /api/trainings/ HTTP/1.1
```

- Response body content:

```json
{
  "Training_Id" : 1,
  ...
}
```

**Get exercises training**

- Description: get all the exercises given a training id.

```json
GET /api/exercise/1 HTTP/1.1
```

- Response body content:

```json
{
  "Exercise_Id": 1,
  ...
}
```

**Update completed training**

- Description: update the completed status of a training and all the exercises and all the series connected to it.

```json
PUT /api/trainings HTTP/1.1
Content-Type: application/json

{
    "training_id": 1,
    "completed_value": 0
}

```

**Update completed exercises**

- Description: update the completed status of the exercises of a training.

```json
PUT /api/exercises HTTP/1.1

Content-Type: application/json

{
    "training_id": 1,
    "completed_value": 0
}

```

**Get Series**

- Description: Get all the series given an exercise id.

```json
GET /api/series/1 HTTP/1.1

```

- Response body content:

```json
{
  "Exercise_Id": 1,
  "Series_Number":1
  ...
}
```
