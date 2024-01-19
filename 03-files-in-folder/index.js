const fs = require('fs').promises;
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');

async function readDirectory() {
  try {
    const files = await fs.readdir(pathFolder, { withFileTypes: true });
    const fileNames = [];
    for (let file of files) {
      if (file.isFile()) {
        fileNames.push(file.name);
      }
    }
    console.log(fileNames);
  } catch (error) {
    console.error(error);
  }
}

readDirectory();
