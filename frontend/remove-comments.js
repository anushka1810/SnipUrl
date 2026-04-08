const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Remove JSX comments {/* ... */}
            content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
            
            // Remove multi-line comments /* ... */
            content = content.replace(/\/\*[\s\S]*?\*\//g, '');
            
            // Remove single line comments // ... that have whitespace or ^ before them
            content = content.replace(/(?<=^|\n|[ \t])\/\/.*/g, '');
            
            // Strip multiple empty lines
            content = content.replace(/\n\s*\n/g, '\n\n');
            
            fs.writeFileSync(fullPath, content);
        }
    });
}

const frontendSrcPath = path.join(__dirname, 'src');
const backendPath = path.join(__dirname, '..', 'backend');

console.log("Cleaning frontend src:", frontendSrcPath);
processDir(frontendSrcPath);

console.log("Cleaning backend:", backendPath);
processDir(backendPath);

console.log("Comments removed.");
