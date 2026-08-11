const fs = require('fs');
const path = require('path');

const mappings = [
  { from: /\bEnterprise Scoreboard\b/gi, to: 'Mr. 360' },
  { from: /\bEnterprise Scorecard\b/gi, to: 'Mr. 360' },
  { from: /\bExecutive Director\b/g, to: 'District President' },
  { from: /\bExecutive Directors\b/g, to: 'District Presidents' },
  { from: /\bEXECUTIVE DIRECTOR\b/g, to: 'DISTRICT PRESIDENT' },
  { from: /\bChapter President\b/g, to: 'Unit Chairman' },
  { from: /\bChapter Presidents\b/g, to: 'Unit Chairmen' },
  { from: /\bVice President\b/g, to: 'Unit Vice Chairman' },
  { from: /\bVice Presidents\b/g, to: 'Unit Vice Chairmen' },
  { from: /\bVICE PRESIDENT\b/g, to: 'UNIT VICE CHAIRMAN' },
  { from: /\bSecretary\b/g, to: 'Co Ordinator' },
  { from: /\bSECRETARY\b/g, to: 'CO ORDINATOR' },
  { from: /\bSecretaries\b/g, to: 'Co Ordinators' },
  { from: /\bChapter\b/g, to: 'Unit' },
  { from: /\bChapters\b/g, to: 'Units' },
  { from: /\bCHAPTER\b/g, to: 'UNIT' },
  { from: /\bCHAPTERS\b/g, to: 'UNITS' },
  { from: /\bReferral\b/g, to: 'Connect' },
  { from: /\bReferrals\b/g, to: 'Connect' },
  { from: /\bREFERRAL\b/g, to: 'CONNECT' },
  { from: /\bREFERRALS\b/g, to: 'CONNECT' },
];

function isTechnical(str, index, content) {
  const prev10 = content.substring(Math.max(0, index - 10), index);
  const next10 = content.substring(index, index + str.length + 10);
  const before = content.charAt(index - 1);
  const after = content.charAt(index + str.length);
  
  if (before === '.' || after === '.' || before === '/' || after === '/') return true;
  if (before === '-' || after === '-' || before === '_' || after === '_') return true;
  
  let lineStart = content.lastIndexOf('\n', index);
  if (lineStart === -1) lineStart = 0;
  const line = content.substring(lineStart, index);
  if (line.includes('import ') || line.includes('from ')) return true;
  
  if (line.includes('url:') || line.includes('path:') || line.includes('axios')) return true;

  if (prev10.includes('ROLES.')) return true;
  
  // also handle standard camelCase things if they accidentally match
  if (before.match(/[a-zA-Z]/)) return true;
  if (after.match(/[a-zA-Z]/)) return true;

  return false;
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      let changed = false;

      // Special handling for Consultant roles
      let hasConsultant = false;
      if (newContent.includes('Launch Director') || newContent.includes('Direct Consultant')) {
        newContent = newContent.replace(/\bLaunch Director\b/g, '___TEMP_LAUNCH___');
        newContent = newContent.replace(/\bDirect Consultant\b/g, '___TEMP_DIRECT___');
        newContent = newContent.replace(/___TEMP_LAUNCH___/g, 'Direct Consultant');
        newContent = newContent.replace(/___TEMP_DIRECT___/g, 'Launch Director');
        changed = true;
      }

      for (const map of mappings) {
        let match;
        if (map.from.global) map.from.lastIndex = 0;
        
        let tempContent = '';
        let lastIdx = 0;
        let mapChanged = false;

        while ((match = map.from.exec(newContent)) !== null) {
          if (!isTechnical(match[0], match.index, newContent)) {
            tempContent += newContent.substring(lastIdx, match.index) + map.to;
            lastIdx = match.index + match[0].length;
            mapChanged = true;
          }
        }
        if (mapChanged) {
          tempContent += newContent.substring(lastIdx);
          newContent = tempContent;
          changed = true;
        }
      }

      const presRegex = /\bPresident\b/g;
      let tempContent = '';
      let lastIdx = 0;
      let mapChanged = false;
      let match;
      while ((match = presRegex.exec(newContent)) !== null) {
        if (!isTechnical(match[0], match.index, newContent)) {
           const beforeTxt = newContent.substring(Math.max(0, match.index - 15), match.index);
           if (!beforeTxt.endsWith('District ') && !beforeTxt.endsWith('Vice ') && !beforeTxt.endsWith('Unit ') && !beforeTxt.endsWith('CHAPTER_')) {
             tempContent += newContent.substring(lastIdx, match.index) + 'Unit Chairman';
             lastIdx = match.index + match[0].length;
             mapChanged = true;
           }
        }
      }
      if (mapChanged) {
        tempContent += newContent.substring(lastIdx);
        newContent = tempContent;
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}
walk(process.cwd());
