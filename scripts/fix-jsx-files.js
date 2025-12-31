import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixJSXFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix import statements
  content = content
    .replace(/import \* from "react";/g, 'import React from "react";')
    .replace(/import \* as React from "react";/g, 'import React from "react";')
    .replace(/import { cva, type VariantProps } from "class-variance-authority";/g, 'import { cva } from "class-variance-authority";')
    .replace(/import { type VariantProps } from "class-variance-authority";/g, '')
    .replace(/import { type[^}]*} from "[^"]+";/g, '')
    .replace(/, type VariantProps/g, '')
    .replace(/type VariantProps[^,]*,/g, '')
    .replace(/: VariantProps<[^>]+>/g, '')
    .replace(/extends React\.[^,{]+,/g, '')
    .replace(/React\.forwardRef<[^>]+>/g, 'React.forwardRef')
    .replace(/export interface[^{]*\{[^}]*\}/gs, '')
    .replace(/: React\.[A-Za-z<>]+/g, '')
    .replace(/: ReactNode/g, '')
    .replace(/<[^>]*\s+as\s*=\s*{[^}]+}>/g, (match) => match.replace(/type\s+/g, ''))
    .replace(/as\s+Child\?\s*:\s*boolean;/g, '')
    .replace(/asChild\s*=\s*false/g, 'asChild = false')
    .replace(/HTMLButtonElement/g, '')
    .replace(/HTMLDivElement/g, '')
    .replace(/HTMLAnchorElement/g, '');

  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      fixJSXFile(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(path.join(__dirname, '../src'));
