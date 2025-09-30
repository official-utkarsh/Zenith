// index.js
require("dotenv").config();
const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command collection
client.commands = new Collection();
const prefix = "!";

// Load commands dynamically
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Load persistent AFK users
const afkCommand = client.commands.get("afk");
let afkUsers = afkCommand ? afkCommand.afkUsers : {};

// When bot is ready
client.once("ready", () => {
  console.log(`✅ Zenith is online as ${client.user.tag}`);
});

// Handle messages
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // --- AFK removal ---
  if (afkUsers[message.author.id]) {
    delete afkUsers[message.author.id];
    fs.writeFileSync("./afk.json", JSON.stringify(afkUsers, null, 2));
    message.reply("✅ Welcome back! You are no longer AFK.");
  }

  // --- Check mentions for AFK ---
  message.mentions.users.forEach(user => {
    if (afkUsers[user.id]) {
      const afkData = afkUsers[user.id];
      const timeAway = Math.floor((Date.now() - afkData.timestamp) / 1000 / 60); // minutes
      message.reply(`⚠️ ${user.username} is AFK: "${afkData.reason}" (away for ${timeAway} mins)`);
    }
  });

  // --- Command handler ---
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("❌ Oops! Something went wrong.");
  }
});

client.login(process.env.TOKEN);

const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Zenith is alive!'));
app.listen(3000);

// Login with token
client.login(process.env.TOKEN);


