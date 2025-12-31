import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ultimateFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ultimate fix for all remaining issues
  content = content
    // Fix double arrow in function definitions
    .replace(/(\w+)\s*=\s*>\s*=>\s*/g, '$1 = () => ')
    // Fix JSX comments inside tags
    .replace(/(\w+)>\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, '$1> {/* $2 */}')
    // Fix JSX comments after closing tags
    .replace(/<\/(\w+)>\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, '</$1> {/* $2 */}')
    // Fix broken JSX with comments in attributes
    .replace(/className="([^"]*)"\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, 'className="$1" {/* $2 */}')
    // Fix broken JSX self-closing tags with comments
    .replace(/(\w+)\s*{\/\*\s*(.*?)\s*\*\/\s*}\/>/g, '$1 /> {/* $2 */}')
    // Fix broken map functions
    .replace(/\.map\(([^)]*)\s*=\s*>\s*/g, '.map(($1) => ')
    // Fix broken ternary operators
    .replace(/\?\s*>\s*/g, '? > ')
    // Fix broken inline functions
    .replace(/onClick=\{\(\)\s*=\s*>\s*/g, 'onClick={() => ')
    .replace(/onChange=\{([^)]*)\s*=\s*>\s*/g, 'onChange={$1 => ')
    // Fix broken useEffect
    .replace(/useEffect\(\s*=\s*>\s*/g, 'useEffect(() => ')
    // Fix broken forwardRef
    .replace(/React\.forwardRef\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'React.forwardRef(({ $1 }) => ')
    // Fix broken component exports
    .replace(/export const (\w+)\s*=\s*\(\s*\)\s*=\s*>\s*/g, 'export const $1 = () => ')
    // Fix broken component definitions
    .replace(/const (\w+)\s*=\s*\(\s*\)\s*=\s*>\s*/g, 'const $1 = () => ')
    // Fix broken JSX with inline expressions
    .replace(/\{(\w+)\s*=\s*>\s*/g, '{$1 => ')
    // Fix broken closing tags
    .replace(/<\/(\w+)(\s*=>\s*{\/\*[^}]*\*\/\s*})/g, '</$1>$2')
    // Fix any remaining broken JSX
    .replace(/(\w+)\s*=>\s*<\/(\w+)>/g, '</$2>')
    .replace(/(\w+)\s*=>\s*<(\w+)/g, '<$2')
    // Fix broken comments in JSX
    .replace(/{\s*\/\*\s*(.*?)\s*\*\/\s*=>/g, '{/* $1 */}')
    // Fix broken self-closing tags
    .replace(/(\w+)\s*=>\s*\/>/g, '$1 />')
    // Fix broken opening tags with attributes
    .replace(/<(\w+[^>]*)\s*=>\s*([^>]*)>/g, '<$1 $2>')
    // Fix any remaining double arrows
    .replace(/\s*=\s*>\s*=>\s*/g, ' => ')
    // Fix broken JSX expressions
    .replace(/{([^}]*)\s*=\s*>\s*([^}]*)}/g, '{$1 => $2}')
    // Fix broken conditional rendering
    .replace(/\&\&\s*=>/g, '&& >')
    // Fix broken logical expressions
    .replace(/\|\|\s*=>/g, '|| >');

  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log(`Ultimate fix: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      ultimateFix(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(path.join(__dirname, '../src'));
