/**
 * Custom error classes for better error handling
 */

export class NotificationError extends Error {
  constructor(
    message: string,
    public readonly type: "JOIN" | "LEAVE",
    public readonly userId: string,
    public readonly isRetry: boolean = false
  ) {
    super(message);
    this.name = "NotificationError";
  }
}
