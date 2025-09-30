const fs = require("fs");
const QUOTES_FILE = "./quotes.json";

// Load saved quotes if they exist
let userQuotes = [];
if (fs.existsSync(QUOTES_FILE)) {
  userQuotes = JSON.parse(fs.readFileSync(QUOTES_FILE));
}

const defaultQuotes = [
  "🌟 Believe you can and you're halfway there.",
  "🚀 Don’t watch the clock; do what it does. Keep going.",
  "💡 Success is not final, failure is not fatal: it is the courage to continue that counts.",
];

module.exports = {
  name: "quote",
  description: "Get a random quote or add your own: !quote add <text>",
  execute(message, args) {
    if (args[0] && args[0].toLowerCase() === "add") {
      const newQuote = args.slice(1).join(" ");
      if (!newQuote) return message.reply("❌ Please provide a quote to add.");

      userQuotes.push(newQuote);
      fs.writeFileSync(QUOTES_FILE, JSON.stringify(userQuotes, null, 2));
      return message.reply("✅ Your quote has been added!");
    }

    const allQuotes = defaultQuotes.concat(userQuotes);
    const random = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    message.reply(`💬 ${random}`);
  },
};
