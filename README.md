# Intelligence Query API
## Overview
This is a RESTful API built with Node.js+Express for managing meta information on names. It provides `GET`, `POST`, and `DELETE` operations with proper error handling. It includes features such as pagination, sorting and natural language querying for filtering.

## Project Structure
```
stage_2
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── controllers
│   │   └── profileController.ts
│   ├── db
│   │   ├── conn.ts
│   │   ├── seed_profiles.json
│   │   └── seed.ts
│   ├── model
│   │   └── nameMeta.ts
│   ├── routes
│   │   └── profileRoute.ts
│   ├── schema
│   │   └── profile.schema.ts
│   ├── server.ts
│   └── util
│       └── parser.ts
└── tsconfig.json
```

## Technologies Used
- Node.js
- Express
- Typescipt
- Drizzle ORM

## Installation
NOTE: You should have `git` and `node` installed already
1. clone the repository
```bash
git clone git@github.com:Amaryllis750/hng14-stage1-profileapi.git
cd hng14-stage1-profileapi
```

2. Install dependencies
```bash 
npm install 
```

## Running the server
To run the server in development mode
``` bash
npm run dev
```

NOTE: You can start the server in production mode using
```bash
npm run start
```
But you must build the project first with `npm run build`


## Seeding the database
To seed the databse, run:
```bash 
npm run seed
```

## Environment Variables
- `DB_HOST` The host where the database is on
- `DB_PASSWORD` Password to access the database
- `DB_NAME` Name of the database to access
- `DB_USER` User to access the database with
- `DB_PORT` Port to access the database on
- `DB_URL` Url where the database can be accessed (Alternative to using the remaining variables)



## Schemas
### Profile Schema
| Column | Type | Nullable | Example |
|---|---|---|---|
| `id` | UUID | No | `019d98fa-3f2c-7316-acc9-338738a1faa2` |
| `name` | VARCHAR | No | `daniel` |
| `gender` | ENUM(`male`, `female`) | Yes | `male` |
| `gender_probability` | FLOAT | Yes | `null` |
| `sample_size` | INT | No | `2466344` |
| `age` | INT | Yes | `58` |
| `age_group` | ENUM(`child`, `teenager`, `adult`, `elderly`) | Yes | `adult` |
| `country_id` | CHAR(2) | No | `ro` |
| `country_probability` | FLOAT | Yes | `null` |
| `created_at` | TIMESTAMP | No | `2026-04-17T01:07:10.247Z` |

## API Endpoints
### Create a new profile for a name  `POST /api/profiles`
#### Request Sample:

```json
{
    "name": "daniel"
}
```

#### Response Sample: 
1. Already Existing Name
```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": {
    "id": "019dbaac-0b91-755d-beb7-8a9b1a246b06",
    "name": "daniel",
    "gender": "male",
    "gender_probability": 0.99,
    "age": 58,
    "age_group": "adult",
    "country_id": "ro",
    "country_probability": 0.09323228,
    "created_at": "2026-04-23 15:08:50.5771Z"
  }
}
```

2. New Profile
```json
{
    "status": "success",
    "data": {
        "id": "019dbaac-0b91-755d-beb7-8a9b1a246b06",
        "name": "daniel",
        "gender": "male",
        "gender_probability": 0.99,
        "age": 58,
        "age_group": "adult",
        "country_id": "ro",
        "country_probability": 0.09323228,
        "created_at": "2026-04-23 15:08:50.577Z"
    }
}
```

###  Get a particular profile by the id `GET /api/profiles/:id`
#### Response Sample
```json
{
    "status": "success",
    "data": {
        "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
        "name": "emmanuel",
        "gender": "male",
        "gender_probability": 0.99,
        "sample_size": 1234,
        "age": 25,
        "age_group": "adult",
        "country_id": "NG",
        "country_probability": 0.85,
        "created_at": "2026-04-01T12:00:00Z"
    }
}
```



### Get all profiles available  `GET /api/profiles`
#### Response Sample
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "emmanuel",
      "gender": "male",
      "age": 25,
      "age_group": "adult",
      "country_id": "NG"
    },
    {
      "id": "id-2",
      "name": "sarah",
      "gender": "female",
      "age": 28,
      "age_group": "adult",
      "country_id": "US"
    }
  ]
}
```

### Delete profile by Id `DELETE /api/profiles/:id`
Returns 204 on success

### Search Profile with Natural Language `GET api/profiles/search?q=<query>`
#### Response Sample
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "emmanuel",
      "gender": "male",
      "age": 25,
      "age_group": "adult",
      "country_id": "NG"
    },
    {
      "id": "id-2",
      "name": "sarah",
      "gender": "female",
      "age": 28,
      "age_group": "adult",
      "country_id": "US"
    }
  ]
}
```

## Parsing Rules


## Support
For support, open an issue.