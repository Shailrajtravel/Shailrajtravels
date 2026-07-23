async function verify() {
  console.log("1. Checking Landing Page SEO & 200 OK...");
  const home = await fetch('https://shailrajtravels.com/');
  const homeHtml = await home.text();
  console.log(`Landing Page Status: ${home.status}`);
  
  const titleMatch = homeHtml.match(/<title[^>]*>([^<]+)<\/title>/);
  console.log(`Title: ${titleMatch ? titleMatch[1] : 'Not Found'}`);
  
  const metaDescMatch = homeHtml.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i) || homeHtml.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"[^>]*>/i);
  console.log(`Meta Description: ${metaDescMatch ? metaDescMatch[1] : 'Not Found'}`);

  console.log("\n2. Checking Backend API & Admin...");
  const admin = await fetch('https://shailrajtravels.com/admin');
  console.log(`Admin Page Status: ${admin.status}`);
  
  // We can also fetch the admin HTML to check if it rendered the 500 internal server error text
  const adminHtml = await admin.text();
  if (adminHtml.includes('Minified React error')) {
    console.log("Admin Page Error: Minified React Error is STILL present.");
  } else if (adminHtml.includes('Internal Server Error')) {
    console.log("Admin Page Error: 500 Internal Server Error is STILL present.");
  } else {
    console.log("Admin Page Error: None detected in HTML.");
  }
}

verify().catch(console.error);
