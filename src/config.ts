/**
 * Configuration interface for the Discord voice notification bot
 */
export interface BotConfig {
  /** Discord bot token */
  discordToken: string;
  /** Channel ID where join notifications will be sent */
  joinNotifyChannelId: string;
  /** Channel ID where leave notifications will be sent */
  leaveNotifyChannelId: string;
  /** Minimum time (in milliseconds) a user must be in voice channel before notifications are sent */
  minimumSessionTime: number;
  /** Retry delay (in milliseconds) when notification sending fails */
  retryDelay: number;
  /** Port for the health check HTTP server */
  healthPort: number;
  /** Enable health check HTTP server */
  enableHealthEndpoint: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<BotConfig> = {
  minimumSessionTime: 10000, // 10 seconds
  retryDelay: 2000, // 2 seconds
  healthPort: 3000, // Default health check port
  enableHealthEndpoint: true, // Enable by default
};

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): BotConfig {
  const discordToken = process.env.DISCORD_TOKEN;
  if (!discordToken) {
    throw new Error("DISCORD_TOKEN environment variable is required");
  }

  const notifyChannelId = process.env.NOTIFY_CHANNEL_ID;
  const joinNotifyChannelId = process.env.JOIN_NOTIFY_CHANNEL_ID;
  const leaveNotifyChannelId = process.env.LEAVE_NOTIFY_CHANNEL_ID;

  let finalJoinChannelId: string;
  let finalLeaveChannelId: string;

  if (joinNotifyChannelId && leaveNotifyChannelId) {
    finalJoinChannelId = joinNotifyChannelId;
    finalLeaveChannelId = leaveNotifyChannelId;
  } else if (notifyChannelId) {
    finalJoinChannelId = notifyChannelId;
    finalLeaveChannelId = notifyChannelId;
  } else {
    throw new Error(
      "Either NOTIFY_CHANNEL_ID (for both) or both JOIN_NOTIFY_CHANNEL_ID and LEAVE_NOTIFY_CHANNEL_ID must be set"
    );
  }

  return {
    discordToken,
    joinNotifyChannelId: finalJoinChannelId,
    leaveNotifyChannelId: finalLeaveChannelId,
    minimumSessionTime:
      parseInt(process.env.MINIMUM_SESSION_TIME || "") ||
      DEFAULT_CONFIG.minimumSessionTime!,
    retryDelay:
      parseInt(process.env.RETRY_DELAY || "") || DEFAULT_CONFIG.retryDelay!,
    healthPort:
      parseInt(process.env.HEALTH_PORT || "") || DEFAULT_CONFIG.healthPort!,
    enableHealthEndpoint:
      process.env.ENABLE_HEALTH_ENDPOINT !== "false" &&
      DEFAULT_CONFIG.enableHealthEndpoint!,
  };
}
