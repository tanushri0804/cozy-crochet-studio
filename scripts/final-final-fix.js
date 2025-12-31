import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function finalFinalFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Final fix for all remaining issues
  content = content
    // Fix all arrow function issues
    .replace(/\s*=\s*>\s*=>\s*/g, ' => ')
    .replace(/\(\s*\)\s*=\s*>\s*/g, '() => ')
    .replace(/\(\s*{([^}]*)}\s*\)\s*=\s*>\s*/g, '({ $1 }) => ')
    // Fix useEffect
    .replace(/useEffect\(\s*=\s*>\s*/g, 'useEffect(() => ')
    // Fix map functions
    .replace(/\.map\(([^)]*)\s*=\s*>\s*/g, '.map(($1) => ')
    // Fix inline functions
    .replace(/onClick=\{\(\)\s*=\s*>\s*/g, 'onClick={() => ')
    .replace(/onChange=\{([^)]*)\s*=\s*>\s*/g, 'onChange={$1 => ')
    // Fix forwardRef
    .replace(/React\.forwardRef\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'React.forwardRef(({ $1 }) => ')
    // Fix component definitions
    .replace(/export const (\w+)\s*=\s*\(\s*{([^}]*)}\s*\)\s*=\s*>\s*/g, 'export const $1 = ({ $2 }) => ')
    .replace(/const (\w+)\s*=\s*\(\s*{([^}]*)}\s*\)\s*=\s*>\s*/g, 'const $1 = ({ $2 }) => ')
    // Fix JSX comments
    .replace(/{\s*\/\*\s*(.*?)\s*\*\/\s*=>/g, '{/* $1 */}')
    // Fix broken JSX tags
    .replace(/(\w+)>\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, '$1> {/* $2 */}')
    .replace(/<\/(\w+)>\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, '</$1> {/* $2 */}')
    // Fix broken self-closing tags
    .replace(/(\w+)\s*{\/\*\s*(.*?)\s*\*\/\s*}\/>/g, '$1 /> {/* $2 */}')
    // Fix broken JSX attributes
    .replace(/className="([^"]*)"\s*{\/\*\s*(.*?)\s*\*\/\s*}/g, 'className="$1" {/* $2 */}')
    // Fix broken ternary operators
    .replace(/\?\s*>\s*/g, '? > ')
    // Fix broken conditional rendering
    .replace(/\&\&\s*=>/g, '&&')
    .replace(/\|\|\s*=>/g, '||')
    // Fix broken JSX expressions
    .replace(/{([^}]*)\s*=\s*>\s*([^}]*)}/g, '{$1 => $2}')
    // Fix any remaining broken JSX
    .replace(/(\w+)\s*=>\s*<\/(\w+)>/g, '</$2>')
    .replace(/(\w+)\s*=>\s*<(\w+)/g, '<$2')
    // Fix broken setTimeout
    .replace(/setTimeout\(\s*\(\)\s*=\s*>\s*/g, 'setTimeout(() => ')
    // Fix broken array methods
    .replace(/Array\.from\(\s*{([^}]*)}\s*\)\.map\(\s*\([^)]*\)\s*=\s*>\s*/g, 'Array.from({ $1 }).map(($2) => ')
    // Fix any remaining issues
    .replace(/\s*=\s*>\s*=>\s*/g, ' => ')
    .replace(/\s*=\s*>\s*/g, ' => ');

  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log(`Final final fix: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      finalFinalFix(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(path.join(__dirname, '../src'));
