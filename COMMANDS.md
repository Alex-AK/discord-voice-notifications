# Discord Slash Commands

This bot includes a comprehensive status command for monitoring and administration.

## Commands

### `/status`

- **Description**: Detailed bot status and server statistics
- **Response**: Comprehensive information about bot performance, Discord stats, and configuration
- **Usage**: Type `/status` in any channel where the bot has permissions
- **Permissions**: Available to all users (response is ephemeral - only visible to you)

**Example Response:**

```
📊 Bot Status & Server Statistics

🏥 Health
Status: ✅ Healthy
Connection: ✅ Connected
Ping: 45ms
Uptime: 2h 34m 12s

🖥️ System Resources
Memory: 67MB / 128MB
RSS: 89MB

🌐 Discord Stats
Servers: 1
Users: 156
Voice Channels: 8
Active Voice Users: 12

📬 Notification System
Pending Notifications: 3
Join Channel: #voice-activity
Leave Channel: #voice-activity

⚙️ Configuration
Min Session Time: 10s
Retry Delay: 2s
```

## Privacy

The status command uses ephemeral responses, meaning only the user who runs the command can see the response. This keeps server channels clean while providing administrative information.

> **Setup Instructions:** For bot setup and invite URL generation, see the main [README.md](README.md).
