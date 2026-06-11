# Nayan Eye Care Backend APIs

The backend exposes several REST API endpoints at `http://localhost:8080`. Most of these APIs require a valid JWT token passed in the `Authorization: Bearer <token>` header, except for public endpoints like `/api/auth/login`.

## Authentication APIs
Base URL: `/api/auth`
- `POST /login` : Authenticate user & get JWT token
- `POST /register` : Register a new user

## Branch APIs
Base URL: `/api/branches`
- `GET /` : Get all branches
- `GET /{id}` : Get a branch by ID
- `POST /` : Create a new branch
- `PUT /{id}` : Update a branch
- `DELETE /{id}` : Delete a branch
