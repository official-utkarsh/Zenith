const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "roll",
  description: "Roll a dice",
  slashData: new SlashCommandBuilder().setName("roll").setDescription("Roll a dice"),
  execute: async (interaction) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    await interaction.reply(`🎲 You rolled a **${roll}**!`);
  },
};
