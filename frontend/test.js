import { Buffer } from 'node:buffer';
const str = "khudeshivam@gmail.com:$2b$10$fkJe41AG.J0AHaG/UNKojOO8hnFX5j2TCIwSCRGC07CgD7gI1hzgi_ADMIN_SALT";
console.log(Buffer.from(str).toString('base64'));
