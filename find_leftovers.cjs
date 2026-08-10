const fs = require('fs');
const path = require('path');

const terms = [
  'Operation Vice President',
  'Executive Directors', 'Executive Director',
  'Vice Presidents', 'Vice President',
  'Presidents', 'President',
  'Secretaries', 'Secretary',
  'Referrals', 'Referral'
];

function isSafeMatch(before, after, match) {
  // Routes and URLs
  if (before.match(/\/[-a-zA-Z0-9]*$/)) return true;
  if (before.match(/['"`/][-a-zA-Z0-9./]*$/) && before.match(/(^|[\s=])['"`](\.[./]|\/)/)) return true;
  
  // Imports
  if (before.match(/import\s+[^;]*$/)) return true;
  
  // Component names `<Referral`
  if (before.match(/<\/?$/)) return true;
  
  // Variables `const Referral`
  if (before.match(/(const|let|var|class|function)\s+$/)) return true;
  
  // Object property `Referral: `
  if (after.match(/^\s*:/)) return true;
  
  // Member access `.Referral`
  if (before.match(/\.$/)) return true;
  
  // className="...Referral..."
  if (before.match(/className\s*=\s*['"`][^'"`]*$/)) return true;

  // Permissions / modules / path / name / id / value
  if (before.match(/(module|section|name|id|value|path)\s*(:|=)\s*['"`][^'"`]*$/)) return true;
  
  // CamelCase protection
  if (after.match(/^[A-Z][a-zA-Z]/)) return true;
  if (before.match(/[a-zA-Z]$/)) return true;

  // ROLES Enum
  if (before.match(/ROLES\.$/)) return true;

  // Route paths
  if (before.match(/path\s*=\s*['"`][^'"`]*$/)) return true;

  // File paths in imports or require
  if (before.match(/(import|require)\s*\(\s*['"`][^'"`]*$/)) return true;

  return false;
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);
let found = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  terms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b(?!\\w)`, 'g');
    let match;
    while ((match = regex.exec(content)) !== null) {
      const offset = match.index;
      const before = content.substring(0, offset);
      const after = content.substring(offset + match[0].length);
      
      if (!isSafeMatch(before, after, match[0])) {
        const lines = before.split('\n');
        const lineNumber = lines.length;
        const lineContent = content.split('\n')[lineNumber - 1].trim();
        found.push({ file: file.replace(__dirname, ''), line: lineNumber, term: match[0], content: lineContent });
      }
    }
  });
});

console.log(JSON.stringify(found, null, 2));
