# Discord Voice Notification Bot 🔊

A **privacy-first**, lightweight Discord bot that sends notifications when users join or leave voice channels. Built with TypeScript and designed for self-hosting with only essential dependencies.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- **Smart Notifications**: Sends join/leave notifications with configurable delays to prevent spam
- **Privacy-First**: No external tracking, databases, or user data storage
- **Configurable**: Separate channels for join/leave, customizable timing, logging levels
- **Production Ready**: Health monitoring, graceful shutdown, notification retry mechanism, server logging
- **Built-in Monitoring**: Discord slash command for bot status and server statistics
- **Modern Architecture**: TypeScript, modular design, comprehensive error handling
- **Self-Hosting**: Deploy anywhere - no external services required

## 🔐 Privacy Guarantees

- **No External Connections**: Only connects to Discord API
- **No Persistent Storage**: All data stored in memory only
- **No User Tracking**: No analytics, metrics, or behavior tracking
- **No Database**: Zero database dependencies or external data storage
- **Local Logs Only**: All logging happens locally with configurable levels
- **Ephemeral Commands**: Status commands are private to the user who runs them

**You have complete control** - inspect the code, audit dependencies, host it yourself.

## 📸 Example Notifications

```
🔊 **Alice** joined voice channel **general**
🔇 **Bob** left voice channel **gaming**
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- A Discord Application with bot token
- Basic command line knowledge

### 1. Clone & Install

```bash
git clone https://github.com/alex-ak/discord-voice-notifications.git
cd discord-voice-notifications
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Discord bot token and channel ID(s)
```

Required environment variables:

```env
DISCORD_TOKEN=your_bot_token_here

NOTIFY_CHANNEL_ID=your_channel_id_here
or
JOIN_NOTIFY_CHANNEL_ID=your_join_channel_id_here
LEAVE_NOTIFY_CHANNEL_ID=your_leave_channel_id_here
```

### 3. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token to your `.env` file

### 4. Add Bot to Your Discord Server

**Generate Invite URL:**

**Scopes:**

- `bot` (basic bot permissions)
- `applications.commands` (for slash commands)

**Bot Permissions:**

- `View Channels` (to access channels)
- `Send Messages` (to send notifications)

**URL Generation:** Use the Discord Developer Portal OAuth2 URL Generator to invite your bot to a server, it should look like this:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_CLIENT_ID&permissions=3072&scope=bot%20applications.commands
```

> **Note:** The permissions value `3072` represents "View Channels" (1024) + "Send Messages" (2048).

**Add to Server:**

1. Open the generated invite URL in your browser
2. Select the Discord server where you want to add the bot
3. Review the permissions and click "Authorize"
4. Complete any CAPTCHA if prompted

### 5. Run the Bot

```bash
# Verify setup (optional but recommended)
npm run verify

# Development
npm run dev

# Production
npm run build
npm start
```

You should see:

```
✅ Bot logged in as YourBot#1234
📢 Monitoring voice channel activity...
📥 Join notifications: Channel ID 123456789
📤 Leave notifications: Channel ID 123456789
✅ Slash commands registered successfully
```

**If bot commands don't appear immediately:**

1. Restart Discord client
2. Check bot permissions
3. Verify the bot has `applications.commands` scope

## ⚙️ Configuration Options

### Basic Setup (Single Channel)

```env
DISCORD_TOKEN=your_bot_token_here
NOTIFY_CHANNEL_ID=your_channel_id_here
```

### Advanced Setup (Separate Channels)

```env
DISCORD_TOKEN=your_bot_token_here
JOIN_NOTIFY_CHANNEL_ID=your_join_channel_id_here
LEAVE_NOTIFY_CHANNEL_ID=your_leave_channel_id_here
```

### Optional Settings

```env
MINIMUM_SESSION_TIME=10000  # 10 seconds (prevents spam from quick joins/leaves)
RETRY_DELAY=2000           # 2 seconds (retry delay for failed notifications)
LOG_LEVEL=INFO             # ERROR, WARN, INFO, DEBUG
```

## 📊 Monitoring & Status

Use the `/status` slash command in Discord to get detailed bot information including health status, memory usage, server statistics, and configuration settings. See [COMMANDS.md](COMMANDS.md) for full details.

## 🐳 Running the Server

### Local Development

```bash
npm run dev
```

### Production Server

```bash
npm run build
npm start
```

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Code Style

- TypeScript with strict mode
- Prettier for formatting (`npm run format`)
- ESLint for linting (`npm run lint`)
- Clear documentation and comments

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/alex-ak/discord-voice-notifications/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alex-ak/discord-voice-notifications/discussions)
- **Documentation**: [Commands Documentation](COMMANDS.md)
- **Release Notes**: [Version History](RELEASE_NOTES.md)

## 🙏 Acknowledgments

- Built with [discord.js](https://discord.js.org/)
- Inspired by [I built something that changed my friend group's social fabric](https://blog.danpetrolito.xyz/i-built-something-that-changed-my-friend-gro-social-fabric/)
