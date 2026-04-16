const fetch = require('node-fetch') || globalThis.fetch;
(async () => {
    const text = "🚨 <b>New Item Found!</b> 🚨\n\n<b>Faux wood paneling</b>\n\n<a href=\"https://...\">View on Craigslist</a>";
    const images = ['https://images.craigslist.org/00k0k_gHllnfinwBf_0gl0t2_600x450.jpg'];
    
    // Simulate sending logic to see formatting
    const mediaGroup = images.slice(0, 10).map((url, i) => ({
      type: "photo",
      media: url,
      caption: i === 0 ? text : undefined,
      parse_mode: i === 0 ? "HTML" : undefined
    }));
    console.log(JSON.stringify({ media: mediaGroup }, null, 2));
})();
