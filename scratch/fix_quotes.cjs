const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);

for (const file of allFiles) {
  let content = fs.readFileSync(file, "utf8");
  let originalContent = content;

  // Fix mismatched quotes like: from '../frontend/features/core/i18n";
  content = content.replace(/from\s+'(.*?)";/g, 'from "$1";');
  content = content.replace(/from\s+'(.*?)",/g, 'from "$1",');
  content = content.replace(/from\s+'(.*?)""/g, 'from "$1"');
  content = content.replace(/from\s+'(.*?)'/g, "from '$1'");

  // Wait, the regex replace was `from '../frontend/features/` so it explicitly put a single quote at the beginning!
  // If the string originally ended with a double quote, we now have `'...frontend/... "`
  // So replacing `'` at the beginning and `"` at the end with `"` at both ends:
  content = content.replace(/from\s+'(.*?)";/g, 'from "$1";');
  content = content.replace(/import\('(.*?)"\)/g, 'import("$1")');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`Fixed quotes in ${file}`);
  }
}
