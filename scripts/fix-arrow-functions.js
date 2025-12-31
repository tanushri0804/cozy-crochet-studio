import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixArrowFunctions(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix broken arrow function syntax
  content = content
    // Fix = > to =>
    .replace(/\s*=\s*>\s*/g, ' => ')
    // Fix = > => to =>
    .replace(/\s*=\s*>\s*=>\s*/g, ' => ')
    // Fix = => => to =>
    .replace(/\s*=\s*=>\s*=>\s*/g, ' => ')
    // Fix JSX closing tags with broken syntax
    .replace(/(\w+)\s*=>\s*<\/(\w+)>/g, (match, openTag, closeTag) => {
      if (openTag === closeTag) {
        return `</${closeTag}>`;
      }
      return match;
    })
    // Fix broken JSX self-closing tags
    .replace(/(\w+)\s*=>\s*\/>/g, ' />')
    // Fix broken JSX opening tags
    .replace(/<(\w+[^>]*)\s*=>\s*([^>]*)>/g, '<$1 $2>')
    // Fix broken comments
    .replace(/{\s*\/\*\s*(.*?)\s*\*\/\s*=>/g, '{/* $1 */')
    // Fix broken map functions
    .replace(/\.map\(([^)]*)\s*=\s*>\s*/g, '.map(($1) => ')
    // Fix broken useEffect
    .replace(/useEffect\(\s*=\s*>\s*/g, 'useEffect(() => ')
    // Fix broken forwardRef
    .replace(/forwardRef\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'forwardRef(({ $1 }) => ')
    // Fix broken component definitions
    .replace(/const\s+(\w+)\s*=\s*\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'const $1 = ({ $2 }) => ')
    // Fix broken ternary operators
    .replace(/\?\s*>\s*/g, '? > ');

  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log(`Fixed arrow functions: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      fixArrowFunctions(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(path.join(__dirname, '../src'));
