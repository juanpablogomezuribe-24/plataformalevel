const fetch = require('node-fetch');

async function test() {
  console.log("Sending request...");
  const start = Date.now();
  const res = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: "Test prompt",
      clientName: "Test Client",
      template: "level-cover",
      outline: [
        { name: "Portada", templateId: "level-cover", intent: "Title" }
      ]
    })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Time:", (Date.now() - start) / 1000, "seconds");
  console.log("Response:", text);
}

test();
