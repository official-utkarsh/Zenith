const axios = require("axios");

module.exports = {
  name: "gif",
  description: "Posts a fun GIF for the given topic",
  execute: async (message, args) => {
    if (!args.length) return message.reply("❌ Please provide a topic, e.g., `!gif cat`");
    const topic = args.join(" ");

    const apiKey = process.env.TENOR_API_KEY;
    const limit = 10; // fetch 10 gifs
    const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(topic)}&key=${apiKey}&limit=${limit}&random=true`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;
      if (!results || results.length === 0) return message.reply("❌ No GIFs found!");

      // Pick a random GIF from results
      const gif = results[Math.floor(Math.random() * results.length)];
      const gifUrl = gif.media_formats.gif.url;

      message.reply({ content: gifUrl });
    } catch (err) {
      console.error(err);
      message.reply("❌ Error fetching GIFs. Try again later.");
    }
  },
};
