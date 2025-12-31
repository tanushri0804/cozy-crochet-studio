import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixUIComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix UI component issues
  content = content
    // Fix import statements
    .replace(/import \*from "([^"]+)";/g, 'import * as $1 from "$1";')
    .replace(/import \* as React from "react";/g, 'import React from "react";')
    // Fix forwardRef syntax
    .replace(/React\.forwardRef,\s*React\.ComponentPropsWithoutRef<([^>]+)>\s*=>\s*\(/g, 'React.forwardRef(')
    .replace(/React\.forwardRef,\s*React\.ComponentPropsWithoutRef<([^>]+)>\s*=>\s*\(([^)]*)\)\s*=\s*>\s*/g, 'React.forwardRef(($2) => ')
    // Fix broken forwardRef calls
    .replace(/React\.forwardRef\(\s*\{([^}]*)\}\s*\)\s*=\s*>\s*/g, 'React.forwardRef(({ $1 }) => ')
    // Fix broken JSX in forwardRef
    .replace(/\{\.\.\.props\}\s*=>\s*{([^}]*)}/g, '{...props}>{$1}')
    // Fix broken arrow functions
    .replace(/\s*=\s*>\s*=>\s*/g, ' => ')
    .replace(/\(\s*\)\s*=\s*>\s*/g, '() => ')
    // Fix broken JSX expressions
    .replace(/\{([^}]*)\s*=>\s*([^}]*)}/g, '{$1 => $2}')
    // Fix broken JSX children
    .replace(/\{\.\.\.props\}\s*=>\s*{([^}]*)}/g, '{...props}>{$1}')
    .replace(/\{\.\.\.props\}\s*=>\s*{([^}]*)}/g, '{...props}>{$1}')
    .replace(/\{\.\.\.props\}\s*=>\s*{([^}]*)}/g, '{...props}>{$1}')
    // Fix broken div children
    .replace(/<div className={cn\([^)]+\)}\s*=>\s*{([^}]*)}<\/div>/g, '<div className={cn($1)}>{$2}</div>')
    // Fix any remaining broken JSX
    .replace(/\{([^}]*)\s*=>\s*([^}]*)}/g, '{$1 => $2}')
    // Fix broken ComponentPropsWithoutRef
    .replace(/React\.ComponentPropsWithoutRef<([^>]+)>/g, '')
    // Fix duplicate React imports
    .replace(/import React from "react";\s*import React from "react";/g, 'import React from "react";')
    // Fix broken export statements
    .replace(/export \{ [^}]+\};\s*export \{ [^}]+\};/g, (match) => match.split('\n')[0]);

  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log(`Fixed UI component: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      fixUIComponent(fullPath);
    }
  });
}

// Start processing from ui directory
processDirectory(path.join(__dirname, '../src/components/ui'));
