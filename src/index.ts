import { Client, GatewayIntentBits, Events } from "discord.js";
import dotenv from "dotenv";
import { loadConfig } from "./config";
import { sendNotification } from "./notification";
import { logger } from "./logger";
import { HealthCheck } from "./health";
import { HealthServer } from "./health-server";
import { CommandsHandler } from "./commands";

// Load environment variables
dotenv.config();

/**
 * Main application class for Discord Voice Notification Bot
 */
class VoiceNotificationBot {
  private client: Client;
  private config: ReturnType<typeof loadConfig>;
  private userJoinTimes = new Map<string, number>();
  private healthCheck: HealthCheck;
  private healthServer: HealthServer | undefined;
  private commandsHandler: CommandsHandler;

  constructor() {
    try {
      this.config = loadConfig();
    } catch (error) {
      logger.error("Failed to load configuration:", error);
      process.exit(1);
    }

    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });

    this.healthCheck = new HealthCheck(this.client);

    // Initialize health server if enabled
    if (this.config.enableHealthEndpoint) {
      this.healthServer = new HealthServer(
        this.healthCheck,
        this.config.healthPort
      );
    }

    this.commandsHandler = new CommandsHandler(
      this.client,
      this.healthCheck,
      this.config
    );
    this.setupEventHandlers();
  }

  /**
   * Set up Discord client event handlers
   */
  private setupEventHandlers(): void {
    this.client.once(Events.ClientReady, async () => {
      logger.info(`✅ Bot logged in as ${this.client.user?.tag}`);
      logger.info(`📢 Monitoring voice channel activity...`);
      logger.info(
        `📥 Join notifications: Channel ID ${this.config.joinNotifyChannelId}`
      );
      logger.info(
        `📤 Leave notifications: Channel ID ${this.config.leaveNotifyChannelId}`
      );
      this.healthCheck.start();

      // Start health server if enabled
      if (this.healthServer) {
        try {
          await this.healthServer.start();
        } catch (error) {
          logger.error("Failed to start health server:", error);
        }
      }

      this.commandsHandler.registerCommands();
    });

    this.client.on(Events.VoiceStateUpdate, (oldState, newState) => {
      this.handleVoiceStateUpdate(oldState, newState);
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        await this.commandsHandler.handleCommand(interaction);
      }
    });

    this.client.on(Events.Error, (error) => {
      logger.error("Discord client error:", error);
    });

    // Graceful shutdown handling
    process.on("SIGINT", () => this.shutdown());
    process.on("SIGTERM", () => this.shutdown());
  }

  /**
   * Handle voice state updates (join/leave events)
   */
  private async handleVoiceStateUpdate(
    oldState: any,
    newState: any
  ): Promise<void> {
    const member = newState.member || oldState.member;
    if (!member) return;

    const userHasJoined = !oldState.channel && newState.channel;
    const userHasLeft = oldState.channel && !newState.channel;

    if (userHasJoined) {
      await this.handleUserJoin(member.id, newState);
    } else if (userHasLeft) {
      await this.handleUserLeave(member.id, oldState);
    }
  }

  /**
   * Handle user joining a voice channel
   */
  private async handleUserJoin(userId: string, newState: any): Promise<void> {
    logger.debug(
      `User ${userId} joined voice channel ${newState.channel.name}`
    );

    this.userJoinTimes.set(userId, Date.now());

    // Send notification after minimum session time delay
    setTimeout(() => {
      if (this.userJoinTimes.has(userId)) {
        sendNotification(this.client, newState, this.config, "JOIN");
      }
    }, this.config.minimumSessionTime);
  }

  /**
   * Handle user leaving a voice channel
   */
  private async handleUserLeave(userId: string, oldState: any): Promise<void> {
    logger.debug(`User ${userId} left voice channel ${oldState.channel.name}`);

    const joinTime = this.userJoinTimes.get(userId);

    // Only send leave notification if user was in channel long enough
    if (joinTime && Date.now() - joinTime > this.config.minimumSessionTime) {
      await sendNotification(this.client, oldState, this.config, "LEAVE");
    }

    this.userJoinTimes.delete(userId);
  }

  /**
   * Start the bot
   */
  public async start(): Promise<void> {
    try {
      await this.client.login(this.config.discordToken);
    } catch (error) {
      logger.error("Failed to log in to Discord:", error);
      process.exit(1);
    }
  }

  /**
   * Gracefully shutdown the bot
   */
  private async shutdown(): Promise<void> {
    logger.info("🛑 Shutting down bot...");

    // Clear user join times
    this.userJoinTimes.clear();

    this.healthCheck.stop();

    // Stop health server if running
    if (this.healthServer) {
      try {
        await this.healthServer.stop();
      } catch (error) {
        logger.error("Error stopping health server:", error);
      }
    }

    await this.client.destroy();
    logger.info("👋 Bot shutdown complete");
    process.exit(0);
  }
}

// Start the bot if this file is run directly
if (require.main === module) {
  const bot = new VoiceNotificationBot();
  bot.start().catch((error) => {
    logger.error("Failed to start bot:", error);
    process.exit(1);
  });
}
