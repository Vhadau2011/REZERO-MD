const fs = require('fs').promises;
const path = require('path');

class MultiDatabase {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.sharedKey = process.env.DATABASE_KEY || 'mudaubotsconnet';
        this.usersDir = path.join(baseDir, 'users');
        this.paths = {
            shop: path.join(baseDir, 'shop.json'),
            lottery: path.join(baseDir, 'lottery.json'),
            tickets: path.join(baseDir, 'tickets.json')
        };
        this.data = {
            shop: {},
            lottery: { pot: 0, tickets: [] },
            tickets: {}
        };
        this.userCache = new Map();
    }

    async load() {
        // Verify shared key
        if (process.env.DATABASE_KEY && process.env.DATABASE_KEY !== this.sharedKey) {
            console.error('CRITICAL: Database Key Mismatch! Access Denied.');
            process.exit(1);
        }

        // Ensure users directory exists
        try {
            await fs.mkdir(this.usersDir, { recursive: true });
        } catch (err) {}

        // Load global files
        for (const [key, filePath] of Object.entries(this.paths)) {
            try {
                const content = await fs.readFile(filePath, 'utf8');
                this.data[key] = JSON.parse(content);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    await this.saveGlobal(key);
                }
            }
        }
    }

    async saveGlobal(key) {
        try {
            await fs.writeFile(this.paths[key], JSON.stringify(this.data[key], null, 2));
        } catch (error) {
            console.error(`Error saving global ${key} database:`, error);
        }
    }

    async _getUserFilePath(userId) {
        const files = await fs.readdir(this.usersDir);
        const userFile = files.find(f => f.startsWith(userId + '_'));
        if (userFile) return path.join(this.usersDir, userFile);
        return null;
    }

    async getUser(userId, username = 'Unknown') {
        // Return cached if available to avoid constant disk reads
        if (this.userCache.has(userId)) return this.userCache.get(userId);

        let userData = null;
        const filePath = await this._getUserFilePath(userId);

        if (filePath) {
            try {
                const content = await fs.readFile(filePath, 'utf8');
                userData = JSON.parse(content);
            } catch (e) {
                console.error(`Error reading user file for ${userId}:`, e);
            }
        }

        if (!userData) {
            userData = {
                id: userId,
                name: username,
                registered: false,
                role: 'USER',
                bio: 'No bio set.',
                age: 'Not set',
                banned: false,
                wallet: 1000,
                bank: 0,
                inventory: [],
                lastDaily: null,
                lastWeekly: null,
                lastWork: null,
                lastCrime: null
            };
        }

        // Map to the structure commands expect
        const structured = {
            info: {
                id: userData.id,
                name: userData.name,
                registered: userData.registered,
                role: userData.role,
                bio: userData.bio,
                age: userData.age,
                banned: userData.banned
            },
            economy: {
                wallet: userData.wallet,
                bank: userData.bank,
                inventory: userData.inventory,
                lastDaily: userData.lastDaily,
                lastWeekly: userData.lastWeekly,
                lastWork: userData.lastWork,
                lastCrime: userData.lastCrime
            },
            wallet: userData.wallet,
            bank: userData.bank,
            _raw: userData // Keep raw for saving
        };

        this.userCache.set(userId, structured);
        return structured;
    }

    async saveUser(userId) {
        const structured = this.userCache.get(userId);
        if (!structured) return;

        const userData = structured._raw;
        // Update raw from structured just in case
        userData.wallet = structured.wallet;
        userData.bank = structured.bank;

        const fileName = `${userData.id}_${userData.name.replace(/[^a-z0-9]/gi, '_')}.json`;
        const filePath = path.join(this.usersDir, fileName);

        // Remove old file if name changed
        const oldPath = await this._getUserFilePath(userId);
        if (oldPath && oldPath !== filePath) {
            try { await fs.unlink(oldPath); } catch (e) {}
        }

        try {
            await fs.writeFile(filePath, JSON.stringify(userData, null, 2));
        } catch (error) {
            console.error(`Error saving user ${userId}:`, error);
        }
    }

    async registerUser(userId, username, age) {
        const user = await this.getUser(userId, username);
        user.info.registered = true;
        user.info.name = username;
        user.info.age = age;
        user._raw.registered = true;
        user._raw.name = username;
        user._raw.age = age;
        await this.saveUser(userId);
    }

    async setRole(userId, role) {
        const user = await this.getUser(userId);
        user.info.role = role;
        user._raw.role = role;
        await this.saveUser(userId);
    }

    async setBan(userId, status) {
        const user = await this.getUser(userId);
        user.info.banned = status;
        user._raw.banned = status;
        await this.saveUser(userId);
    }

    async setBio(userId, bio) {
        const user = await this.getUser(userId);
        user.info.bio = bio;
        user._raw.bio = bio;
        await this.saveUser(userId);
    }

    async addMoney(userId, amount, type = 'wallet') {
        const user = await this.getUser(userId);
        user[type] += amount;
        user._raw[type] += amount;
        await this.saveUser(userId);
        return user[type];
    }

    async removeMoney(userId, amount, type = 'wallet') {
        const user = await this.getUser(userId);
        if (user[type] < amount) return false;
        user[type] -= amount;
        user._raw[type] -= amount;
        await this.saveUser(userId);
        return true;
    }

    async updateUser(userId, data) {
        const user = await this.getUser(userId);
        for (const key in data) {
            if (user.info.hasOwnProperty(key)) user.info[key] = data[key];
            if (user.economy.hasOwnProperty(key)) user.economy[key] = data[key];
            if (user.hasOwnProperty(key)) user[key] = data[key];
            user._raw[key] = data[key];
        }
        await this.saveUser(userId);
    }

    async addItem(userId, item) {
        const user = await this.getUser(userId);
        user.economy.inventory.push(item);
        user._raw.inventory.push(item);
        await this.saveUser(userId);
    }

    async removeItem(userId, itemName) {
        const user = await this.getUser(userId);
        const index = user.economy.inventory.findIndex(i => i.name === itemName);
        if (index === -1) return false;
        user.economy.inventory.splice(index, 1);
        user._raw.inventory.splice(index, 1);
        await this.saveUser(userId);
        return true;
    }

    getShop() { return this.data.shop; }
    async addShopItem(id, item) { this.data.shop[id] = item; await this.saveGlobal('shop'); }
    async removeShopItem(id) { delete this.data.shop[id]; await this.saveGlobal('shop'); }

    async createTicket(channelId, userId) {
        this.data.tickets[channelId] = { userId, createdAt: Date.now() };
        await this.saveGlobal('tickets');
    }
    async deleteTicket(channelId) { delete this.data.tickets[channelId]; await this.saveGlobal('tickets'); }
    getTicket(channelId) { return this.data.tickets[channelId]; }

    async getLeaderboard(type = 'wallet', limit = 10) {
        const files = await fs.readdir(this.usersDir);
        const allUsers = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const content = await fs.readFile(path.join(this.usersDir, file), 'utf8');
                    allUsers.push(JSON.parse(content));
                } catch (e) {}
            }
        }
        return allUsers
            .sort((a, b) => (b[type] || 0) - (a[type] || 0))
            .slice(0, limit)
            .map(u => [u.id, u]);
    }
}

module.exports = MultiDatabase;
