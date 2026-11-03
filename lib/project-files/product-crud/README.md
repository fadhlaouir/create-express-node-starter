# {{projectName}}

A product API with Express 5 and MongoDB, created with [create-express-node-starter](https://github.com/fadhlaouir/create-express-node-starter) (Product CRUD 🚀).

## Getting Started

You need Node.js 22.13 or later, and a MongoDB database: local, hosted (for example MongoDB Atlas), or Docker.

1. Check `DEV_DATABASE` in `.env`.
2. Start the API:

   ```bash
   npm run dev     # restarts on file changes
   npm start       # without watching
   ```

3. Open [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/) to try every endpoint.

## API

| Method | Path                   | Description                                                   |
| ------ | ---------------------- | ------------------------------------------------------------- |
| POST   | `/v1/api/products`     | Create a product (JSON, or multipart with a `photo` image)    |
| GET    | `/v1/api/products`     | List products: `?page=1&limit=20`, search names with `?q=mug` |
| GET    | `/v1/api/products/:id` | Get a product                                                 |
| PUT    | `/v1/api/products/:id` | Update a product; a new `photo` replaces the old one          |
| DELETE | `/v1/api/products/:id` | Delete a product and its photo                                |

A product has `name` (required), `description`, `price` (required, 0 or more), `quantity` and `photo`. Photos must be JPEG, PNG, GIF or WebP images up to 5 MB; they get random file names and are served from `/uploads/`.

**These routes are public.** Before going to production, protect the ones that change data, or start from the "Full Stack User Authentication" template.

## Add More Endpoints

```bash
npm run crud:operation -- generate order
```

This creates `/v1/api/orders` and `/v1/api/orders/:id` with a working model, controller and routes, registered automatically. See [cli/README.md](cli/README.md).

## Scripts

| Command                  | What it does                                |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Start with automatic restart                |
| `npm start`              | Start                                       |
| `npm test`               | Integration tests with an in-memory MongoDB |
| `npm run lint`           | ESLint                                      |
| `npm run format:fix`     | Prettier                                    |
| `npm run crud:operation` | Generate or delete CRUD files               |

## Project Structure

```sh
.
├── cli/              # CRUD generator
├── src/
│   ├── app.js        # Express app: middleware, routes, errors
│   ├── docs.js       # Swagger UI at /api-docs
│   ├── swagger.json  # OpenAPI 3 spec
│   ├── config/       # Environment and database
│   ├── controllers/  # product.controller.js
│   ├── middlewares/  # Uploads and error handling
│   ├── models/       # product.model.js
│   ├── routes/       # Every *.route.js is registered automatically
│   └── utils/        # Request helpers: HttpError, readString
├── test/
├── server.js
├── Dockerfile
└── docker-compose.yml
```

## Docker

```bash
docker compose up --build
```

Starts the API on port 5000 with MongoDB 8, with uploads and data in Docker volumes.

## Security Built In

Helmet security headers, image-only uploads with random names served from a folder that can't be escaped, validated numbers and strings (no MongoDB query injection), literal search text, and error responses that never include internal details in production.
