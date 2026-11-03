<h1 align="center">create-express-node-starter</h1>

<p align="center">
  A production-ready Express 5 and MongoDB REST API, in one command.<br>
  Authentication, uploads, API docs, tests and Docker, already wired and secured.
</p>

<p align="center">
  <a href="https://github.com/fadhlaouir/create-express-node-starter/actions/workflows/ci.yml"><img src="https://github.com/fadhlaouir/create-express-node-starter/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/create-express-node-starter"><img src="https://img.shields.io/npm/v/create-express-node-starter.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/create-express-node-starter"><img src="https://img.shields.io/npm/dt/create-express-node-starter.svg" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
</p>

```bash
npx create-express-node-starter my-api
```

---

## Why this exists

Most Express starters get you to "hello world" and stop. The work that takes days comes after: hashing passwords properly, confirming emails, resetting passwords without leaking who has an account, safe uploads, rate limits, error handling that doesn't leak stack traces, tests you can run without installing a database.

This CLI gives you all of that on day one, on current versions (Express 5, Mongoose 9, Node.js 22+), with **zero runtime dependencies** in the CLI itself. Every template is created, installed and tested in CI on each change, exactly the way you get it.

## 60 seconds

```console
$ npx create-express-node-starter my-api --template auth

create-express-node-starter v3.0.0

Creating my-api…

✔ Full Stack User Authentication 🔒 created in my-api

Next steps
  cd my-api
  npm run dev

  Make sure MongoDB is running, or set DEV_DATABASE in .env.
  API docs:  http://localhost:5000/api-docs/
  Generate:  npm run crud:operation -- generate <name>
  Tests:     npm test (in-memory MongoDB, nothing to set up)
```

Your project already has a `.env` with a random signing secret, a Git repository with commit hooks, and its dependencies installed. Point `DEV_DATABASE` at MongoDB, run `npm run dev`, and open the API docs.

No mail server yet? Sign-up still works: confirmation and reset links are printed in the console.

## Templates

| Template                                      | You get                                                                                                     | Tests |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----- |
| `basic`: **Basic Project 🌱**                 | Express 5 and MongoDB, error handling, rate limiting, health check, API docs, CRUD generator                | 11    |
| `product`: **Product CRUD 🚀**                | Everything in Basic, plus a product API with pagination, search and photo uploads                           | 17    |
| `auth`: **Full Stack User Authentication 🔒** | Everything in Basic, plus sign-up with email confirmation, JWT, roles, password reset, profiles with photos | 32    |

**Every project includes:**

- **Express 5** with async error handling, Helmet security headers, CORS and body size limits
- **MongoDB with Mongoose 9**, a `/health` endpoint and graceful shutdown
- **Swagger UI** at `/api-docs/`, from an OpenAPI 3 spec you can extend
- **A CRUD generator**: `npm run crud:operation -- generate order` writes a working model, controller and routes, registered automatically
- **Integration tests** with Node's test runner and an in-memory MongoDB
- **ESLint, Prettier, Husky and lint-staged**, configured and passing
- **Docker**: a production `Dockerfile` running as a non-root user, and `docker-compose.yml` with MongoDB 8
- **GitHub Actions CI**: lint, format, tests on Node.js 22 and 24, and a Docker build

The `auth` template's API, roles and security model are documented in [express-node-starter](https://github.com/fadhlaouir/express-node-starter#api), which it is built from.

## Options

```text
npx create-express-node-starter [directory] [options]

  -t, --template <name>  basic, product or auth
  -y, --yes              Use the defaults for everything not given
      --no-install       Skip npm install
      --no-git           Skip git init
  -h, --help             Show this help
  -v, --version          Show the version
```

Run it with no arguments to be asked for the directory and the template. Answers can also be piped, for scripts:

```bash
printf 'my-api\n3\n' | npx create-express-node-starter --no-install
```

The CLI never writes into a directory that already has files in it.

## Requirements

- Node.js **22.13 or later**
- MongoDB **6 or later**: local, hosted (for example MongoDB Atlas), or the included Docker Compose setup
- Git, optional: without it the project is created without a repository

## Security built in

- Passwords hashed with bcrypt; email codes random, single-use, stored only as hashes, and reset links that expire
- Sign-up can't set a role or activate itself; users can only read and change their own account
- Request fields must be strings or numbers, which blocks MongoDB query injection
- Sign-in and password reset answer the same whether an email exists or not
- Uploads accept images only, under random names, from a folder that can't be escaped
- Rate limits on public authentication routes; no internal error details in production
- Swagger UI loaded with Subresource Integrity and a strict Content-Security-Policy

Found a vulnerability? Please report it privately: see [SECURITY.md](SECURITY.md).

## Upgrading from 2.x

Version 3 rebuilds every template on Express 5, Mongoose 9 and Node.js 22, and fixes security issues in the 2.x templates. Projects created with 2.x don't change by themselves. Compare yours with a new project, or start from one:

- Node.js 22.13 or later is required.
- `npm run dev` replaces `develop` and `develop:mac`; `.env` is loaded by Node itself.
- Routes and responses of the `auth` template changed: see [Upgrading from 1.x](https://github.com/fadhlaouir/express-node-starter#upgrading-from-1x) in express-node-starter for the list.
- Don't run `npx` with `sudo`: it isn't needed, and it would create a project owned by root.

## Contributing

Bug reports, ideas and pull requests are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md).

The templates are built from [express-node-starter](https://github.com/fadhlaouir/express-node-starter), so fixes reach both projects:

```bash
npm run sync:templates -- ../express-node-starter   # rebuild lib/project-files
npm test                                            # CLI tests
npm run test:templates                              # create, install and test every template
```

## License

[MIT](LICENSE) © Raed Fadhlaoui

If this project saves you time, you can [buy me a coffee](https://www.buymeacoffee.com/fadhlaouir).
