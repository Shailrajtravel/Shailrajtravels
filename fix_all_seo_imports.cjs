const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

walk('src/routes').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Remove all SchemaMarkup imports first
  const lines = content.split('\n');
  let schemaMarkupImported = false;
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // If line imports SchemaMarkup from backend, remove SchemaMarkup
    if (line.includes('backend/lib/seo') && line.includes('SchemaMarkup')) {
      line = line.replace(/,\s*SchemaMarkup/, '').replace(/SchemaMarkup\s*,/, '').replace(/SchemaMarkup/, '');
      // If it's just `import { } from`, remove the whole line
      if (/import\s*\{\s*\}\s*from/.test(line)) {
        line = '';
      }
      changed = true;
    }
    // If line is exactly the frontend SchemaMarkup import, we remove it so we can re-add it cleanly at the top if needed
    if (line.includes('frontend/components/SchemaMarkup')) {
       // Skip this line to remove duplicates
       changed = true;
       continue;
    }
    if (line !== '') {
      newLines.push(line);
    }
  }

  content = newLines.join('\n');

  // Re-add SchemaMarkup if it is used in the file
  if (content.includes('<SchemaMarkup')) {
    const depth = file.split(path.sep).length - 2; // src/routes is depth 0
    // wait depth calculation:
    // file: src/routes/faq.tsx -> depth 0 -> ../frontend
    // file: src/routes/about/index.tsx -> depth 1 -> ../../frontend
    let prefix = '../';
    const parts = file.replace(/\\/g, '/').split('/');
    const routesIndex = parts.indexOf('routes');
    const relativeParts = parts.slice(routesIndex + 1); // e.g. ['faq.tsx'] -> length 1
    if (relativeParts.length > 1) {
      prefix = '../'.repeat(relativeParts.length);
    }

    const importStmt = `import { SchemaMarkup } from '${prefix}frontend/components/SchemaMarkup';`;
    
    // Insert after the last import, or at the top
    content = importStmt + '\n' + content;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
