const fs = require('fs');
const path = require('path');

const env = process.argv[2];

fs.copyFile(
  path.resolve(__dirname, `../environment/ind/environment.ind.${env}.js`),
  path.resolve(__dirname, '../environment/ind/environment.ind.js'),
  (err) => {
    if (err) {
      throw err;
    }
  },
);

fs.copyFile(
  path.resolve(__dirname, `../environment/sl/environment.sl.${env}.js`),
  path.resolve(__dirname, '../environment/sl/environment.sl.js'),
  (error) => {
    if (error) {
      throw error;
    }
  },
);
