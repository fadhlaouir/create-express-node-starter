# create-express-node-starter

CLI tool for bootstrapping Express.js projects with a predefined template.

[![Author](http://img.shields.io/badge/author-@rfadhlaoui-blue.svg)](https://tn.linkedin.com/in/fadhlaouiraed)
[![GitHub license](https://img.shields.io/github/license/maitraysuthar/rest-api-nodejs-mongodb.svg)](https://github.com/fadhlaouir/express-node-starter/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dt/create-express-node-starter.svg)](https://www.npmjs.com/package/create-express-node-starter)


## Overview

`create-express-node-starter` is a versatile CLI tool designed to streamline the process of setting up a new Express.js project with Node.js. It provides a comprehensive boilerplate with essential features such as authentication, MongoDB integration, Swagger API documentation, and more, enabling developers to kick-start their API development journey quickly and efficiently.

## Features

- **Express.js Integration:** Built on top of Express.js, a fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB Support:** Seamlessly integrates MongoDB, a popular NoSQL database, for efficient data storage and retrieval.
- **Authentication and Authorization:** Includes pre-configured authentication and authorization middleware for securing endpoints.
- **Swagger API Documentation:** Automatically generates API documentation using Swagger UI Express, simplifying API exploration and testing.
- **Flexible Project Structure:** Follows a modular project structure that promotes scalability, maintainability, and code organization.
- **Extensible:** Easily extend and customize the boilerplate to suit your specific project requirements.

## Project Templates

`create-express-node-starter` now offers three project templates to choose from:

- **Basic Project 🌱:** A basic Express.js project with Node.js and MongoDB setup.
- **Product CRUD 🚀:** An Express.js project with product CRUD operations.
- **User CRUD AUTHENTIFICATION 🔒:** An Express.js project with user CRUD operations and authentication (register and login).

## Installation

1. **Install CLI Tool:**
   Before using `npx` to create a new Express.js project, make sure to install the CLI tool globally by running:

   ```bash
   npm install -g create-express-node-starter
   ```

2. **Create a New Project:**
   To create a new Express.js project using `create-express-node-starter`, run:

   ```bash
    npx create-express-node-starter
   ```

3. **Follow the Prompts:**
   The CLI tool will guide you through the process of setting up your new project, allowing you to customize various options such as project name, description, author, and more.

## Getting Started

1. **Start Development:**
   Navigate to your project directory and run the following command to start the development server:

- For Windows:
  ```
  npm run develop
  ```
- For macOS or Linux:
  ```
  npm run develop:mac
  ```

2. **Explore API Documentation:**
   Access the Swagger API documentation at [http://localhost:5000/api-docs](http://localhost:5000/api-docs) to explore and test your API endpoints.

3. **Generate CRUD Operations:**
   After running the project, you can create CRUD operations using the following command:

```bash
   npm run crud:operation
```

This command will create controllers, routes, and models for your CRUD operations. Choose between empty and minimal templates or remove existing CRUD components.

## Contributing

Contributions are welcome! If you have suggestions, feature requests, or bug reports, please open an issue on the GitHub repository. Pull requests are also encouraged. Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

# Sponsor on Buy Me a Coffee

If you find this project valuable, consider supporting us through Buy Me a Coffee. Your sponsorship helps us maintain and improve the project, ensuring better features, updates, and support for the community.

<a href="https://www.buymeacoffee.com/fadhlaouir" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>



