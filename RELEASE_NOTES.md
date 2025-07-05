# Release Notes

## v0.1.0 - Beta Release (July 4, 2025)

🎉 **Beta release of Discord Voice Notifications - A privacy-first Discord bot for voice channel monitoring!**

### ✨ **What's New**

- **Voice Channel Notifications**: Automatic notifications when users join or leave voice channels
- **Anti-Spam Protection**: 10-second minimum session time prevents notification spam
- **Retry Logic**: Failed notifications are automatically retried once
- **Status Command**: `/status` slash command shows bot health and server statistics
- **Health Monitoring**: Built-in system monitoring and graceful shutdown
- **Privacy-First**: No external connections, databases, or user tracking

### 🔒 **Privacy Features**

- Only connects to Discord API
- All data stored in memory only
- No persistent storage or databases
- Local logging with configurable levels
- Status responses are private (ephemeral)

### ⚙️ **Configuration**

- Single channel or separate channels for join/leave notifications
- Configurable minimum session time and retry delays
- Environment-based configuration with `.env` file
- Multiple logging levels (ERROR, WARN, INFO, DEBUG)

### 🛠️ **Technical**

- Built with TypeScript and discord.js v14
- Modular architecture with clean separation of concerns
- Comprehensive error handling and resource management
- Production-ready with health checks

### 📝 **Documentation**

See [README.md](README.md) for complete setup instructions and [COMMANDS.md](COMMANDS.md) for command details.

---

**This is a beta release** - Ready for testing and feedback! Please report issues on [GitHub](https://github.com/alex-ak/discord-voice-notifications).
