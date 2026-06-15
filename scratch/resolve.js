const dns = require('dns');
dns.resolveSrv('_mongodb._tcp.cluster0.kj85wan.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Error:', err);
    return;
  }
  console.log('SRV Addresses:', addresses);
});
dns.resolveTxt('cluster0.kj85wan.mongodb.net', (err, records) => {
  if (err) {
    console.error('TXT Error:', err);
    return;
  }
  console.log('TXT Records:', records);
});
