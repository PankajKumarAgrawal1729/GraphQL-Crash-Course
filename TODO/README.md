# GraphQL Crash Course

This project is a full-stack GraphQL app with a React client and an Apollo/Express server.

## Project structure

- `client/` — React frontend
- `server/` — GraphQL server
- `.gitignore` — ignores dependencies, logs, env files, and editor artifacts

## Tech stack

- React
- Apollo Client
- GraphQL
- Express
- Apollo Server

## Run the app

### 1. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Start the server

```bash
cd server
npm start
```

### 3. Start the client

```bash
cd client
npm start
```

The React app runs on port 5001 and the server provides the GraphQL API used by the frontend.

## Notes

- The project is set up as a single Git repository at the root folder.
- The client and server are kept in separate folders for clean development.
- The app fetches todo data from the GraphQL server and renders it in the frontend.
