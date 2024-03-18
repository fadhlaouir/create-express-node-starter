#!/usr/bin/env node

// Import required modules
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

// Define the directory paths
const boilerplateDir = path.join(__dirname, "..");
const templateDir = path.join(boilerplateDir, "templates");

// Main function to create the project
async function main() {
  try {
    // Display version
    displayVersion();

    // Prompt user for project details
    const { projectName, projectDirectory } = await promptProjectDetails();

    // Display loading message
    console.log("\nCreating project...");

    // Copy template to new project directory
    copyTemplate(templateDir, projectDirectory);

    // Navigate to project directory
    process.chdir(projectDirectory);

    // Install project dependencies
    await installDependencies();

    // Determine the npm command based on the operating system
    const npmCommand =
      process.platform === "win32" ? "npm run develop" : "npm run develop:mac";

    // Run the appropriate npm script
    console.log("\nStarting development server...");
    exec(npmCommand);

    // Display success message
    console.log(
      `\n🎉 Project '${projectName}' created successfully in ${projectDirectory}`
    );
  } catch (error) {
    // Display error message
    console.error("\n❌ An error occurred:", error.message || error);
  }
}

// Function to display version
function displayVersion() {
  const packageJson = require("../package.json");
  console.log(`\ncreate-express-node-starter v${packageJson.version}`);
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
      message: "Enter project directory (default: current directory):",
      default: ".", // Default to current directory
    },
  ];

  return inquirer.prompt(questions); // Prompt user and return answers
}

// Function to copy template to new project directory
function copyTemplate(templateDir, projectDirectory) {
  exec(`cp -r ${templateDir}/* ${projectDirectory}`); // Copy template files
}

// Function to install project dependencies
async function installDependencies() {
  console.log("\nInstalling project dependencies...");
  return new Promise((resolve, reject) => {
    exec(`npm install`, (error, stdout, stderr) => {
      if (error) {
        reject(error); // Reject promise if error occurs
      }
      if (stderr) {
        reject(new Error(stderr)); // Reject promise if stderr is not empty
      }
      resolve(); // Resolve promise if installation is successful
    });
  });
}

// Call main function to start project creation process
main();
