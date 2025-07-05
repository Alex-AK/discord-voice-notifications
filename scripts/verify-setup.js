#!/usr/bin/env node

/**
 * Simple setup verification script for Discord Voice Notifications Bot
 * Run with: node scripts/verify-setup.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Verifying Discord Voice Notifications Bot setup...\n");

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

if (majorVersion < 18) {
  console.log("❌ Node.js 18.0.0 or higher is required");
  console.log(`   Current version: ${nodeVersion}`);
  console.log("   Please update Node.js: https://nodejs.org/");
  process.exit(1);
} else {
  console.log(`✅ Node.js version check passed (${nodeVersion})`);
}

// Check if .env file exists
const envPath = path.join(__dirname, "..", ".env");
const envExamplePath = path.join(__dirname, "..", ".env.example");

if (!fs.existsSync(envPath)) {
  console.log("❌ .env file not found");
  console.log(
    "📝 Please copy .env.example to .env and configure your settings:"
  );
  console.log("   cp .env.example .env\n");
  process.exit(1);
} else {
  console.log("✅ .env file found");
}

// Check .env file contents
try {
  const envContent = fs.readFileSync(envPath, "utf8");

  if (envContent.includes("your_bot_token_here")) {
    console.log("⚠️  Bot token not configured in .env file");
    console.log("📝 Please set your DISCORD_TOKEN in .env file\n");
    process.exit(1);
  } else {
    console.log("✅ Bot token appears to be configured");
  }

  if (envContent.includes("your_channel_id_here")) {
    console.log("⚠️  Channel ID(s) not configured in .env file");
    console.log(
      "📝 Please set your NOTIFY_CHANNEL_ID or JOIN_NOTIFY_CHANNEL_ID and LEAVE_NOTIFY_CHANNEL_ID in .env file\n"
    );
    process.exit(1);
  } else {
    console.log("✅ Channel ID(s) appears to be configured");
  }
} catch (error) {
  console.log("❌ Error reading .env file:", error.message);
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, "..", "node_modules");
if (!fs.existsSync(nodeModulesPath)) {
  console.log("❌ Dependencies not installed");
  console.log("📝 Please run: npm install\n");
  process.exit(1);
} else {
  console.log("✅ Dependencies installed");
}

// Check if dist directory exists (build artifacts)
const distPath = path.join(__dirname, "..", "dist");
if (!fs.existsSync(distPath)) {
  console.log("⚠️  Project not built yet");
  console.log('📝 Run "npm run build" to compile TypeScript\n');
} else {
  console.log("✅ Project built");
}

console.log("\n🎉 Setup verification complete!");
console.log("🚀 You can now start the bot with: npm run dev");
