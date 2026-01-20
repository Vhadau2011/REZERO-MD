const fs = require('fs');
const path = require('path');
const { config } = require('./config');

/**
 * REZERO-MD Session Handler
 * Manages session creation, loading, and persistence
 */

class SessionHandler {
    constructor() {
        this.sessionPath = path.resolve(config.session.path);
        this.sessionId = config.bot.sessionId || this.generateSessionId();
        this.sessionFile = path.join(this.sessionPath, `${this.sessionId}.json`);
    }

    /**
     * Generate a random session ID
     */
    generateSessionId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = 'REZERO_';
        for (let i = 0; i < 16; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    /**
     * Initialize session directory
     */
    initSessionDir() {
        if (!fs.existsSync(this.sessionPath)) {
            fs.mkdirSync(this.sessionPath, { recursive: true });
            console.log('✅ Session directory created');
        }
    }

    /**
     * Check if session exists
     */
    sessionExists() {
        return fs.existsSync(this.sessionFile);
    }

    /**
     * Get session ID
     */
    getSessionId() {
        return this.sessionId;
    }

    /**
     * Save session ID to .env file
     */
    saveSessionIdToEnv() {
        const envPath = path.resolve('.env');
        let envContent = fs.readFileSync(envPath, 'utf8');

        if (envContent.includes('SESSION_ID=')) {
            envContent = envContent.replace(/SESSION_ID=.*/, `SESSION_ID=${this.sessionId}`);
        } else {
            envContent += `\nSESSION_ID=${this.sessionId}`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Session ID saved to .env file');
    }

    /**
     * Display session info
     */
    displaySessionInfo() {
        console.log('\n╔════════════════════════════════════════╗');
        console.log('║       REZERO-MD SESSION INFO          ║');
        console.log('╚════════════════════════════════════════╝');
        console.log(`📱 Session ID: ${this.sessionId}`);
        console.log(`📂 Session Path: ${this.sessionPath}`);
        console.log(`✅ Session Status: ${this.sessionExists() ? 'Existing' : 'New'}`);
        console.log('════════════════════════════════════════\n');
    }
}

module.exports = SessionHandler;
