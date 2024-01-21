const fs = require('fs');
const path = require('path');

const pathToAssets = path.join(__dirname, 'assets'); // Путь к папке из которой берем данные
const pathToProjectDist = path.join(__dirname, '/project-dist'); // Путь к папке Project-dist
const pathToProjectDistAssets = path.join(__dirname, '/project-dist/assets'); // Путь к папке где все будет собрано

async function buildHTMLPage(sourceFolder, targetFolder) {
  try {
    // Создаем целевую папку, если она не существует
    await fs.promises.mkdir(targetFolder, { recursive: true });

    // Создаем папку Assets если она не существует
    await fs.promises.mkdir(path.join(targetFolder), { recursive: true });

    // Создаем файл Style.css в целевой папке
    await fs.promises.writeFile(path.join(pathToProjectDist, 'style.css'), '');
    await mergeStyle();

    // Создаем файл index.html в папке дист
    await fs.promises.writeFile(path.join(pathToProjectDist, 'index.html'), '');

    // Читаем содержимое исходной папки
    const files = await fs.promises.readdir(sourceFolder, {
      withFileTypes: true,
    });
    // Рекурсивно копируем каждый файл или папку
    for (const element of files) {
      const pathSourceFolder = path.join(sourceFolder, element.name);
      const pathTargetFolder = path.join(targetFolder, element.name);

      if (element.isDirectory()) {
        // Если это папка, рекурсивно копируем ее содержимое
        await buildHTMLPage(pathSourceFolder, pathTargetFolder);
      } else {
        await fs.promises.copyFile(pathSourceFolder, pathTargetFolder);
      }
    }
  } catch (error) {
    console.log('Error: ', error);
  }
}

// Функция которая соединяет все HTML файлы в один
async function mergeIndex(textTemplate) {
  await fs.promises.appendFile(
    path.join(pathToProjectDist, 'index.html'),
    textTemplate,
  );
}

// Функция вычитывает несколько и объединяет в один Style.css файлов
async function mergeStyle() {
  const pathToStyles = path.join(__dirname, '/styles');

  const files = await fs.promises.readdir(pathToStyles);
  for (const element of files) {
    // Метод EXTNAME использует путь к конкретному файлу
    let pathToCurrentFile = path.join(pathToStyles, element);
    let extName = path.extname(pathToCurrentFile).slice(1);
    if (extName === 'css') {
      // Вычитываем содержимое файлов и добавляем в нужный Style.css-файл
      const contentOfFile = await fs.promises.readFile(
        pathToCurrentFile,
        'utf-8',
      );
      await fs.promises.appendFile(
        path.join(pathToProjectDist, 'style.css'),
        contentOfFile,
      );
    }
  }
}

// Функция вычитывает темплейт и заполняет версткой из html файлов
async function changeTemplate() {
  const pathToTamplate = path.join(__dirname, 'template.html');
  const readTemplate = fs.createReadStream(pathToTamplate, {
    encoding: 'utf-8',
  });

  let textTemplate = '';

  readTemplate.on('data', (chunk) => {
    // Записываем содержимое файла в перменную
    textTemplate += chunk;
  });

  readTemplate.on('end', async () => {
    // Вычитываем содержимое папки компонентс
    const pathToComponents = path.join(__dirname, '/components');
    try {
      const filesInComponents = await fs.promises.readdir(pathToComponents, {
        withFileTypes: true,
      });

      const componentPromises = filesInComponents.map(async (element) => {
        const takeFilesName = path.join(pathToComponents, element.name);

        let extName = path.extname(element.name);
        if (extName === '.html') {
          const fileName = path.basename(takeFilesName, extName);
          const readComponentText = fs.createReadStream(takeFilesName, {
            encoding: 'utf-8',
          });

          let componentTextDATA = '';
          readComponentText.on('data', (chunk) => {
            componentTextDATA += chunk;
          });

          await new Promise((resolve) => {
            readComponentText.on('end', () => {
              textTemplate = textTemplate.replace(
                `{{` + fileName + `}}`,
                componentTextDATA,
              );
              resolve();
            });
          });
        }
      });
      await Promise.all(componentPromises);
      mergeIndex(textTemplate);
    } catch (error) {
      console.error('Ошибка при чтении компонентов:', error);
    }
  });

  readTemplate.on('error', (error) => {
    console.log('Error:', error);
  });
}

async function runBild() {
  await buildHTMLPage(pathToAssets, pathToProjectDistAssets);
  await changeTemplate();
}
runBild();
