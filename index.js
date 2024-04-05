#!/usr/bin/env node

import inquirer from 'inquirer';
import * as fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import createDirectoryContents from './createDirectoryContents.js';

// Constants
const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = `${__dirname}/templates`;

// Function to check if a directory exists
const directoryExists = (path) => {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
};

// Prompt questions
const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: fs.readdirSync(TEMPLATES_DIR),
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      return /^[A-Za-z\-_\d]+$/.test(input) ? true : 'Project name may only include letters, numbers, underscores, and hyphens.';
    },
  },
];

// Main function to prompt questions and generate project
const main = async () => {
  try {
    // Check if the templates directory exists
    if (!directoryExists(TEMPLATES_DIR)) {
      console.error('Error: Templates directory not found.');
      process.exit(1);
    }

    // Prompt questions
    const answers = await inquirer.prompt(QUESTIONS);
    const { 'project-choice': projectChoice, 'project-name': projectName } = answers;
    const templatePath = `${TEMPLATES_DIR}/${projectChoice}`;

    // Create project directory
    const projectPath = `${CURR_DIR}/${projectName}`;
    fs.mkdirSync(projectPath);

    // Generate project contents from template
    createDirectoryContents(templatePath, projectName);

    console.log('Project generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Run the main function
main();
