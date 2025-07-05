import { createServer, IncomingMessage, ServerResponse } from "http";
import { URL } from "url";
import { logger } from "./logger";
import { HealthCheck } from "./health";

/**
 * HTTP server for health check endpoints
 */
export class HealthServer {
  private server: ReturnType<typeof createServer> | undefined;
  private healthCheck: HealthCheck;
  private port: number;

  constructor(healthCheck: HealthCheck, port: number = 3000) {
    this.healthCheck = healthCheck;
    this.port = port;
  }

  /**
   * Start the health check HTTP server
   */
  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = createServer(
        (req: IncomingMessage, res: ServerResponse) => {
          this.handleRequest(req, res);
        }
      );

      this.server.on("error", (error) => {
        logger.error("Health server error:", error);
        reject(error);
      });

      this.server.listen(this.port, () => {
        logger.info(
          `🏥 Health endpoint started on http://localhost:${this.port}/health`
        );
        resolve();
      });
    });
  }

  /**
   * Stop the health check HTTP server
   */
  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          logger.info("Health server stopped");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Handle incoming HTTP requests
   */
  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const path = url.pathname;

    // Set CORS headers for web browser compatibility
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === "GET") {
      switch (path) {
        case "/health":
          this.handleHealthCheck(res);
          break;
        case "/":
          this.handleRoot(res);
          break;
        default:
          this.handle404(res);
          break;
      }
    } else {
      this.handleMethodNotAllowed(res);
    }
  }

  /**
   * Handle health check endpoint
   */
  private handleHealthCheck(res: ServerResponse): void {
    try {
      const healthStatus = this.healthCheck.getStatus();
      const statusCode = healthStatus.status === "healthy" ? 200 : 503;

      res.writeHead(statusCode, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify(
          {
            status: healthStatus.status,
            timestamp: new Date().toISOString(),
            uptime: Math.round(healthStatus.uptime / 1000),
            discord: {
              connected: healthStatus.discordConnected,
              ping: healthStatus.ping,
              guilds: healthStatus.guildCount,
              users: healthStatus.userCount,
              voiceChannels: healthStatus.voiceChannelCount,
            },
            system: {
              memoryUsageMB: Math.round(
                healthStatus.memoryUsage.heapUsed / 1024 / 1024
              ),
              memoryTotalMB: Math.round(
                healthStatus.memoryUsage.heapTotal / 1024 / 1024
              ),
            },
          },
          null,
          2
        )
      );

      logger.debug(
        `Health check endpoint accessed - Status: ${healthStatus.status}`
      );
    } catch (error) {
      logger.error("Error in health check endpoint:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "error",
          message: "Internal server error",
          timestamp: new Date().toISOString(),
        })
      );
    }
  }

  /**
   * Handle root endpoint
   */
  private handleRoot(res: ServerResponse): void {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Discord Voice Notifications Bot</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
            .healthy { background-color: #d4edda; color: #155724; }
            .unhealthy { background-color: #f8d7da; color: #721c24; }
          </style>
        </head>
        <body>
          <h1>🤖 Discord Voice Notifications Bot</h1>
          <p>Health endpoint is running!</p>
          <p><strong>Available endpoints:</strong></p>
          <ul>
            <li><a href="/health">/health</a> - JSON health status</li>
            <li><a href="/">/</a> - This page</li>
          </ul>
        </body>
      </html>
    `);
  }

  /**
   * Handle 404 errors
   */
  private handle404(res: ServerResponse): void {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Not Found",
        message: "The requested endpoint was not found",
        availableEndpoints: ["/health", "/"],
      })
    );
  }

  /**
   * Handle method not allowed errors
   */
  private handleMethodNotAllowed(res: ServerResponse): void {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Method Not Allowed",
        message: "Only GET requests are supported",
      })
    );
  }
}
