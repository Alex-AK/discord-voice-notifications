# Contributing to Discord Voice Notifications

Thank you for considering contributing to this project! Here are some guidelines to help you get started.

## Development Setup

1. **Prerequisites**: Node.js 18.0.0 or higher
2. Fork the repository
3. Clone your fork: `git clone https://github.com/alex-ak/discord-voice-notifications.git`
4. Install dependencies: `npm install`
5. Copy `.env.example` to `.env` and configure your environment variables
6. Start development: `npm run dev`

## Code Style

- We use Prettier for code formatting
- Run `npm run format` to format your code
- Run `npm run lint` to check formatting
- Use TypeScript strict mode
- Follow existing naming conventions

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Ensure your code passes type checking: `npm run type-check`
5. Format your code: `npm run format`
6. Update documentation if needed
7. Create a pull request with a clear description

## Reporting Issues

When reporting issues, please include:

- Bot version
- Node.js version (18.0.0+ required)
- Error messages and stack traces
- Steps to reproduce
- Expected vs actual behavior

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions on-topic
