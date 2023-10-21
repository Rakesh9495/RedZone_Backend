const fs = require("fs");
const UPLOAD_FILE_DIRECTORY = "./Downloads/";

async function readDownloadsReels() {
  let files = [];
  let uniqueFiles = [];
  fs.readdir(UPLOAD_FILE_DIRECTORY, function (err, temp_files) {
    if (err) {
      console.log("Something went wrong...");
      return console.error(err);
    }
    for (let i = 0; i < temp_files.length; i++) {
      files.push(temp_files[i]);
      console.log(temp_files);
    }

    console.log("before ::  " + files);
    files = files.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0], 10);
      const numB = parseInt(b.match(/\d+/)[0], 10);

      return numA - numB;
    });

    for (let i = 0; i < files.length; i++) {
      if (uniqueFiles.indexOf(files[i]) === -1) {
        uniqueFiles.push(files[i]);
      }
    }

    console.log("files ::  " + files);
    console.log("uniqueFiles ::  " + uniqueFiles);
  });

  return uniqueFiles;
}

exports.readDownloadsReels = readDownloadsReels;
