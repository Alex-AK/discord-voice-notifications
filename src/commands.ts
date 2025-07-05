import {
  Client,
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { HealthCheck } from "./health";
import { BotConfig } from "./config";
import { logger } from "./logger";
import { getVoiceChannelStats } from "./utils";

/**
 * Commands handler for Discord slash commands
 */
export class CommandsHandler {
  private client: Client;
  private healthCheck: HealthCheck;
  private config: BotConfig;

  constructor(client: Client, healthCheck: HealthCheck, config: BotConfig) {
    this.client = client;
    this.healthCheck = healthCheck;
    this.config = config;
  }

  /**
   * Register slash commands with Discord
   */
  public async registerCommands(): Promise<void> {
    const commands = [
      new SlashCommandBuilder()
        .setName("status")
        .setDescription("Get detailed bot status information"),
    ];

    try {
      if (this.client.application) {
        await this.client.application.commands.set(commands);
        logger.info("✅ Slash commands registered successfully");
      }
    } catch (error) {
      logger.error("Failed to register slash commands:", error);
    }
  }

  /**
   * Handle slash command interactions
   */
  public async handleCommand(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    try {
      switch (interaction.commandName) {
        case "status":
          await this.handleStatusCommand(interaction);
          break;
        default:
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: "❌ Unknown command",
              flags: MessageFlags.Ephemeral,
            });
          }
      }
    } catch (error) {
      logger.error("Error handling command:", error);

      const errorMessage = "❌ An error occurred while processing the command";

      try {
        if (interaction.deferred) {
          await interaction.editReply({ content: errorMessage });
        } else if (interaction.replied) {
          await interaction.followUp({
            content: errorMessage,
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: errorMessage,
            flags: MessageFlags.Ephemeral,
          });
        }
      } catch (interactionError) {
        logger.error("Failed to respond to interaction:", interactionError);
      }
    }
  }

  /**
   * Handle the /status command
   */
  private async handleStatusCommand(
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      // Defer the reply immediately to prevent timeout issues
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      }

      const health = this.healthCheck.getStatus();
      const { voiceChannelCount, activeVoiceUsers } = getVoiceChannelStats(
        this.client
      );

      const embed = new EmbedBuilder()
        .setTitle("📊 Bot Status & Server Statistics")
        .setColor(health.status === "healthy" ? 0x00ff00 : 0xff0000)
        .addFields(
          {
            name: "🏥 Health",
            value: `Status: ${this.formatHealthStatus(
              health.status === "healthy"
            )}
Connection: ${this.formatConnectionStatus(health.discordConnected)}
Ping: ${health.ping}ms
Uptime: ${this.formatUptime(health.uptime)}`,
            inline: false,
          },
          {
            name: "🖥️ System Resources",
            value: `Memory: ${this.formatMemory(
              health.memoryUsage.heapUsed
            )} / ${this.formatMemory(health.memoryUsage.heapTotal)}
RSS: ${this.formatMemory(health.memoryUsage.rss)}`,
            inline: true,
          },
          {
            name: "🌐 Discord Stats",
            value: `Servers: ${health.guildCount}
Users: ${health.userCount}
Voice Channels: ${voiceChannelCount}
Active Voice Users: ${activeVoiceUsers}`,
            inline: true,
          },
          {
            name: "📬 Notification System",
            value: `Join Channel: <#${this.config.joinNotifyChannelId}>
Leave Channel: <#${this.config.leaveNotifyChannelId}>`,
            inline: false,
          },
          {
            name: "⚙️ Configuration",
            value: `Min Session Time: ${this.config.minimumSessionTime / 1000}s
Retry Delay: ${this.config.retryDelay / 1000}s`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({ text: "Detailed Status Report" });

      // Use editReply since we deferred the response
      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      logger.error("Error in handleStatusCommand:", error);

      // Handle the error appropriately based on interaction state
      const errorMessage = "❌ Failed to get status information";

      if (interaction.deferred) {
        await interaction.editReply({ content: errorMessage });
      } else if (!interaction.replied) {
        await interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }

  /**
   * Format uptime in a human-readable format
   */
  private formatUptime(uptimeMs: number): string {
    const totalSeconds = Math.floor(uptimeMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [
      days > 0 && `${days}d`,
      hours > 0 && `${hours}h`,
      minutes > 0 && `${minutes}m`,
      (seconds > 0 || totalSeconds < 60) && `${seconds}s`,
    ].filter(Boolean);

    return parts.join(" ");
  }

  /**
   * Format memory usage in MB
   */
  private formatMemory(bytes: number): string {
    return `${Math.round(bytes / 1024 / 1024)}MB`;
  }

  /**
   * Format health status with emoji
   */
  private formatHealthStatus(isHealthy: boolean): string {
    return isHealthy ? "✅ Healthy" : "❌ Unhealthy";
  }

  /**
   * Format connection status with emoji
   */
  private formatConnectionStatus(isConnected: boolean): string {
    return isConnected ? "✅ Connected" : "❌ Disconnected";
  }
}
