const fs = require('fs');
const path = require('path');

const mappings = {
  'Referral Management': 'Connect Management',
  'Referral Tracking': 'Connect Tracking',
  'Referral Code': 'Connect Code',
  'Personal Referral': 'Personal Connect',
  'All Referrals': 'All Connects',
  'My Referrals': 'My Connects',
  'Referrals': 'Connects',
  'Referral': 'Connect',
  'Operation Vice President': 'Operation Unit Vice Chairman',
  'Executive Directors': 'District Presidents',
  'Executive Director': 'District President',
  'Vice Presidents': 'Unit Vice Chairmen',
  'Vice President': 'Unit Vice Chairman',
  'Presidents': 'Unit Chairmen',
  'President': 'Unit Chairman',
  'Secretaries': 'Coordinators',
  'Secretary': 'Coordinator'
};

const audit = JSON.parse(fs.readFileSync('audit.json', 'utf8'));

// Group by file
const files = {};
audit.forEach(item => {
  if (!files[item.file]) files[item.file] = [];
  files[item.file].push(item);
});

Object.keys(files).forEach(fileKey => {
  const filePath = path.join(__dirname, fileKey);
  if (!fs.existsSync(filePath)) return;
  
  let contentLines = fs.readFileSync(filePath, 'utf8').split('\n');
  let changed = false;
  
  files[fileKey].forEach(item => {
    const lineIndex = item.line - 1;
    let lineContent = contentLines[lineIndex];
    
    // We want to replace the term in this line.
    // Be careful to replace only the user-visible parts if it contains code.
    // Since we know these were missed due to strict rules, let's do a simple regex replace
    // on the term, but making sure we don't accidentally replace a route like /referrals
    
    // We only replace if it's not preceded by a slash or dot (to protect paths/imports)
    const regex = new RegExp(`(?<![/\\.])${item.term}\\b`, 'g');
    const newLineContent = lineContent.replace(regex, mappings[item.term]);
    
    if (newLineContent !== lineContent) {
      contentLines[lineIndex] = newLineContent;
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, contentLines.join('\n'), 'utf8');
    console.log(`Fixed: ${fileKey}`);
  }
});
