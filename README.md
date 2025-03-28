# TopDog API Documentation

## Overview

The **TopDog API** is a RESTful API for managing tier lists. It allows users to create accounts, log in, and manage tier lists with customizable tiers. This documentation provides details about the available endpoints, their usage, example requests, responses, and error messages.

---

## Base URLs

- **Local Environment**: http://localhost:3000
- **Deployed Environment**: https://top-dog-psi.vercel.app

---

## Common status codes

| status code | message                                                | description          |
| ----------- | ------------------------------------------------------ | -------------------- |
| 400         | Error for each field                                   | Validation Error     |
| 401         | "Could not find access token"                          | Authentication Error |
| 401         | "Unauthenticated action"                               | Authentication Error |
| 403         | "Missing access to perform this action"                | Authorization Error  |
| 500         | "Could not authenticate user"                          | Authentication Error |
| 500         | "Something went wrong when trying to verify the owner" | Authorization Error  |
| 500         | "Something went wrong when trying to ..."              | Unexpected Error     |

## Authentication

All endpoints requiring authentication use a Bearer Token in the `Authorization` header. Example:

```bash
Authorization: Bearer <access_token>
```

## Endpoints

### User Authentication

#### Sign Up

- **URL:** `/auth/signup`
- **Method:** `POST`
- **Description:** Creates a new user account.

##### Request Body

```json
{
  "username": "exampleUser",
  "email": "example@example.com",
  "password": "examplePassword"
}
```

##### Example cURL

```bash
# Local
curl -X POST http://localhost:3000/auth/signup \
-H "Content-Type: application/json" \
-d '{"username": "exampleUser", "email": "example@example.com", "password": "examplePassword"}'

# Deployed
curl -X POST https://top-dog-psi.vercel.app/auth/signup \
-H "Content-Type: application/json" \
-d '{"username": "exampleUser", "email": "example@example.com", "password": "examplePassword"}'
```

##### Response example

| status code | message                                    |
| ----------- | ------------------------------------------ |
| 201         | "User exampleUser created"                 |
| 400         | "Username or email has already been taken" |

#### Log in

- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user.

##### Request Body

```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

##### Example cURL

```bash
# Local
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "exampleUser", "password": "examplePassword"}'

# Deployed
curl -X POST https://top-dog-psi.vercel.app/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "exampleUser", "password": "examplePassword"}'
```

##### Response example

- 200 **OK**

```json
{
  "accessToken": "your.jwt.token"
}
```

| status code | message                      |
| ----------- | ---------------------------- |
| 400         | "Wrong username or password" |

### Tier lists

#### Create a Tier list

- **URL:** `/lists`
- **Method:** `POST`
- **Description:** Creates a new tier list for the authenticated user.

##### Request headers

```json
Authorization: Bearer <access_token>`
```

##### Request body

```json
{
  "name": "My new tier list"
}
```

##### Example cURL

```bash
# Local
curl -X POST http://localhost:3000/lists \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name": "My new tier list"}'

# Deployed
curl -X POST https:/top-dog-psi.vercel.app/lists \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name": "My new tier list"}'
```

##### Response example

| status code | message                          |
| ----------- | -------------------------------- |
| 201         | "List: My new tier list created" |

#### Get all tier lists

- **URL:** `/lists`
- **Method:** `GET`
- **Description:** Retrieves all tier lists with an optional limit.

##### Query Parameters

- `limit` (optional): Number of tier lists to retrieve.

```bash
# Local
curl -X GET http://localhost:3000/lists?limit=5

# Deployed
curl -X GET https://top-dog-psi.vercel.app/lists?limit=5
```

##### Response example

- 200 **OK**

```json
[
  {
    "_id": "tierListId",
    "name": "My Tier List",
    "tiers": [...],
    "userId": "userId",
    "createdAt": "2025-03-28T12:00:00.000Z",
    "updatedAt": "2025-03-28T12:00:00.000Z"
  }
]
```

#### Get tier list by id

- **URL:** `/lists/:id`
- **Method:** `GET`
- **Description:** Retrieves a specific tier list by its id.

##### Example cURL

```bash
# Local
curl -X GET http://localhost:3000/lists/tierListId

# Deployed
curl -X GET https://top-dog-psi.vercel.app/lists/tierListId
```

##### Response example

- 200 **OK**

```json
{
  "_id": "tierListId",
  "name": "My Tier List",
  "tiers": [...],
  "userId": "userId",
  "createdAt": "2025-03-28T12:00:00.000Z",
  "updatedAt": "2025-03-28T12:00:00.000Z"
}
```

| status code | message                  |
| ----------- | ------------------------ |
| 404         | "The list was not found" |

#### Update a Tier list

- **URL:** `/lists/:id`
- **Method:** `PUT`
- **Description:** Updates a tier list.

##### Request headers

```json
Authorization: Bearer <access_token>`
```

##### Example cURL

```bash
# Local
curl -X PUT http://localhost:3000/lists/tierListId \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name": "Updated Tier list Name"}'

# Deployed
curl -X PUT https://https://top-dog-psi.vercel.app/lists/tierListId \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name": "Updated Tier list Name"}'
```

##### Response example

- 200 **OK**

```json
{
  "_id": "tierListId",
  "name": "Updated Tier List Name",
  "tiers": [...],
  "userId": "userId",
  "createdAt": "2025-03-28T12:00:00.000Z",
  "updatedAt": "2025-03-28T12:00:00.000Z"
}
```

| status code | message                                 |
| ----------- | --------------------------------------- |
| 403         | "Missing access to perform this action" |

#### Delete a Tier List

- **URL:** `/lists/:id`
- **Method:** `DELETE`
- **Description:** Delete a tier list.

##### Request headers

```json
Authorization: Bearer <access_token>`
```

##### Example cURL

```bash
# Local
curl -X DELETE http://localhost:3000/lists/tierListId \
-H "Authorization: Bearer <access_token>"

# Deployed
curl -X DELETE https://https://top-dog-psi.vercel.app/lists/tierListId \
-H "Authorization: Bearer <access_token>"
```

##### Response example

| status code | message                                                        |
| ----------- | -------------------------------------------------------------- |
| 200         | "Tier list 'Updated Tier List Name' was successfully deleted." |

### Tiers

#### Create a Tier

- **URL:** `/lists/:id/tiers`
- **Method:** `POST`
- **Description:** Adds a new tier to a tier list.

##### Request headers

```json
Authorization: Bearer <access_token>`
```

##### Request body

```json
{
  "name": "My new tier",
  "order": 1,
  "color": "#ff0000"
}
```

##### Example cURL

```bash
# Local
curl -X POST https:/top-dog-psi.vercel.app/lists/tierListId/tiers \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name": "New Tier", "order": 1, "color": "#ff0000"}'

# Deployed
curl -X POST https:/top-dog-psi.vercel.app/lists/tierListId/tiers \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name": "New Tier", "order": 1, "color": "#ff0000"}'
```

##### Response example

| status code | message                  |
| ----------- | ------------------------ |
| 201         | "Tier: New tier created" |
