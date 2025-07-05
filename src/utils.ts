import { Client, ChannelType } from "discord.js";

/**
 * Utility functions for Discord statistics
 */

/**
 * Count voice channels and active voice users across all guilds
 */
export function getVoiceChannelStats(client: Client): {
  voiceChannelCount: number;
  activeVoiceUsers: number;
} {
  let voiceChannelCount = 0;
  let activeVoiceUsers = 0;

  try {
    for (const guild of client.guilds.cache.values()) {
      if (!guild?.channels?.cache) continue;

      for (const channel of guild.channels.cache.values()) {
        if (!channel) continue;

        if (channel.type === ChannelType.GuildVoice) {
          voiceChannelCount++;
          if (
            channel &&
            "members" in channel &&
            channel.members &&
            typeof channel.members.size === "number"
          ) {
            activeVoiceUsers += channel.members.size;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in getVoiceChannelStats:", error);
    // Return safe defaults if there's an error
    return { voiceChannelCount: 0, activeVoiceUsers: 0 };
  }

  return { voiceChannelCount, activeVoiceUsers };
}
