#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");
const inquirer = require("inquirer");
const fse = require("fs-extra");
const ora = require("ora");
const chalk = require("chalk"); // Import chalk for colored output

// Define the directory paths
const boilerplateDir = path.join(__dirname, "..");
const templatesDir = path.join(boilerplateDir, "templates");

// Main function to create the project
async function main() {
  try {
    // Prompt user for project name and directory
    const { projectName, projectDirectory } = await promptProjectDetails();

    // Display loading message
    const loading = createLoading("Creating project...");

    // Copy template to new project directory
    copyTemplate(projectDirectory);

    // Install dependencies
    await installDependencies(projectDirectory);

    loading.succeed(chalk.green("Project created successfully"));
    console.log(
      `Project '${projectName}' created successfully in ${projectDirectory}`
    );
  } catch (error) {
    console.error(chalk.red("An error occurred:"));
    console.error(chalk.red(error.message || error));
  }
}

// Function to prompt user for project details
async function promptProjectDetails() {
  console.log("\n🚀 Let's create a new Express.js project!");

  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "Enter project name:",
      validate: (input) => !!input.trim(),
    },
    {
      type: "input",
      name: "projectDirectory",
      message: "Enter project directory:",
      default: (answers) => `./${answers.projectName}`,
    },
  ];

  return inquirer.prompt(questions);
}

// Function to copy template to new project directory
function copyTemplate(projectDirectory) {
  const destinationPath = path.join(process.cwd(), projectDirectory);
  fse.copySync(templatesDir, destinationPath);
}

// Function to install project dependencies
async function installDependencies(projectDirectory) {
  return new Promise((resolve, reject) => {
    console.log("\nInstalling dependencies...");
    const child = exec(`cd ${projectDirectory} && npm install`);
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    child.stderr.on("data", (data) => {
      console.error(chalk.yellow(data.toString())); // Display warnings in yellow
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            chalk.red(`Failed to install dependencies with exit code ${code}`)
          )
        );
      }
    });
  });
}

// Function to create a loading indicator
function createLoading(message) {
  return ora({ text: message, spinner: "dots" }).start();
}

main();
