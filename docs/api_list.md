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
- `GET /code/{code}` : Get unique branch by branch code

## Dashboard APIs
Base URL: `/api/dashboard`
- `GET /` : Get main dashboard stats
- `GET /summary` : Get high level summary metrics
- `GET /category-breakdown` : Chart data for inventory categories
- `GET /branch-performance` : Branch level metrics
- `GET /recent-activity` : Recent system actions

## Inventory APIs
Base URL: `/api/inventory`
- `GET /` : Get all inventory items
- `GET /{id}` : Get inventory item by ID
- `POST /` : Create a new inventory record manually
- `PUT /{id}` : Update an existing inventory record
