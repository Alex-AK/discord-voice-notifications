import { Client, TextChannel, VoiceState } from "discord.js";
import { BotConfig } from "./config";
import { NotificationError } from "./errors";
import { logger } from "./logger";

export type NotificationType = "JOIN" | "LEAVE";

/**
 * Handles sending voice channel notifications to Discord
 */
export async function sendNotification(
  client: Client,
  voiceState: VoiceState,
  config: BotConfig,
  type: NotificationType,
  isRetry = false
): Promise<void> {
  const { member, channel } = voiceState;

  if (!member || !channel) {
    logger.debug(
      `Skipping ${type.toLowerCase()} notification: missing member or channel`
    );
    return;
  }

  const channelId =
    type === "JOIN" ? config.joinNotifyChannelId : config.leaveNotifyChannelId;
  const emoji = type === "JOIN" ? "🔊" : "🔇";
  const action = type === "JOIN" ? "joined" : "left";

  try {
    const notificationChannel = await client.channels.fetch(channelId);
    if (!notificationChannel?.isTextBased()) {
      throw new NotificationError(
        "Notification channel not found or is not text-based",
        type,
        member.id,
        isRetry
      );
    }

    await (notificationChannel as TextChannel).send(
      `${emoji} **${member.displayName}** ${action} voice channel **${channel.name}**`
    );

    logger.info(
      `${type} notification sent for ${member.displayName} ${type === "JOIN" ? "in" : "from"} ${channel.name}`
    );
  } catch (error) {
    const errorMessage = `Failed to send ${type.toLowerCase()} notification for ${member.displayName}${isRetry ? " (retry)" : ""}`;
    logger.error(errorMessage, error);

    if (!isRetry) {
      logger.info(
        `Retrying ${type.toLowerCase()} notification for ${member.displayName} in ${config.retryDelay}ms`
      );
      setTimeout(() => {
        sendNotification(client, voiceState, config, type, true);
      }, config.retryDelay);
    } else {
      logger.error(
        `Final ${type.toLowerCase()} notification failure for ${member.displayName}`
      );
    }
  }
}
