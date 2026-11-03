# {{projectName}}

A REST API with Express 5 and MongoDB, created with [create-express-node-starter](https://github.com/fadhlaouir/create-express-node-starter) (Basic Project 🌱).

## Getting Started

You need Node.js 22.13 or later, and a MongoDB database: local, hosted (for example MongoDB Atlas), or Docker.

1. Check `DEV_DATABASE` in `.env`.
2. Start the API:

   ```bash
   npm run dev     # restarts on file changes
   npm start       # without watching
   ```

3. Open [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/) for the API documentation, and [http://localhost:5000/health](http://localhost:5000/health) for the health check.

## Add Your First Endpoints

Generate a working model, controller and routes in one command:

```bash
npm run crud:operation -- generate product
```

This creates `/v1/api/products` and `/v1/api/products/:id` (create, paginated list, get, update, delete). Routes are registered automatically: any `src/routes/*.route.js` file is loaded by `src/routes/index.js`. See [cli/README.md](cli/README.md).

These routes are public. When you add users, protect the routes that change data.

## Scripts

| Command                  | What it does                                |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Start with automatic restart                |
| `npm start`              | Start                                       |
| `npm test`               | Integration tests with an in-memory MongoDB |
| `npm run lint`           | ESLint                                      |
| `npm run format:fix`     | Prettier                                    |
| `npm run crud:operation` | Generate or delete CRUD files               |

Husky runs ESLint and Prettier on staged files before each commit.

## Project Structure

```sh
.
├── cli/              # CRUD generator
├── src/
│   ├── app.js        # Express app: middleware, routes, errors
│   ├── docs.js       # Swagger UI at /api-docs
│   ├── swagger.json  # OpenAPI 3 spec: document your endpoints here
│   ├── config/       # Environment and database
│   ├── controllers/
│   ├── middlewares/  # Error handling
│   ├── models/
│   ├── routes/       # Every *.route.js is registered automatically
│   └── utils/        # Request helpers: HttpError, readString
├── test/
├── server.js         # Starts the server and shuts it down gracefully
├── Dockerfile
└── docker-compose.yml
```

Controllers can `throw new HttpError(status, message)` from `src/utils/request.js`: Express 5 sends it to the error handler, which answers `{ "success": false, "message": "..." }`.

## Docker

```bash
docker compose up --build
```

Starts the API on port 5000 with MongoDB 8.

## Security Built In

Helmet security headers, request body size limits, string-only request helpers that block MongoDB query injection, and error responses that never include internal details in production.
