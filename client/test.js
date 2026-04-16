fetch('https://sfbay.craigslist.org/search/zip?format=rss', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  }
}).then(r => r.text()).then(html => {
  console.log("RSS output:", html.substring(0, 1500));
});
