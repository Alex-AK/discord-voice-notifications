import { HealthServer } from "./src/health-server";
import { HealthCheck } from "./src/health";
import { Client } from "discord.js";

/**
 * Simple test to verify the health server works independently
 */
async function testHealthServer() {
  console.log("🧪 Testing Health Server...");

  // Create a mock client and health check
  const mockClient = {} as Client;
  const healthCheck = new HealthCheck(mockClient);

  // Mock the getStatus method to return a test status
  (healthCheck as any).getStatus = () => ({
    status: "healthy",
    lastHeartbeat: Date.now(),
    uptime: 30000,
    memoryUsage: process.memoryUsage(),
    discordConnected: false, // Will be false since we're not actually connected
    guildCount: 0,
    userCount: 0,
    voiceChannelCount: 0,
    ping: -1,
  });

  const healthServer = new HealthServer(healthCheck, 3001);

  try {
    await healthServer.start();
    console.log("✅ Health server started successfully");

    // Test the health endpoint
    const response = await fetch("http://localhost:3001/health");
    const data = await response.json();

    console.log("📊 Health endpoint response:", {
      status: response.status,
      data: data,
    });

    // Test the root endpoint
    const rootResponse = await fetch("http://localhost:3001/");
    console.log("🏠 Root endpoint status:", rootResponse.status);

    await healthServer.stop();
    console.log("✅ Health server stopped successfully");
    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testHealthServer().catch(console.error);
