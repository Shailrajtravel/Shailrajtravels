import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Please provide a password as an argument.");
  console.error("Usage: node generate-hash.js <your_password>");
  process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log(`\nPassword: ${password}`);
console.log(`\nHash to put in .env (ADMIN_PASSWORD_HASH):`);
console.log(`${hash}\n`);
