#!/usr/bin/env node

// Import required modules
const { exec } = require("child_process");
const path = require("path");
const inquirer = require("inquirer");
const fse = require("fs-extra");
const ora = require("ora");
const chalk = require("chalk");

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
    const { projectName, projectDirectory } = await promptProjectDetails();

    // Display loading message
    const loading = createLoading("Creating project...");

    // Define directory paths
    const templatesDir = path.resolve(__dirname, "project-files");

    // Copy template to new project directory
    copyTemplate(templatesDir, projectDirectory);

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
 * @returns {Object} An object containing project name and directory.
 */
async function promptProjectDetails() {
  // Define questions for user input
  const questions = [
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

  // Prompt user for input and return the responses
  return inquirer.prompt(questions);
}

/**
 * Function to copy template to new project directory.
 * @param {string} templatesDir - Path to the template directory.
 * @param {string} projectDirectory - Path to the project directory.
 */
function copyTemplate(templatesDir, projectDirectory) {
  // Calculate destination path
  const destinationPath = path.join(process.cwd(), projectDirectory);

  // Copy template files to destination directory
  fse.copySync(templatesDir, destinationPath);
}

/**
 * Function to install project dependencies.
 * @param {string} projectDirectory - Path to the project directory.
 * @returns {Promise<void>} A promise representing the installation process.
 */
async function installDependencies(projectDirectory) {
  return new Promise((resolve, reject) => {
    console.log("\nInstalling dependencies... ⚙️");

    // Execute npm install command in project directory
    const child = exec(`cd ${projectDirectory} && npm install`);

    // Capture stdout and stderr
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    child.stderr.on("data", (data) => {
      console.error(chalk.yellow(data.toString()));
    });

    // Handle process exit
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(); // Resolve promise on successful installation
      } else {
        // Reject promise with error message
        reject(
          new Error(
            chalk.red(`Failed to install dependencies with exit code ${code}`)
          )
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
  // Create and start loading spinner
  return ora({ text: message, spinner: "dots" }).start();
}

// Entry point: Call the main function
main();
