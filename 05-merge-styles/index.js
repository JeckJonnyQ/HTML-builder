const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  try {
    const pathToStyles = path.join(__dirname, 'styles');
    const pathToBundleStyle = path.join(__dirname, 'project-dist/bundle.css');

    // Очищаем файл Bundle перед каждой записью в него данных
    await fs.writeFile(pathToBundleStyle, '');

    // Вычитываем все файлы из папки и перебираем их оставляя толкьо css расширения
    const files = await fs.readdir(pathToStyles);
    for (const element of files) {
      // Метод EXTNAME использует путь к конкретному файлу
      let pathToCurrentFile = path.join(pathToStyles, element);
      let extName = path.extname(pathToCurrentFile).slice(1);
      if (extName === 'css') {
        // Вычитываем содержимое файлов и добавляем в нужный BANDLE-файл
        const contentOfFile = await fs.readFile(pathToCurrentFile, 'utf-8');
        await fs.appendFile(pathToBundleStyle, contentOfFile);
      }
    }
    console.log('Файлы успешно скопированы');
  } catch (error) {
    console.log('Error:', error);
  }
}
mergeStyles();
