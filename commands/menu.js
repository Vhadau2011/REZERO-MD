const { config } = require('../utils/config');
const commandHandler = require('../utils/commandHandler');

/**
 * REZERO-MD Command: menu
 * Category: General
 * Displays all available commands grouped by category
 */

module.exports = {
    name: 'menu',
    category: 'General',
    description: 'Display all available commands',
    usage: '.menu',
    ownerOnly: false,

    async execute(client, message, args) {
        const categorized = commandHandler.getCategorizedCommands();
        const prefix = config.bot.prefix;

        let menuText = `
╔═══════════════════════════════
║ 🤖 *${config.bot.name} COMMAND MENU*
╚═══════════════════════════════

👑 Owner: ${config.owner.name}
🔧 Prefix: ${prefix}
📦 Total Commands: ${commandHandler.getAllCommands().length}

`;

        // Category icons
        const categoryIcons = {
            'Owner': '👑',
            'General': '🤖',
            'Utility': '🛠',
            'Fun': '🎲',
            'Downloader': '📥',
            'Tools': '⚙️'
        };

        // Build menu by category
        for (const [category, commands] of Object.entries(categorized)) {
            const icon = categoryIcons[category] || '📌';
            menuText += `\n${icon} *${category.toUpperCase()}*\n`;
            menuText += '─────────────────────\n';
            
            commands.forEach(cmd => {
                menuText += `${prefix}${cmd.name}\n`;
            });
        }

        menuText += `
─────────────────────
💡 Type ${prefix}menu <command> for details
🔗 GitHub: github.com/${config.owner.github}

_REZERO-MD v1.0.0_
        `.trim();

        await message.reply(menuText);
    }
};
