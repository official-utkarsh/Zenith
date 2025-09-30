module.exports = {
  name: "timer",
  description: "Starts a countdown timer in seconds",
  execute: async (message, args) => {
    if (args.length < 2) return message.reply("❌ Usage: `!timer [reason] [time in seconds]`");

    const reason = args.slice(0, args.length - 1).join(" ");
    const time = parseInt(args[args.length - 1]);

    if (isNaN(time) || time <= 0) return message.reply("❌ Please provide a valid time in seconds.");

    message.reply(`⏱️ Timer started for **${reason}**: ${time} seconds`);

    let remaining = time;
    const countdown = setInterval(() => {
      remaining--;

      if (remaining <= 0) {
        message.channel.send(`✅ Time's up! **${reason}** is over.`);
        clearInterval(countdown);
      }
    }, 1000);
  },
};
