require('dotenv').config();

/**
 * REZERO-MD Configuration
 * Loads and validates environment variables
 */

const config = {
    // Owner Information
    owner: {
        number: process.env.OWNER_NUMBER || '',
        name: process.env.OWNER_NAME || 'mudau_t',
        github: process.env.GITHUB_USERNAME || 'Mudau2011'
    },

    // Bot Configuration
    bot: {
        name: process.env.BOT_NAME || 'REZERO-MD',
        prefix: process.env.PREFIX || '.',
        sessionId: process.env.SESSION_ID || ''
    },

    // Session Configuration
    session: {
        path: './session',
        autoSave: true
    }
};

/**
 * Validate configuration
 */
function validateConfig() {
    const warnings = [];

    if (!config.owner.number) {
        warnings.push('⚠️  OWNER_NUMBER not set in .env file');
    }

    if (warnings.length > 0) {
        console.log('\n📋 Configuration Warnings:');
        warnings.forEach(warning => console.log(warning));
        console.log('');
    }

    return warnings.length === 0;
}

module.exports = { config, validateConfig };
