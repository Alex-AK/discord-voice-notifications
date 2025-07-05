import { Client } from "discord.js";
import { logger } from "./logger";
import { getVoiceChannelStats } from "./utils";

/**
 * Health check utility for monitoring bot status
 */
export class HealthCheck {
  private client: Client;
  private lastHeartbeat: number = Date.now();
  private checkInterval: NodeJS.Timeout | undefined;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Start periodic health checks
   */
  public start(intervalMs: number = 30000): void {
    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);

    logger.info(`Health check started with ${intervalMs}ms interval`);
  }

  /**
   * Stop health checks
   */
  public stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }
  }

  /**
   * Get current health status
   */
  public getStatus(): {
    status: "healthy" | "unhealthy";
    lastHeartbeat: number;
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    discordConnected: boolean;
    guildCount: number;
    userCount: number;
    voiceChannelCount: number;
    ping: number;
  } {
    const now = Date.now();
    const discordConnected = this.client.isReady();
    const { voiceChannelCount } = getVoiceChannelStats(this.client);

    return {
      status:
        discordConnected && now - this.lastHeartbeat < 60000
          ? "healthy"
          : "unhealthy",
      lastHeartbeat: this.lastHeartbeat,
      uptime: process.uptime() * 1000,
      memoryUsage: process.memoryUsage(),
      discordConnected,
      guildCount: this.client.guilds.cache.size,
      userCount: this.client.users.cache.size,
      voiceChannelCount,
      ping: this.client.ws.ping,
    };
  }

  /**
   * Perform health check and log status
   */
  private performHealthCheck(): void {
    this.lastHeartbeat = Date.now();
    const status = this.getStatus();

    if (status.status === "healthy") {
      logger.debug("Health check passed", {
        uptime: Math.round(status.uptime / 1000),
        memoryMB: Math.round(status.memoryUsage.heapUsed / 1024 / 1024),
      });
    } else {
      logger.warn("Health check failed", status);
    }
  }
}
