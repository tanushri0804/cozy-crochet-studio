import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function finalFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix all remaining issues
  content = content
    .replace(/import \*from "react";/g, 'import React from "react";')
    .replace(/import \* as React from "react";/g, 'import React from "react";')
    .replace(/React\.forwardRef>/g, 'React.forwardRef(')
    .replace(/React\.forwardRef\(([^)]*)\s*\>\s*\{/g, 'React.forwardRef($1) => {')
    .replace(/React\.forwardRef<[^>]*>/g, 'React.forwardRef')
    .replace(/extends React\.[^,{]*,[^{]*{/g, '{')
    .replace(/export interface[^{]*\{[^}]*\}/gs, '')
    .replace(/: React\.[A-Za-z<>]+/g, '')
    .replace(/: ReactNode/g, '')
    .replace(/\?\s*:\s*[^;,}]+;/g, '')
    .replace(/HTMLButtonElement/g, '')
    .replace(/HTMLDivElement/g, '')
    .replace(/HTMLAnchorElement/g, '')
    .replace(/HTMLInputElement/g, '')
    .replace(/HTMLFormElement/g, '')
    .replace(/HTMLTextAreaElement/g, '')
    .replace(/HTMLLabelElement/g, '')
    .replace(/HTMLSpanElement/g, '')
    .replace(/<[^>]*\s+as\s*=\s*{[^}]+}>/g, (match) => match.replace(/type\s+/g, ''))
    .replace(/as\s+Child\?\s*:\s*boolean;/g, '')
    .replace(/asChild\s*=\s*false/g, 'asChild = false')
    .replace(/\s*>\s*\{/g, ' => {')
    .replace(/\s*>\s*\(/g, ' => (');

  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log(`Final fix: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      finalFix(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(path.join(__dirname, '../src'));
