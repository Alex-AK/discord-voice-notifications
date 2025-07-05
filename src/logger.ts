/**
 * Simple logger utility with different log levels
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private level: LogLevel;

  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    this.level = LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO;
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (level <= this.level) {
      const timestamp = new Date().toISOString();
      const levelName = LogLevel[level];
      console.log(`[${timestamp}] ${levelName}: ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }
}

export const logger = new Logger();
