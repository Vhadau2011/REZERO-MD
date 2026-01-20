const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * REZERO-MD Command Handler
 * Dynamically loads and manages all bot commands
 */

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.categories = new Map();
    }

    /**
     * Load all commands from the commands directory
     */
    loadCommands() {
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandsPath, file));
                
                // Validate command structure
                if (!command.name || !command.category || !command.execute) {
                    logger.warn(`Invalid command structure in ${file}`);
                    continue;
                }

                // Register command
                this.commands.set(command.name, command);

                // Add to category
                if (!this.categories.has(command.category)) {
                    this.categories.set(command.category, []);
                }
                this.categories.get(command.category).push(command);

                logger.info(`Loaded command: ${command.name}`);
            } catch (error) {
                logger.error(`Failed to load command ${file}: ${error.message}`);
            }
        }

        logger.success(`Total commands loaded: ${this.commands.size}`);
        logger.success(`Total categories: ${this.categories.size}`);
    }

    /**
     * Get a specific command
     */
    getCommand(name) {
        return this.commands.get(name);
    }

    /**
     * Get all commands
     */
    getAllCommands() {
        return Array.from(this.commands.values());
    }

    /**
     * Get commands by category
     */
    getCommandsByCategory(category) {
        return this.categories.get(category) || [];
    }

    /**
     * Get all categories
     */
    getAllCategories() {
        return Array.from(this.categories.keys());
    }

    /**
     * Get categorized commands for menu
     */
    getCategorizedCommands() {
        const categorized = {};
        for (const [category, commands] of this.categories) {
            categorized[category] = commands;
        }
        return categorized;
    }

    /**
     * Check if command exists
     */
    hasCommand(name) {
        return this.commands.has(name);
    }
}

module.exports = new CommandHandler();
