import fs from 'fs';
import path from 'path';

const filesToFix = [
  "c:/Users/ASUS/OneDrive/Pictures/ドキュメント/Desktop/shailraj/frontend/src/backend/shared/database/MongoAdapter.ts",
  "c:/Users/ASUS/OneDrive/Pictures/ドキュメント/Desktop/shailraj/frontend/src/backend/shared/db.ts",
  "c:/Users/ASUS/OneDrive/Pictures/ドキュメント/Desktop/shailraj/frontend/src/backend/infrastructure/whatsapp-api.ts",
  "c:/Users/ASUS/OneDrive/Pictures/ドキュメント/Desktop/shailraj/frontend/src/backend/infrastructure/redis.ts"
];

for (const filePath of filesToFix) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/await import\(['"]node:fs['"]\)/g, "await import(/* @vite-ignore */ 'node:' + 'fs')");
    content = content.replace(/await import\(['"]node:path['"]\)/g, "await import(/* @vite-ignore */ 'node:' + 'path')");
    content = content.replace(/await import\(['"]fs['"]\)/g, "await import(/* @vite-ignore */ 'f' + 's')");
    content = content.replace(/await import\(['"]path['"]\)/g, "await import(/* @vite-ignore */ 'p' + 'ath')");
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed", filePath);
  }
}
