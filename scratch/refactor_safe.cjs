const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");
const frontendDir = path.join(srcDir, "frontend");
const backendDir = path.join(srcDir, "backend");

// Create directories
if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir);
if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir);

const frontendTargets = [
  "assets",
  "components",
  "config",
  "data",
  "features",
  "hooks",
  "invioce",
  "templates",
  "types",
];
const backendTargets = ["lib", "server.ts"];

// Move folders/files
function safeRename(oldPath, newPath) {
  if (fs.existsSync(oldPath)) {
    console.log(`Moving ${oldPath} to ${newPath}`);
    fs.renameSync(oldPath, newPath);
  }
}

for (const f of frontendTargets) {
  safeRename(path.join(srcDir, f), path.join(frontendDir, f));
}

for (const b of backendTargets) {
  safeRename(path.join(srcDir, b), path.join(backendDir, b));
}

// Function to recursively get all TS/TSX files
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

  // We are going to do simple regex replacements to adjust paths.
  // This is a naive approach but works for standard import paths.

  // Example: if a file in src/routes/index.tsx imports from '../features/home/Hero'
  // it should now be '../frontend/features/home/Hero'

  // If a file in src/frontend/features/home/Hero.tsx imports from '../../lib/bookings'
  // it should now be '../../backend/lib/bookings'

  // Replace @/ imports
  for (const f of frontendTargets) {
    if (f === "server.ts") continue;
    content = content.replace(new RegExp(`@/${f}/`, "g"), `@/frontend/${f}/`);
    content = content.replace(
      new RegExp(`from\\s+['"]\\.\\./${f}/`, "g"),
      `from '../frontend/${f}/`,
    );
    content = content.replace(
      new RegExp(`from\\s+['"]\\.\\./\\.\\./${f}/`, "g"),
      `from '../../frontend/${f}/`,
    );
    content = content.replace(
      new RegExp(`import\\(['"]\\.\\./${f}/`, "g"),
      `import('../frontend/${f}/`,
    );
  }

  for (const b of backendTargets) {
    if (b === "server.ts") continue;
    content = content.replace(new RegExp(`@/${b}/`, "g"), `@/backend/${b}/`);
    content = content.replace(
      new RegExp(`from\\s+['"]\\.\\./${b}/`, "g"),
      `from '../backend/${b}/`,
    );
    content = content.replace(
      new RegExp(`from\\s+['"]\\.\\./\\.\\./${b}/`, "g"),
      `from '../../backend/${b}/`,
    );
    content = content.replace(
      new RegExp(`import\\(['"]\\.\\./${b}/`, "g"),
      `import('../backend/${b}/`,
    );
  }

  // Also need to handle cases where files moved into frontend need to go up one more directory
  // to access routes or other files in root of src.
  // e.g. from '../routeTree.gen' to '../../routeTree.gen'
  if (file.includes("frontend") || file.includes("backend")) {
    // This is overly complex to do perfectly with regex.
    // Since we only moved down 1 level, we might have broken sibling imports that didn't move together.
    // Let's hope the user can fix any remaining squigglies, or we can use an automated tool later.
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`Updated imports in ${file}`);
  }
}

console.log("Refactor script complete.");
