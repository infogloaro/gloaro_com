const fs = require('fs');
const path = require('path');

const mappings = [
  { from: 'Referral Management', to: 'Connect Management' },
  { from: 'Referral Tracking', to: 'Connect Tracking' },
  { from: 'Referral Code', to: 'Connect Code' },
  { from: 'Personal Referral', to: 'Personal Connect' },
  { from: 'All Referrals', to: 'All Connects' },
  { from: 'My Referrals', to: 'My Connects' },
  { from: 'Referrals', to: 'Connects' },
  { from: 'Referral', to: 'Connect' },
  { from: 'Operation Vice President', to: 'Operation Unit Vice Chairman' },
  { from: 'Executive Directors', to: 'District Presidents' },
  { from: 'Executive Director', to: 'District President' },
  { from: 'Vice Presidents', to: 'Unit Vice Chairmen' },
  { from: 'Vice President', to: 'Unit Vice Chairman' },
  { from: 'Presidents', to: 'Unit Chairmen' },
  { from: 'President', to: 'Unit Chairman' },
  { from: 'Secretaries', to: 'Coordinators' },
  { from: 'Secretary', to: 'Coordinator' }
];

function isSafeMatch(before, after, match) {
  // Check if it's a route definition like `/referrals`
  if (before.match(/\/[-a-zA-Z0-9]*$/i) && match.toLowerCase() === match) return true;
  if (before.match(/\/[-a-zA-Z0-9]*$/i)) {
      // If it's something like /president, don't replace "president"
      return true;
  }
  
  // ROLES enum
  if (before.includes('ROLES.')) return true;
  
  // Variables or imports (e.g. import President from, class President)
  if (before.match(/(import|class|const|let|var|function)\s+$/)) return true;
  
  // Component JSX Tag `<President` or `</President>`
  if (before.match(/<\/?$/)) return true;

  // File paths in requires/imports
  if (before.match(/(from|import|require)\s*\(\s*['"`][^'"`]*$/)) return true;
  
  // Object Keys: `referral:`
  if (after.match(/^\s*:/)) return true;
  
  // Ensure it's not part of a larger camelCase or PascalCase identifier
  // e.g. `isPresident` or `PresidentDashboard`
  if (after.match(/^[A-Z][a-zA-Z]/)) return true;
  if (before.match(/[a-zA-Z]$/)) return true;

  // Don't replace if it's exactly 'president' (lowercase) or 'executive_director'
  // Actually, our matches are exact case, so 'president' won't match 'President'
  
  return false;
}

function advancedReplace(content) {
  let result = content;
  
  for (const { from, to } of mappings) {
    const regex = new RegExp(`\\b${from}\\b`, 'g');
    
    result = result.replace(regex, (match, offset, string) => {
      const before = string.substring(0, offset);
      const after = string.substring(offset + match.length);
      
      if (isSafeMatch(before, after, match)) {
        return match;
      }
      return to;
    });
  }
  return result;
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
let changedFiles = 0;
let totalReplacements = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = advancedReplace(content);
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log(`Modified: ${file.replace(__dirname, '')}`);
  }
});

console.log(`\nDONE. Files modified: ${changedFiles}.`);
