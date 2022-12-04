var fs = require('fs');
var yargs = require('yargs');
var path = require('path');

var source = yargs.argv.source;
var destination = yargs.argv.destination;
var override = yargs.argv.override;

const createFolderIfNotExist = (filePath) => {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createFolderIfNotExist(dirname);
  fs.mkdirSync(dirname);
};

if (source && destination && fs.existsSync(source)) {
  if (!fs.existsSync(destination) || override) {
    createFolderIfNotExist(destination);
    fs.copyFileSync(source, destination);
    // eslint-disable-next-line no-console
    console.log(`Copied ${source} to ${destination}`);
  }
}
process.exit();
