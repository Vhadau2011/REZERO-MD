# 🤖 REZERO-MD

**REZERO-MD** is a powerful, modular, and beginner-friendly WhatsApp bot built with Node.js. It features 30 commands across 6 categories, automatic session handling, and a clean, expandable codebase.

## ✨ Features

- ✅ **30 Pre-built Commands** across 6 categories
- 🔐 **Automatic Session Management** - No need to scan QR every time
- 👑 **Owner-Only Commands** - Secure admin controls
- 📂 **Modular Command System** - Easy to add/remove commands
- 🎨 **Clean & Readable Code** - Perfect for beginners
- 🚀 **Production Ready** - Stable and reliable
- 📝 **Dynamic Menu System** - Auto-generates from commands

## 📦 Installation

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- A WhatsApp account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mudau2011/REZERO-MD.git
   cd REZERO-MD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   
   Edit the `.env` file:
   ```env
   OWNER_NUMBER=your_number_here
   OWNER_NAME=mudau_t
   BOT_NAME=REZERO-MD
   PREFIX=.
   SESSION_ID=
   GITHUB_USERNAME=Mudau2011
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

5. **Scan QR Code**
   
   Scan the QR code that appears in the terminal with WhatsApp.

## 📋 Command Categories

### 👑 Owner (5 commands)
- `restart` - Restart the bot
- `shutdown` - Shutdown the bot
- `setprefix` - Change command prefix
- `eval` - Execute JavaScript code
- `block` - Block a user

### 🤖 General (5 commands)
- `ping` - Check bot response time
- `alive` - Check if bot is running
- `botinfo` - Display bot information
- `owner` - Display owner information
- `menu` - Display all commands

### 🛠 Utility (5 commands)
- `time` - Display current time
- `date` - Display current date
- `uptime` - Display bot uptime
- `device` - Display device information
- `system` - Display system information

### 🎲 Fun (5 commands)
- `joke` - Get a random joke
- `quote` - Get inspirational quote
- `dice` - Roll a dice
- `flip` - Flip a coin
- `truth` - Get truth question

### 📥 Downloader (5 commands)
- `yt` - YouTube video info
- `ytmp3` - YouTube to MP3
- `ytmp4` - YouTube to MP4
- `tiktok` - TikTok downloader
- `instagram` - Instagram downloader

### ⚙️ Tools (5 commands)
- `calc` - Calculator
- `shorturl` - URL shortener
- `qr` - QR code generator
- `translate` - Text translator
- `weather` - Weather information

## 🔧 Usage

All commands use the prefix `.` by default:

```
.menu          - Display all commands
.ping          - Check response time
.alive         - Check bot status
.weather London - Get weather info
.calc 5 + 3    - Calculate expression
```

## 📁 Project Structure

```
REZERO-MD/
├── commands/          # All bot commands
│   ├── ping.js
│   ├── menu.js
│   └── ...
├── utils/             # Utility modules
│   ├── config.js      # Configuration loader
│   ├── logger.js      # Logging system
│   ├── session.js     # Session handler
│   └── commandHandler.js
├── session/           # Session data storage
├── index.js           # Main bot file
├── .env               # Configuration file
├── package.json
└── README.md
```

## 🛠 Adding New Commands

1. Create a new file in the `commands/` folder:

```javascript
module.exports = {
    name: 'mycommand',
    category: 'General',
    description: 'My custom command',
    usage: '.mycommand',
    ownerOnly: false,

    async execute(client, message, args) {
        await message.reply('Hello from my command!');
    }
};
```

2. Restart the bot - the command will be automatically loaded!

## 🔐 Session Management

- Session ID is automatically generated on first run
- Session data is saved in the `session/` folder
- No need to scan QR code after the first time
- Session ID is stored in `.env` file

## 👑 Owner Commands

Owner commands are restricted to the number specified in `OWNER_NUMBER` in the `.env` file. Make sure to set your WhatsApp number correctly.

## 🐛 Troubleshooting

### QR Code not appearing
- Make sure you have a stable internet connection
- Clear the `session/` folder and restart

### Commands not working
- Check if the prefix is correct in `.env`
- Verify the command name with `.menu`

### Authentication failed
- Delete the `session/` folder
- Remove `SESSION_ID` from `.env`
- Restart the bot and scan QR again

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**mudau_t**
- GitHub: [@Mudau2011](https://github.com/Mudau2011)

## ⚠️ Disclaimer

This bot is for educational purposes. Use responsibly and follow WhatsApp's Terms of Service.

## 🌟 Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

**REZERO-MD v1.0.0** - Built with ❤️ by mudau_t
