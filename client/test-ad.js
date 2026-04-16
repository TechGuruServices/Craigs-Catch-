fetch('https://sfbay.craigslist.org/sby/zip/d/san-jose-faux-wood-paneling/7928199404.html', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
  }
}).then(r => r.text()).then(html => {
  const images = [...html.matchAll(/https:\/\/images\.craigslist\.org\/[^"']+/gi)].map(m => m[0]);
  console.log("Images found:", images);
});
