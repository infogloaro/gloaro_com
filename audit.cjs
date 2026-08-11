const fs = require('fs');
const path = require('path');

const terms = [
  'Operation Vice President',
  'Executive Directors', 'Executive Director',
  'Vice Presidents', 'Vice President',
  'Presidents', 'President',
  'Secretaries', 'Secretary',
  'Referral Management', 'Referral Tracking', 'Referral Code', 'Personal Referral', 'All Referrals',
  'My Referrals', 'Referrals', 'Referral'
];

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
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    terms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'g');
      let match;
      while ((match = regex.exec(line)) !== null) {
        // Skip obvious programmatic things:
        // /referrals
        if (line.match(new RegExp(`/${term.toLowerCase()}`, 'i'))) continue;
        // ROLES.PRESIDENT
        if (line.includes(`ROLES.${term.replace(' ', '_').toUpperCase()}`)) continue;
        // import ...
        if (line.trim().startsWith('import ') && line.includes(' from ')) continue;
        // component names in JSX
        if (line.match(new RegExp(`<${term.replace(' ', '')}`, 'i')) || line.match(new RegExp(`</${term.replace(' ', '')}`, 'i'))) continue;
        
        found.push({
          file: file.replace(__dirname, ''),
          line: index + 1,
          term: term,
          content: line.trim()
        });
      }
    });
  });
});

fs.writeFileSync('audit.json', JSON.stringify(found, null, 2));
