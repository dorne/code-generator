const copydir = require('copy-dir');
const path = require('path');
const fs = require('fs');
const homedir = require('os').homedir();

const appUserPath = path.join(homedir, '/code-generator');

if (!fs.existsSync(appUserPath)) {
  fs.mkdirSync(appUserPath);
}

copydir(
  path.join(__dirname, '/public/resources'),
  appUserPath,
  {
    utimes: true, // keep add time and modify time
    mode: true, // keep file mode
    cover: true, // cover file when exists, default is true
  },
  function (err) {
    if (err) throw err;
    console.log('copy success');
  },
);
