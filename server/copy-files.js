const ncp = require('ncp').ncp;
const path = require('path');

// Define the source and destination directories
const sourceDir = path.join(__dirname, 'uploads');
const destDir = path.join(__dirname, 'dist');

// Copy the uploads and templates directories and their contents
ncp(sourceDir, path.join(destDir, 'uploads'), function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Uploads folder copied successfully!');
});

ncp(path.join(__dirname, 'templates'), path.join(destDir, 'templates'), function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Templates folder copied successfully!');
});