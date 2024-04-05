import * as fs from 'fs';
import { join } from 'path';

/**
 * Recursively creates directories and copies files from a template directory to a new project directory.
 * @param {string} templatePath - The path to the template directory.
 * @param {string} newProjectPath - The path to the new project directory.
 */
const createDirectoryContents = (templatePath, newProjectPath) => {
  // Get the list of files and directories in the template directory
  const filesToCreate = fs.readdirSync(templatePath);

  // Iterate through each file/directory in the template directory
  filesToCreate.forEach(file => {
    const originalFilePath = join(templatePath, file);
    const newFilePath = join(newProjectPath, file);

    // Get file stats
    const stats = fs.statSync(originalFilePath);

    if (stats.isFile()) {
      // If it's a file, copy it to the new project directory
      fs.copyFileSync(originalFilePath, newFilePath);
    } else if (stats.isDirectory()) {
      // If it's a directory, create it in the new project directory
      fs.mkdirSync(newFilePath);

      // Recursively create directory contents
      createDirectoryContents(originalFilePath, newFilePath);
    }
  });
};

export default createDirectoryContents;
