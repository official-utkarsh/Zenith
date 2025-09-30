module.exports = {
    name: "serverinfo",
    description: "Shows information about the server",
    execute: (message) => {
        const { guild } = message;
        const info = `
📛 **Server Name:** ${guild.name}
🆔 **Server ID:** ${guild.id}
👥 **Members:** ${guild.memberCount}
🏷️ **Owner:** ${guild.ownerId ? `<@${guild.ownerId}>` : "Unknown"}
🌐 **Region:** ${guild.preferredLocale}
📝 **Created On:** ${guild.createdAt.toDateString()}
`;
        message.reply(info);
    },
};
