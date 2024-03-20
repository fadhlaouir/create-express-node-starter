# Express Node Starter: Empowering Your API Development Journey

[![Author](http://img.shields.io/badge/author-@rfadhlaoui-blue.svg)](https://tn.linkedin.com/in/fadhlaouiraed)
[![GitHub license](https://img.shields.io/github/license/maitraysuthar/rest-api-nodejs-mongodb.svg)](https://github.com/fadhlaouir/express-node-starter/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dt/express-node-starter.svg)](https://www.npmjs.com/package/express-node-starter)

**Product Crud and AUTH entification REST API Developed with Node.js, Express, MongoDB**

## Overview

This project provides a robust API skeleton written in JavaScript ES6, suitable for any project. It offers features such as Product CRUD operations, Upload Image with multer and Swagger for APIs Testing. Additionally, it automates the generation of CRUD (Create, Read, Update, Delete) operations for entities within a MongoDB database, streamlining the development process for Node.js applications built on top of Express.js.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Software Requirements](#software-requirements)
- [Engines](#engines)
- [How to Install](#how-to-install)
- [Setting up Environments](#setting-up-environments)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [CLI Commands](#cli-commands)
- [Linting and Formatting](#linting-and-formatting)
- [Bugs or Improvements](#bugs-or-improvements)
- [License](#license)
- [Credits](#credits)
- [Support](#support)

## Getting started

This is a basic API skeleton written in JavaScript ES6.

This project will run on **NodeJs** using **MongoDB** as database.

API Documentation [Swagger]

## Features

- Product CRUD operations.
- Upload Image with Multer.
- Swagger API Documentation.
- Pre-defined response structures with proper status codes.
- Included CORS.
- Validations added.
- Light-weight project.
- Linting with [Eslint](https://eslint.org/). (Airbnb style)
- Included CLI for generating CRUD operations.
- husky for pre-commit hooks and lint-staged for running linters on git staged files.

## Software Requirements

- Node.js **16+**
- MongoDB **4+**

### Engines

- node **>=14.16.0 <=20.11.0**
- npm **>=6.14.11 <=10.2.4**

## How to install

## Setting up environments

1. Navigate to you project root directory.

```bash
cd {{Project Name}}
```

2. Install the required dependencies.

```bash
npm install
```

3.  You will find a file named `.env.example` on root directory of project.

4.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
5.  The file `.env` is already ignored, so you never commit your credentials.
6.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## Project structure

```sh
.
├── .husky
│   ├── _
│   │   ├── .gitignore
│   │   └── husky.sh
│   ├── pre-commit
│   └── pre-push
├── cli
│   ├── _
│   │   ├── deleteCrud.js
│   │   ├── generateEmptyCrud.js
│   │   ├── generateMinimalCrud.js
│   │   └── helpers.js
│   ├── index.js
│   └── README.md
├── src
│   ├── controllers
│   │   └── product.controller.js
│   ├── middlewares
│   │   └── multer.js
│   ├── models
│   │   └── product.model.js
│   ├── routes
│   │   └── product.route.js
│   ├── utils
│   │   └── helpers.js
│   └── swagger.json
├── .commitlintrc.json
├── .editorconfig
├── .env
├── .env.example
├── .eslintignore.json
├── .eslintrc.json
├── .gitignore
├── .prettierignore.json
├── .prettierrc.json
├── CHANGELOG.md
├── LICENSE
├── package.json
├── README.md
└── server.js

```

## How to run

### Running API server locally

If you would like to run the API server on your local environment, you can do so by running the following command:
Windows OS

```bash
npm run develop
```

Linux OS or Mac OS

```bash
npm run develop:mac
```

```bash
Connected to the database:YOUR_DB_CONNECTION_STRING
App is running ...

Press CTRL + C to stop the process.
```

**Note:**

`YOUR_DEVELOPMENT_DB_CONNECTION_STRING` will be your MongoDB connection string for `development` environment.

## Using the CLI to generate CRUD operations

1. Navigate to the project directory.
2. Run the following command:

```bash
npm run crud:operation
```

See the [CLI README](cli/README.md) section for more details on how to use the CLI to generate or delete CRUD operations.

Follow the prompts to select the CRUD type (empty or minimal) and provide the entity name. The tool will generate the necessary files for the CRUD operations based on your selection.

## Linting and Formatting

### Running Eslint

```bash
npm run lint:check
```

### Fixing Eslint errors

```bash
npm run lint:fix
```

### Prettier for code formatting

```bash
npm run format:fix
```

You can set custom rules for eslint in `.eslintrc.json` file, Added at project root.

## Bugs or improvements

Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.

## Credits

- Raed FADHLAOUI: [Author Email](mailto:raed.fadhlaoui@hotmail.com)
- Project Repository: [GitHub Repository](https://github.com/fadhlaouir/express-node-starter)

## Support

For any inquiries or issues, please contact [Support Email](raed.fadhlaoui@hotmail.com).

- **Optimization**: Improved readability by reorganizing the content and ensuring consistency in formatting.
- **Documentation Update**: Reflects the changes made to the CLI commands for generating and deleting CRUD operations.
- **Bug Fixes**: Resolved issues related to the CLI commands and the project structure.
- **Feature Addition**: Added support for generating empty and minimal CRUD operations using the CLI.
- **Code Quality**: Improved code quality by adding linting and formatting tools.
- **Security**: Updated dependencies to address security vulnerabilities.
- **Testing**: Added support for running tests using Jest.
- **Performance**: Improved performance by optimizing the code and removing unnecessary dependencies.
- **Refactoring**: Refactored the code to improve readability and maintainability.
- **Dependency Update**: Updated dependencies to their latest versions.
- **Configuration**: Updated the configuration files to reflect the changes made to the project structure.
