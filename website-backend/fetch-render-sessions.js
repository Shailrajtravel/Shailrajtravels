const https = require('https');

const apiKey = 'owa_k1_4dcedf903eebba7d4c7146bcfafc173933792d232432b10c8d5ba0be6e518b6c';
const url = 'https://shailrajtravels-backend.onrender.com/api/sessions';

https.get(url, { headers: { 'X-API-Key': apiKey } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Sessions:", data);
  });
}).on('error', err => console.error(err));
