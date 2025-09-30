const activeGames = new Map(); // channelId => game

module.exports = {
    name: "tictactoe",
    description: "Play Tic-Tac-Toe with another user",
    execute: async (message, args) => {
        const opponent = message.mentions.users.first();
        if (!opponent) return message.reply("❌ You must mention someone to play with!");

        if (activeGames.has(message.channel.id))
            return message.reply("⚠️ A game is already running in this channel!");

        // Initialize board
        let board = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let turn = message.author.id;
        const symbols = {
            [message.author.id]: "X",
            [opponent.id]: "O",
        };

        activeGames.set(message.channel.id, { board, turn, symbols, players: [message.author.id, opponent.id] });

        const renderBoard = () => `\`\`\`
${board[0]} | ${board[1]} | ${board[2]}
---------
${board[3]} | ${board[4]} | ${board[5]}
---------
${board[6]} | ${board[7]} | ${board[8]}
\`\`\``;

        const checkWin = (b, s) => {
            const wins = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            return wins.some(line => line.every(i => b[i] === s));
        };

        message.channel.send(`🎮 Tic-Tac-Toe: ${message.author} vs ${opponent}\n${renderBoard()}\nIt's <@${turn}>'s turn. Type !move <1-9>`);

        const filter = m => !m.author.bot && activeGames.has(message.channel.id);
        const collector = message.channel.createMessageCollector({ filter });

        collector.on("collect", m => {
            if (m.author.id !== turn) return;

            const move = parseInt(m.content.split(" ")[1]);
            if (!move || move < 1 || move > 9 || board[move - 1] === "X" || board[move - 1] === "O")
                return m.reply("❌ Invalid move. Choose an empty number 1-9.");

            board[move - 1] = symbols[turn];

            if (checkWin(board, symbols[turn])) {
                message.channel.send(`${renderBoard()}\n🏆 <@${turn}> wins!`);
                activeGames.delete(message.channel.id);
                return collector.stop();
            }

            if (board.every(c => c === "X" || c === "O")) {
                message.channel.send(`${renderBoard()}\n🤝 It's a tie!`);
                activeGames.delete(message.channel.id);
                return collector.stop();
            }

            turn = turn === message.author.id ? opponent.id : message.author.id;
            message.channel.send(renderBoard() + `\nIt's <@${turn}>'s turn. Type !move <1-9>`);
        });
    },
};
