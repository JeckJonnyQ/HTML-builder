const fs = require('fs').promises;
const path = require('path');

async function copyFolder() {
  const pathToFilesFolder = path.join(__dirname, 'files');
  const pathToCopyFolder = path.join(__dirname, 'files-copy');

  try {
    // Создаем папку files-copy
    await fs.mkdir(pathToCopyFolder, { recursive: true });

    // Если папка существует вычитываем из нее все файлы и удаляем их
    const files = await fs.readdir(pathToCopyFolder);
    for (const element of files) {
      await fs.unlink(path.join(pathToCopyFolder, element));
    }

    const sourceFiles = await fs.readdir(pathToFilesFolder);
    for (const element of sourceFiles) {
      await fs.copyFile(
        path.join(pathToFilesFolder, element),
        path.join(pathToCopyFolder, element),
      );
    }

    console.log('Folder successfully copied');
  } catch (error) {
    console.log('Error:', error);
  }
}

copyFolder();
