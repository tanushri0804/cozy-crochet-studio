import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove TypeScript types
  content = content
    .replace(/: React\.FC<[^>]+>/g, '')
    .replace(/: ReactNode/g, '')
    .replace(/\s*as\s+[^{\s]+\s*/g, '')
    .replace(/import\s+type\s+{[^}]+}\s+from\s+['"][^'"]+['"];?/g, '')
    .replace(/<[^>]+\s+as\s*=\s*{([^}]+)}/g, (_, p1) => ` as={${p1}}`);
  
  // Update file extension
  const newPath = filePath.replace(/\.tsx?$/, '.jsx');
  fs.writeFileSync(newPath, content);
  
  // Remove original file if different
  if (newPath !== filePath) {
    fs.unlinkSync(filePath);
  }
  
  console.log(`Converted: ${filePath} -> ${newPath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      convertFile(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(path.join(__dirname, '../src'));
