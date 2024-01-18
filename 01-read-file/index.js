const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

function readFile(filePath) {
  const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  readStream.on('data', (chunk) => {
    console.log(chunk);
  });

  readStream.on('error', (err) => {
    console.error(err);
  });
}
readFile(filePath);
