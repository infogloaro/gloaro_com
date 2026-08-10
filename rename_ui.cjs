const fs = require('fs');
const path = require('path');

const mappings = [
  { from: 'Operation Vice President', to: 'Operation Unit Vice Chairman' },
  { from: 'Executive Directors', to: 'District Presidents' },
  { from: 'Executive Director', to: 'District President' },
  { from: 'Vice Presidents', to: 'Unit Vice Chairmen' },
  { from: 'Vice President', to: 'Unit Vice Chairman' },
  { from: 'Presidents', to: 'Unit Chairmen' },
  { from: 'President', to: 'Unit Chairman' },
  { from: 'Secretaries', to: 'Coordinators' },
  { from: 'Secretary', to: 'Coordinator' },
  { from: 'Referrals', to: 'Connects' },
  { from: 'Referral', to: 'Connect' }
];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const originalContent = content;

  // We want to replace these mappings but ONLY in user-visible text.
  // 1. Inside JSX text: > ... <
  // Regex looks for >, then text without < or >, then <
  // Because JSX can be nested, we can just look for the words outside of tags.
  // Actually, a simpler way is to split the document into tag tokens and text tokens.
  
  let tokens = [];
  let currentToken = '';
  let inTag = false;
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (!inTag && char === '<' && i < content.length - 1 && content[i+1].match(/[a-zA-Z\/]/)) {
      if (currentToken) tokens.push({ type: 'text', value: currentToken });
      currentToken = '<';
      inTag = true;
    } else if (inTag && char === '>' && !inQuotes) {
      currentToken += '>';
      tokens.push({ type: 'tag', value: currentToken });
      currentToken = '';
      inTag = false;
    } else if (inTag && (char === '"' || char === "'")) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
        currentToken += char;
      } else if (inQuotes && quoteChar === char) {
        inQuotes = false;
        quoteChar = '';
        currentToken += char;
      } else {
        currentToken += char;
      }
    } else {
      currentToken += char;
    }
  }
  if (currentToken) tokens.push({ type: inTag ? 'tag' : 'text', value: currentToken });

  // Now process tokens
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    
    if (token.type === 'text') {
      // It's a JSX text node or regular JS code outside tags.
      // Wait, in JS code outside tags, it could be a variable.
      // E.g. const Referral = ...
      // So we must be careful. We only replace whole words.
      // But we shouldn't replace variable names.
      // How do we distinguish? We only replace if the word is NOT part of a CamelCase or PascalCase identifier?
      // Actually, variable names are usually matched by \b. "Referral" might be a variable "Referral".
      // But "Referral " with a space is text.
      // Let's just use string literal replacement and JSX text replacement.
      // The tokens split above assumes HTML-like tags, which is fine for JSX, but in normal JS, `<` is just less-than.
      // Let's refine the approach: Regex over the whole file, but with negative lookaheads/lookbehinds.
    }
  }
}

// Alternative approach: Regex with context.
// Replace in string literals (single, double, backtick) AND JSX Text.

function safeReplace(content) {
  let newContent = content;

  for (const { from, to } of mappings) {
    // 1. Replace inside JSX text nodes (heuristically: between > and <)
    // We can use a replacer function to only replace if we are not inside a tag.
    // Instead of parsing, we can find the words and check their context.
  }
}

// Let's use a simpler regex that matches the word, and checks if it's safe to replace.
function advancedReplace(content, fileName) {
  let result = content;
  
  for (const { from, to } of mappings) {
    const regex = new RegExp(`\\b${from}\\b(?!\\w)`, 'g');
    
    result = result.replace(regex, (match, offset, string) => {
      // Check surrounding context
      const before = string.substring(0, offset);
      const after = string.substring(offset + match.length);
      
      // If it's a route path: /referrals
      if (before.match(/\/[-a-zA-Z0-9]*$/)) return match;
      
      // If it's a URL or file path: ./Referrals
      if (before.match(/['"`/][-a-zA-Z0-9./]*$/)) {
          // It could be a display string like "Referrals" or a path like "./Referrals".
          // If it starts with ./ or /, it's a path
          if (before.match(/(^|[\s=])['"`](\.[./]|\/)/)) return match;
      }
      
      // If it's inside an import statement
      if (before.match(/import\s+[^;]*$/)) return match;
      
      // If it's a component name (e.g. <Referral or </Referral)
      if (before.match(/<\/?$/)) return match;
      
      // If it's a variable declaration or function name: `const Referral` or `class Referral`
      if (before.match(/(const|let|var|class|function)\s+$/)) return match;
      
      // If it's an object property key: `Referral: `
      if (after.match(/^\s*:/)) return match;
      
      // If it's a member access: `.Referral`
      if (before.match(/\.$/)) return match;
      
      // If it's a className attribute
      if (before.match(/className\s*=\s*['"`][^'"`]*$/)) return match;

      // If it's a permission or module or section or name string
      // module: 'referrals', name="Referral"
      if (before.match(/(module|section|name|id|value|path)\s*(:|=)\s*['"`][^'"`]*$/)) return match;

      // Also protect camelCase variables where the match is the first part, e.g. ReferralId
      if (after.match(/^[A-Z][a-zA-Z]/)) return match; 
      
      // For "Referral", check if it's part of a PascalCase name like "MembershipReferralPage"
      if (before.match(/[a-zA-Z]$/)) return match; // preceding letter means it's part of a word

      // Protect exact ROLES enum values
      if (before.match(/ROLES\.$/)) return match;
      
      // If it's a parameter in a route or something: path="/customer/referral"
      if (before.match(/path\s*=\s*['"`][^'"`]*$/)) return match;

      // Okay, it seems safe to replace
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
  const newContent = advancedReplace(content, file);
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    
    // Count replacements manually for reporting
    let diffCount = 0;
    mappings.forEach(m => {
       const fromCount = (content.match(new RegExp(`\\b${m.from}\\b`, 'g')) || []).length;
       const toCount = (newContent.match(new RegExp(`\\b${m.from}\\b`, 'g')) || []).length;
       diffCount += (fromCount - toCount);
    });
    totalReplacements += diffCount;
    console.log(`Modified: ${file}`);
  }
});

console.log(`\nDONE. Files modified: ${changedFiles}. Total UI text replacements: ${totalReplacements}`);
