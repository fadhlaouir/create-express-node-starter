# {{projectName}}

A REST API with Express 5, MongoDB and JWT authentication, created with [create-express-node-starter](https://github.com/fadhlaouir/create-express-node-starter) (Full Stack User Authentication 🔒).

## Getting Started

You need Node.js 22.13 or later, and a MongoDB database: local, hosted (for example MongoDB Atlas), or Docker.

1. Check `DEV_DATABASE` in `.env`. A random `SECRET` for signing tokens was generated for you.
2. Start the API:

   ```bash
   npm run dev     # restarts on file changes
   npm start       # without watching
   ```

3. Open [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/) to try every endpoint.

**No mailer yet?** Leave `MAILER_EMAIL_ID` empty: the API skips sending and prints the confirmation and reset links in the console, so you can test sign-up and password reset locally.

## Features

- Sign-up with email confirmation, sign-in, password reset by email, password change
- Roles `is_user`, `is_manager` and `is_admin`, and a back-office sign-in for staff
- JWT tokens (`Authorization: Bearer <token>`) holding only the user id and role
- Profiles with photo upload, a paginated user list for staff, self-service account deletion
- Swagger docs, health check, CRUD generator, integration tests, Docker

## API

Everything is under `/v1/api`.

| Method | Path                          | Access                | Description                                |
| ------ | ----------------------------- | --------------------- | ------------------------------------------ |
| POST   | `/auth/register`              | Public                | Create an account (photo optional)         |
| POST   | `/auth/confirm/:code`         | Public                | Activate the account from the email link   |
| POST   | `/auth/resend-confirmation`   | Public                | Send a new confirmation email              |
| POST   | `/auth/login`                 | Public                | Sign in, returns a token                   |
| POST   | `/auth/admin/login`           | Admins and managers   | Back-office sign-in                        |
| POST   | `/auth/forget-password`       | Public                | Email a reset link                         |
| POST   | `/auth/reset-password/:token` | Public                | Set a new password                         |
| POST   | `/users/check-email`          | Public                | Whether an email is registered             |
| GET    | `/users`                      | Admins and managers   | Paginated list: `?page=1&limit=20`         |
| GET    | `/users/me`                   | Signed in             | The signed-in user                         |
| PUT    | `/users/me/password`          | Signed in             | Change password (needs the current one)    |
| GET    | `/users/:id`                  | The user, or staff    | One user                                   |
| PUT    | `/users/:id`                  | The user, or staff    | Update name and photo; admins can set role |
| DELETE | `/users/:id`                  | The user, or an admin | Delete the account                         |

Email links point to your front end (`DEVELOPMENT_CLIENT_URL` / `PRODUCTION_CLIENT_URL`), at `/account/:code/enable` and `/auth/reset-password/:token`. Your front end calls the matching API route.

**First admin:** sign up, confirm the account, then set its `role` to `is_admin` directly in MongoDB. From then on, that admin can change roles through `PUT /users/:id`.

## Add More Endpoints

```bash
npm run crud:operation -- generate product
```

This creates `/v1/api/products` and `/v1/api/products/:id` with a working model, controller and routes, registered automatically. Reading is public; creating, updating and deleting require a token. See [cli/README.md](cli/README.md).

## Scripts

| Command                  | What it does                                |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Start with automatic restart                |
| `npm start`              | Start                                       |
| `npm test`               | Integration tests with an in-memory MongoDB |
| `npm run lint`           | ESLint                                      |
| `npm run format:fix`     | Prettier                                    |
| `npm run crud:operation` | Generate or delete CRUD files               |

## Docker

```bash
docker compose up --build
```

Starts the API on port 5000 with MongoDB 8. Set `SECRET` in your shell or `.env` first.

## Security Built In

- Passwords hashed with bcrypt; confirmation and reset codes random, single-use and stored only as hashes; reset links expire after one hour.
- Sign-up never accepts a role or activation flag; only admins change roles.
- Users can read, update and delete only their own account.
- String-only request fields block MongoDB query injection.
- Sign-in and password reset don't reveal which emails have accounts.
- Image-only uploads with random names, served from a folder that can't be escaped.
- Rate limits on public auth routes, Helmet headers, and no internal details in production errors.
