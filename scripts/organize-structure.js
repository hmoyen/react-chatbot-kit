const fs = require('fs-extra');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const examplesDir = path.join(projectRoot, 'examples');
const chatbotInterfaceDir = path.join(projectRoot, 'chatbotinterface');

// Create new structure
fs.ensureDirSync(chatbotInterfaceDir);
fs.ensureDirSync(path.join(chatbotInterfaceDir, 'components'));
fs.ensureDirSync(path.join(chatbotInterfaceDir, 'styles'));
fs.ensureDirSync(path.join(chatbotInterfaceDir, 'services'));

// Copy files with adjusted imports
console.log('Organizing project structure...');

// Copy everything first
if (fs.existsSync(examplesDir)) {
  fs.copySync(examplesDir, chatbotInterfaceDir);
  
  // Move CSS files to styles directory
  const componentsDir = path.join(chatbotInterfaceDir, 'components');
  fs.readdirSync(componentsDir).forEach(file => {
    if (file.endsWith('.css')) {
      fs.moveSync(
        path.join(componentsDir, file),
        path.join(chatbotInterfaceDir, 'styles', file)
      );
    }
  });
  
  // Move service files to services directory
  fs.moveSync(
    path.join(chatbotInterfaceDir, 'treeService.js'),
    path.join(chatbotInterfaceDir, 'services', 'treeService.js')
  );
  
  // Move core files to components
  ['MessageParser.js', 'ActionProvider.js', 'Loader.js', 'TypedReact.js'].forEach(file => {
    if (fs.existsSync(path.join(chatbotInterfaceDir, file))) {
      fs.moveSync(
        path.join(chatbotInterfaceDir, file),
        path.join(chatbotInterfaceDir, 'components', file)
      );
    }
  });
  
  console.log('Project structure organized successfully!');
} else {
  console.error('Examples directory does not exist!');
}
