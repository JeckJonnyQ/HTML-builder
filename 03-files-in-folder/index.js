const fs = require('fs').promises;
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');

async function readDirectory() {
  try {
    const files = await fs.readdir(pathFolder, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        let pathFile = path.join(pathFolder, file.name);

        // Метод предоставляющий расширение файла по его директории
        let extName = path.extname(file.name).slice(1);

        // Метод предоставляющий имя файла по его директории и расширению
        const nameFile = path.basename(pathFile, path.extname(file.name));

        // Метод предоставляющий информацию о файле по его директории
        let stats = await fs.stat(pathFile);
        let fileSizeB = stats.size; // Размер файла в байтах
        const fileSizeKB = (stats.size / 1024).toFixed(3); // Размер файла в килобайтах
        console.log(
          `${nameFile} - ${extName} - ${fileSizeB}B - ${fileSizeKB}KB`,
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

readDirectory();
