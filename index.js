/**
 * REZERO-MD - WhatsApp Bot
 * Version: 1.0.0
 * Author: mudau_t (Mudau2011)
 * 
 * A powerful and modular WhatsApp bot built with Node.js
 * Easy to modify and expand for beginners
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline');
const { config, validateConfig } = require('./utils/config');
const SessionHandler = require('./utils/session');
const logger = require('./utils/logger');
const commandHandler = require('./utils/commandHandler');

// Setup readline for interactive input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

// Display banner
logger.banner();

// Validate configuration
validateConfig();

// Initialize session handler
const sessionHandler = new SessionHandler();
sessionHandler.initSessionDir();
sessionHandler.displaySessionInfo();

// Save session ID if new
if (!config.bot.sessionId) {
    sessionHandler.saveSessionIdToEnv();
}

// Initialize WhatsApp client
logger.info('Initializing WhatsApp client...');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: sessionHandler.getSessionId(),
        dataPath: sessionHandler.sessionPath
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--single-process',
            '--disable-extensions'
        ],
        executablePath: process.env.CHROME_PATH || undefined
    }
});

// QR Code event
client.on('qr', (qr) => {
    if (!config.bot.usePairingCode) {
        logger.info('QR Code received! Scan with WhatsApp:');
        console.log('');
        qrcode.generate(qr, { small: true });
        console.log('');
        logger.info('Scan the QR code above with WhatsApp to login');
    }
});

// Ready event
client.on('ready', () => {
    logger.success('REZERO-MD is ready!');
    logger.success(`Logged in as: ${client.info.pushname}`);
    logger.success(`Phone number: ${client.info.wid.user}`);
    
    // Load commands
    logger.info('Loading commands...');
    commandHandler.loadCommands();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   ✅ BOT IS NOW ONLINE AND READY!    ║');
    console.log('╚════════════════════════════════════════╝\n');
});

// Authentication events
client.on('authenticated', () => {
    logger.success('Authentication successful!');
});

client.on('auth_failure', (msg) => {
    logger.error('Authentication failed: ' + msg);
});

// Disconnected event
client.on('disconnected', (reason) => {
    logger.warn('Client disconnected: ' + reason);
});

// Message event
client.on('message', async (message) => {
    try {
        // Ignore if message doesn't start with prefix
        if (!message.body.startsWith(config.bot.prefix)) {
            return;
        }

        // Parse command and arguments
        const args = message.body.slice(config.bot.prefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();

        // Check if command exists
        if (!commandHandler.hasCommand(commandName)) {
            return;
        }

        const command = commandHandler.getCommand(commandName);

        // Get sender info
        const contact = await message.getContact();
        const senderNumber = contact.number;

        // Check if command is owner-only
        if (command.ownerOnly) {
            if (senderNumber !== config.owner.number) {
                await message.reply('❌ This command is only available to the bot owner!');
                logger.warn(`Unauthorized command attempt: ${commandName} by ${contact.pushname}`);
                return;
            }
        }

        // Log command execution
        logger.command(contact.pushname || senderNumber, commandName);

        // Execute command
        await command.execute(client, message, args);

    } catch (error) {
        logger.error(`Command execution error: ${error.message}`);
        await message.reply('❌ An error occurred while executing the command!');
    }
});

// Error handling
client.on('error', (error) => {
    logger.error('Client error: ' + error.message);
});

// Handle process termination
process.on('SIGINT', async () => {
    logger.warn('Received SIGINT, shutting down gracefully...');
    await client.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.warn('Received SIGTERM, shutting down gracefully...');
    await client.destroy();
    process.exit(0);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at: ' + promise + ', reason: ' + reason);
});

// Initialize client
logger.info('Starting REZERO-MD...');
client.initialize().then(async () => {
    if (config.bot.usePairingCode && !sessionHandler.sessionExists()) {
        console.log('\n╔════════════════════════════════════════╗');
        console.log('║       WHATSAPP PAIRING SYSTEM          ║');
        console.log('╚════════════════════════════════════════╝\n');
        
        let pairingNumber = config.bot.pairingNumber;
        
        if (!pairingNumber) {
            pairingNumber = await question('📱 Please enter your phone number (with country code, e.g., 27635666150): ');
        } else {
            const useDefault = await question(`📱 Use default number ${pairingNumber}? (y/n): `);
            if (useDefault.toLowerCase() !== 'y') {
                pairingNumber = await question('📱 Please enter your phone number: ');
            }
        }

        if (!pairingNumber) {
            logger.error('No phone number provided. Restart the bot to try again.');
            return;
        }

        pairingNumber = pairingNumber.replace(/[^0-9]/g, '');
        logger.info(`Requesting pairing code for: ${pairingNumber}...`);
        
        try {
            const code = await client.requestPairingCode(pairingNumber);
            console.log('\n╔════════════════════════════════════════╗');
            console.log('║          WHATSAPP PAIRING CODE         ║');
            console.log('╠════════════════════════════════════════╣');
            console.log(`║          CODE: ${code}            ║`);
            console.log('╚════════════════════════════════════════╝\n');
            logger.info('Enter this code in your WhatsApp (Linked Devices > Link with Phone Number)');
        } catch (err) {
            logger.error('Failed to request pairing code: ' + err.message);
        }
    }
});
