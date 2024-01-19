const fs = require('fs');
const path = require('path');

function ctreateFileandWrite() {
  const { stdin, stdout } = process;
  stdout.write('Hello, user, write some text, please!\n');

  // Создание и очистка файла при запуске программы
  fs.truncate(`${__dirname}/text.txt`, 0, (error) => {
    if (error) {
      fs.writeFile(`${__dirname}/text.txt`, '', (error) => {
        if (error) {
          console.log(error);
          return;
        }
      });
    }
  });

  stdin.on('data', (data) => {
    const input = data.toString().trim();
    if (input === 'exit') {
      process.exit();
    } else {
      fs.writeFile(
        `${__dirname}/text.txt`,
        input + '\n',
        { flag: 'a' },
        (error) => {
          if (error) {
            console.log(error);
            return;
          }
        },
      );
    }
  });

  process.on('SIGINT', () => {
    process.exit();
  });

  process.on('exit', () => {
    stdout.write('Bye, user! Have a nice day!\n');
  });
}
ctreateFileandWrite();
