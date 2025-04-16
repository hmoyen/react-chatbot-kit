const fs = require('fs-extra');
const path = require('path');

// Source directory of your assets
const sourceDir = path.join(__dirname, 'assets');
const publicDir = path.join(__dirname, 'public');

// Ensure public directory exists
fs.ensureDirSync(publicDir);

// Create font directories
fs.ensureDirSync(path.join(publicDir, 'fonts'));
fs.ensureDirSync(path.join(publicDir, 'icons'));
fs.ensureDirSync(path.join(publicDir, 'images'));

// Copy fonts from assets to public
if (fs.existsSync(path.join(sourceDir, 'fonts'))) {
  fs.copySync(
    path.join(sourceDir, 'fonts'), 
    path.join(publicDir, 'fonts')
  );
  console.log('Fonts copied successfully!');
} else {
  console.log('Font source directory not found!');
}

// Copy icons from assets to public 
if (fs.existsSync(path.join(sourceDir, 'icons'))) {
  fs.copySync(
    path.join(sourceDir, 'icons'), 
    path.join(publicDir, 'icons')
  );
  console.log('Icons copied successfully!');
} else {
  console.log('Icons source directory not found!');
}

// Copy images from assets to public
if (fs.existsSync(path.join(sourceDir, 'images'))) {
  fs.copySync(
    path.join(sourceDir, 'images'), 
    path.join(publicDir, 'images')
  );
  console.log('Images copied successfully!');
} else {
  console.log('Images source directory not found!');
}

console.log('All assets copied to public directory!');
