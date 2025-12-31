import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixJSXSyntax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix JSX syntax issues
  content = content
    // Fix double arrow in function definitions
    .replace(/(\w+)\s*=\s*>\s*=>\s*/g, '$1 = () => ')
    // Fix JSX comments
    .replace(/{\s*\/\*\s*(.*?)\s*\*\/\s*=>/g, '{/* $1 */}')
    // Fix JSX closing tags with broken syntax
    .replace(/<\/(\w+)\s*=>/g, '</$1>')
    // Fix JSX self-closing tags
    .replace(/(\w+)\s*=>\s*\/>/g, '$1 />')
    // Fix broken JSX attributes
    .replace(/className="([^"]*)"\s*=>\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, 'className="$1" /* $2 */')
    // Fix broken JSX opening tags
    .replace(/<(\w+[^>]*)\s*=>\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, '<$1 /* $2 */')
    // Fix broken closing tags after components
    .replace(/<\/(\w+)\s*=>\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, '</$1> /* $2 */')
    // Fix broken map functions
    .replace(/\.map\(([^)]*)\s*=\s*>\s*/g, '.map(($1) => ')
    // Fix broken ternary operators
    .replace(/\?\s*>\s*/g, '? > ')
    // Fix broken inline functions
    .replace(/onClick=\{\(\)\s*=\s*>\s*/g, 'onClick={() => ')
    // Fix broken useEffect
    .replace(/useEffect\(\s*=\s*>\s*/g, 'useEffect(() => ')
    // Fix broken forwardRef
    .replace(/React\.forwardRef\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'React.forwardRef(({ $1 }) => ')
    // Fix broken component exports
    .replace(/export const (\w+)\s*=\s*\(\s*\)\s*=\s*>\s*/g, 'export const $1 = () => ')
    // Fix broken component definitions
    .replace(/const (\w+)\s*=\s*\(\s*\)\s*=\s*>\s*/g, 'const $1 = () => ')
    // Fix broken JSX with comments inside
    .replace(/(\w+)>\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, '$1> /* $2 */')
    // Fix broken closing tags with comments
    .replace(/<\/(\w+)(\s*=>\s*{\/\*[^}]*\*\/\s*})/g, '</$1>$2')
    // Fix any remaining = > =>
    .replace(/\s*=\s*>\s*=>\s*/g, ' => ');

  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log(`Fixed JSX syntax: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      fixJSXSyntax(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(path.join(__dirname, '../src'));
