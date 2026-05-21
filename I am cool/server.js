const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple homepage with input box
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Proxy</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #0f172a; color: white; }
        input { width: 70%; padding: 15px; font-size: 18px; border-radius: 8px; border: none; }
        button { padding: 15px 30px; font-size: 18px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; }
        h1 { color: #60a5fa; }
      </style>
    </head>
    <body>
      <h1>My Own Proxy</h1>
      <p>Enter any website URL below:</p>
      <input type="text" id="url" placeholder="https://www.google.com" value="https://www.wikipedia.org">
      <br><br>
      <button onclick="go()">Browse</button>

      <script>
        function go() {
          let url = document.getElementById('url').value.trim();
          if (!url) return;
          if (!url.startsWith('http')) url = 'https://' + url;
          window.location.href = '/proxy/' + encodeURIComponent(url);
        }
      </script>
    </body>
    </html>
  `);
});

// The actual proxy route
app.use('/proxy/:target', (req, res, next) => {
  const target = decodeURIComponent(req.params.target);
  
  proxy(target, {
    https: true,
    proxyReqPathResolver: (req) => {
      return req.url; // forward the rest of the path
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers['User-Agent'] = 'Mozilla/5.0';
      return proxyReqOpts;
    }
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});