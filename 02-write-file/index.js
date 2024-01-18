const fs = require('fs');
const path = require('path');

function ctreateFileandWrite() {
  const { stdin, stdout } = process;
  stdout.write('Hello, user, write some text, please!\n');

  // Очистить файл при запуске программы
  fs.truncate(`${__dirname}/text.txt`, 0, () => {});

  stdin.on('data', (data) => {
    const input = data.toString().trim();
    if (input === 'exit') {
      process.exit();
    } else {
      fs.writeFile(
        `${__dirname}/text.txt`,
        input + '\n',
        { flag: 'a' },
        (err) => {
          if (err) {
            console.log(err);
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
