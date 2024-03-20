#!/usr/bin/env node

// Import required modules
const { exec } = require("child_process");
const path = require("path");
const inquirer = require("inquirer");
const fse = require("fs-extra");
const ora = require("ora");
const chalk = require("chalk");

// Templates data
const templates = [
  {
    name: "Basic Project 🌱",
    description:
      "A basic Express.js architecture with Node.js and MongoDB setup.",
    directory: "basic-project",
  },
  {
    name: "Product CRUD 🚀",
    description:
      "An Express.js project with product CRUD operations and upload Image.",
    directory: "product-crud",
  },
  {
    name: "Full Stack User Authentication 🔒",
    description:
      "An Express.js project with user CRUD operations and authentication and upload Image.",
    directory: "user-crud-authentification",
  },
];

/**
 * Main function to create a new Express.js project.
 */
async function main() {
  try {
    // Display welcome message
    console.log(
      chalk.yellow.bold("🚀 Welcome to Express.js Project Creator! 🚀")
    );
    console.log(
      chalk.yellow("Let's create a new Express.js project together.")
    );

    // Prompt user for project details
    const { projectName, projectDirectory, templateDir } =
      await promptProjectDetails();

    // Display loading message
    const loading = createLoading("Creating project...");

    // Copy template to new project directory
    copyTemplate(templateDir, projectDirectory);

    // Install project dependencies
    await installDependencies(projectDirectory);

    // Display success message
    loading.succeed(chalk.green("✅ Project created successfully!"));
    console.log(
      `Project '${projectName}' created successfully in ${projectDirectory}`
    );
    console.log(chalk.yellow("Happy coding! 😊"));
  } catch (error) {
    // Handle errors
    console.error(chalk.red("❌ An error occurred:"));
    console.error(chalk.red(error.message || error));
  }
}

/**
 * Function to prompt user for project details.
 * @returns {Object} An object containing project name, directory, and template directory.
 */
async function promptProjectDetails() {
  const questions = [
    {
      type: "list",
      name: "template",
      message: "Choose a project template:",
      choices: templates.map((template) => ({
        name: `${template.name} - ${template.description}`,
        value: template,
      })),
    },
    {
      type: "input",
      name: "projectName",
      message: "📝 Enter project name:",
      validate: (input) => !!input.trim(),
    },
    {
      type: "input",
      name: "projectDirectory",
      message: "📁 Enter project directory:",
      default: (answers) => `./${answers.projectName}`,
    },
  ];

  const { template, projectName, projectDirectory } = await inquirer.prompt(
    questions
  );

  return {
    projectName,
    projectDirectory,
    templateDir: template.directory,
  };
}

/**
 * Function to copy template to new project directory.
 * @param {string} templateDir - Path to the selected template directory.
 * @param {string} projectDirectory - Path to the project directory.
 */
function copyTemplate(templateDir, projectDirectory) {
  const sourcePath = path.resolve(__dirname, "project-files", templateDir);
  const destinationPath = path.join(process.cwd(), projectDirectory);

  fse.copySync(sourcePath, destinationPath);
}

/**
 * Function to install project dependencies.
 * @param {string} projectDirectory - Path to the project directory.
 * @returns {Promise<void>} A promise representing the installation process.
 */
async function installDependencies(projectDirectory) {
  console.log("\nInstalling dependencies... ⚙️");

  return new Promise((resolve, reject) => {
    const child = exec(`cd ${projectDirectory} && npm install`);

    child.stdout.on("data", (data) => console.log(data.toString()));
    child.stderr.on("data", (data) =>
      console.error(chalk.yellow(data.toString()))
    );

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`Failed to install dependencies with exit code ${code}`)
        );
      }
    });
  });
}

/**
 * Function to create a loading indicator.
 * @param {string} message - Loading message.
 * @returns {Object} Loading spinner instance.
 */
function createLoading(message) {
  return ora({ text: message, spinner: "dots" }).start();
}

// Entry point: Call the main function
main();
