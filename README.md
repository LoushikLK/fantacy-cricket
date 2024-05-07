# FANTASY CRICKET APP

The app is a simple backend to accept team entries for a fantasy cricket app (similar to Dream11) and process the results based on match results.

## Features

- API to create team.
- API to process result from json file and publish wining team data.
- Error handling, validation added.

## Tech Stack

**Server:** Node.js, Express.js, Mongodb, Mongoose (for ORM), Postman (For documentation)

**Deployment:** [Deployed to Render](https://fantasy-cricket.onrender.com)
**Docs:** [Postman](https://documenter.getpostman.com/view/23951730/2sA3JJAP19)

## Run Locally

Clone the project

```bash
git clone https://github.com/LoushikLK/fantasy-cricket.git
```

Navigate to the project directory

```bash
cd fantasy-cricket
```

Install dependencies

```bash
npm install
```

Create a .env file at the root of the project

```bash
touch .env //ADD ENV VALUES TO IT
```

Start the development server with nodemon (make sure to install nodemon beforehand.)

```bash
npm run dev
```

## Endpoints

- `POST /api/v1/add-team`: Create a new team and return back its id
- `GET /api/v1/process-result`: Process and update team result
- `GET /api/v1/team-result`: Get all the team result

## Environment Variables

Ensure to set up the following environment variables:

- `DATABASE_URL`: Mongodb Database url
- `APP_PORT`: Port of the application
