const https = require('https');

const apiKey = 'owa_k1_4dcedf903eebba7d4c7146bcfafc173933792d232432b10c8d5ba0be6e518b6c';
const url = 'https://shailrajtravels-backend.onrender.com/api/sessions/b6920084-90c3-45e6-bf58-d2b6da4f4c6b';

const options = {
  method: 'DELETE',
  headers: {
    'X-API-Key': apiKey
  }
};

const req = https.request(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Delete Response:", res.statusCode, data);
  });
});

req.on('error', err => console.error(err));
req.end();
