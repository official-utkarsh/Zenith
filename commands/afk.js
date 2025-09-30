const fs = require("fs");
const AFK_FILE = "./afk.json";

// Load AFK users from file
let afkUsers = {};
if (fs.existsSync(AFK_FILE)) {
  afkUsers = JSON.parse(fs.readFileSync(AFK_FILE));
}

module.exports = {
  name: "afk",
  description: "Set yourself as AFK: !afk <reason>",
  execute(message, args) {
    const reason = args.join(" ") || "AFK";

    afkUsers[message.author.id] = {
      reason,
      timestamp: Date.now()
    };

    fs.writeFileSync(AFK_FILE, JSON.stringify(afkUsers, null, 2));
    message.reply(`✅ You are now AFK: "${reason}"`);
  },
  afkUsers,
};
