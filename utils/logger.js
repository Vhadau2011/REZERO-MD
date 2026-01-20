const moment = require('moment-timezone');

/**
 * REZERO-MD Logger
 * Clean and formatted console logging
 */

class Logger {
    constructor() {
        this.timezone = 'Africa/Johannesburg';
    }

    /**
     * Get formatted timestamp
     */
    getTimestamp() {
        return moment().tz(this.timezone).format('HH:mm:ss');
    }

    /**
     * Log info message
     */
    info(message) {
        console.log(`[${this.getTimestamp()}] ℹ️  ${message}`);
    }

    /**
     * Log success message
     */
    success(message) {
        console.log(`[${this.getTimestamp()}] ✅ ${message}`);
    }

    /**
     * Log warning message
     */
    warn(message) {
        console.log(`[${this.getTimestamp()}] ⚠️  ${message}`);
    }

    /**
     * Log error message
     */
    error(message) {
        console.log(`[${this.getTimestamp()}] ❌ ${message}`);
    }

    /**
     * Log command execution
     */
    command(user, command) {
        console.log(`[${this.getTimestamp()}] 📝 Command: ${command} | User: ${user}`);
    }

    /**
     * Display bot banner
     */
    banner() {
        console.log('\n╔═══════════════════════════════════════════════╗');
        console.log('║                                               ║');
        console.log('║           ██████╗ ███████╗███████╗           ║');
        console.log('║           ██╔══██╗██╔════╝╚══███╔╝           ║');
        console.log('║           ██████╔╝█████╗    ███╔╝            ║');
        console.log('║           ██╔══██╗██╔══╝   ███╔╝             ║');
        console.log('║           ██║  ██║███████╗███████╗           ║');
        console.log('║           ╚═╝  ╚═╝╚══════╝╚══════╝           ║');
        console.log('║                                               ║');
        console.log('║              REZERO-MD v1.0.0                 ║');
        console.log('║         WhatsApp Bot by mudau_t               ║');
        console.log('║                                               ║');
        console.log('╚═══════════════════════════════════════════════╝\n');
    }
}

module.exports = new Logger();
