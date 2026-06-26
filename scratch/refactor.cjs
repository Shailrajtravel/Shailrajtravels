const { Project } = require("ts-morph");
const fs = require("fs");
const path = require("path");

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

async function main() {
  // Create directories if they don't exist
  if (!fs.existsSync("src/frontend")) fs.mkdirSync("src/frontend");
  if (!fs.existsSync("src/backend")) fs.mkdirSync("src/backend");

  const frontendDirs = [
    "assets",
    "components",
    "config",
    "data",
    "features",
    "hooks",
    "invioce",
    "routes",
    "templates",
    "types",
  ];
  const backendDirs = ["lib"];

  // Move backend directories
  for (const dir of backendDirs) {
    if (fs.existsSync(`src/${dir}`)) {
      const sourceDir = project.getDirectory(`src/${dir}`);
      if (sourceDir) {
        console.log(`Moving src/${dir} to src/backend/${dir}...`);
        sourceDir.move(`src/backend/${dir}`);
      }
    }
  }

  // Move frontend directories
  for (const dir of frontendDirs) {
    if (fs.existsSync(`src/${dir}`)) {
      const sourceDir = project.getDirectory(`src/${dir}`);
      if (sourceDir) {
        console.log(`Moving src/${dir} to src/frontend/${dir}...`);
        sourceDir.move(`src/frontend/${dir}`);
      }
    }
  }

  // Move individual files
  const serverFile = project.getSourceFile("src/server.ts");
  if (serverFile) serverFile.move("src/backend/server.ts");

  const stylesFile = project.getSourceFile("src/styles.css");
  if (stylesFile) stylesFile.move("src/frontend/styles.css");

  // Save changes
  console.log("Saving changes...");
  await project.save();
  console.log("Done.");
}

main().catch(console.error);
