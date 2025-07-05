# Release Checklist

Use this checklist before publishing a new version of the Discord Voice Notifications bot.

## Pre-Release Verification

### ✅ Code Quality

- [ ] All TypeScript compiles without errors (`npm run type-check`)
- [ ] Code is properly formatted (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No security vulnerabilities (`npm audit`)

### ✅ Privacy & Security

- [ ] No external API calls except Discord API
- [ ] No database connections or external storage
- [ ] No user tracking or analytics code
- [ ] All user data is in-memory only
- [ ] `.env` file is in `.gitignore`
- [ ] Bot token and sensitive data excluded from repo

### ✅ Documentation

- [ ] README.md is up to date with current features
- [ ] COMMANDS.md reflects current slash commands
- [ ] CONTRIBUTING.md has clear guidelines
- [ ] `.env.example` includes all configuration options
- [ ] License file is present (MIT)

### ✅ Configuration

- [ ] All environment variables are documented
- [ ] Default values are sensible
- [ ] Error messages are helpful for setup issues
- [ ] Setup verification script works (`npm run verify`)

### ✅ Features

- [ ] Join notifications work correctly
- [ ] Leave notifications work correctly
- [ ] Minimum session time prevents spam
- [ ] Retry logic handles failures
- [ ] `/status` command shows comprehensive information
- [ ] Health monitoring is functional
- [ ] Graceful shutdown works

### ✅ Testing

- [ ] Manual testing in a Discord server
- [ ] Join/leave events trigger notifications
- [ ] Status command is ephemeral (private to user)
- [ ] Bot handles network disconnections gracefully
- [ ] Memory usage is reasonable

## Release Steps

1. [ ] Update version in `package.json`
2. [ ] Update any version references in documentation
3. [ ] Create release notes with new features/bug fixes (see [RELEASE_NOTES.md](RELEASE_NOTES.md))
4. [ ] Tag the release in git
5. [ ] Create GitHub release with release notes
6. [ ] Update any deployment documentation

## Post-Release

- [ ] Monitor for issues in GitHub issues
- [ ] Update any deployment guides if needed
- [ ] Consider adding to Discord bot directories
