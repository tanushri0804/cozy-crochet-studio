import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function finalCleanup(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Final cleanup of any remaining issues
  content = content
    // Fix any remaining broken JSX
    .replace(/(\w+)\s*=>\s*<\//g, '</')
    .replace(/(\w+)\s*=>\s*<(\w+)/g, '<$2')
    // Fix broken comments
    .replace(/{\s*\/\*\s*(.*?)\s*\*\/\s*=>/g, '{/* $1 */}')
    .replace(/{\s*\/\*\s*(.*?)\s*\*\/\s*=>\s*}/g, '{/* $1 */}')
    // Fix broken self-closing tags
    .replace(/(\w+)\s*=>\s*\/>/g, '$1 />')
    // Fix broken opening tags
    .replace(/<(\w+[^>]*)\s*=>\s*([^>]*)>/g, '<$1 $2>')
    // Fix broken closing tags
    .replace(/(\w+)\s*=>\s*<\/(\w+)>/g, '</$2>')
    // Fix broken map functions
    .replace(/\.map\(([^)]*)\s*=\s*>\s*/g, '.map(($1) => ')
    // Fix broken ternary operators in JSX
    .replace(/\?\s*>\s*/g, '? > ')
    // Fix any remaining double arrows
    .replace(/\s*=\s*>\s*=>\s*/g, ' => ')
    // Fix broken component exports
    .replace(/export const (\w+)\s*=\s*\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'export const $1 = ({ $2 }) => ')
    // Fix broken function definitions
    .replace(/const (\w+)\s*=\s*\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'const $1 = ({ $2 }) => ')
    // Fix broken useEffect
    .replace(/useEffect\(\s*=\s*>\s*/g, 'useEffect(() => ')
    // Fix broken forwardRef
    .replace(/React\.forwardRef\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'React.forwardRef(({ $1 }) => ')
    // Fix broken inline functions
    .replace(/onClick=\{\(\)\s*=\s*>\s*/g, 'onClick={() => ')
    .replace(/onChange=\{\([^)]*\)\s*=\s*>\s*/g, 'onChange={($1) => ');

  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log(`Final cleanup: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      finalCleanup(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(path.join(__dirname, '../src'));
