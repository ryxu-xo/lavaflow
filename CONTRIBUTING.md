<<<<<<< HEAD
# Contributing to Lava.ts

Thank you for your interest in contributing to Lava.ts! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lava.ts.git
   cd lava.ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## Project Structure

```
lava.ts/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── manager/
│   │   ├── Manager.ts           # High-level manager
│   │   ├── VoiceForwarder.ts    # Voice state handling
│   │   └── events.ts            # Event system
│   ├── nodes/
│   │   ├── Node.ts              # Single node management
│   │   └── NodeManager.ts       # Node manager singleton
│   ├── player/
│   │   ├── Player.ts            # Player class
│   │   └── FilterBuilder.ts     # Filter builder
│   ├── types/
│   │   └── lavalink.ts          # TypeScript definitions
│   └── utils/
│       ├── http.ts              # HTTP client
│       └── backoff.ts           # Backoff utility
├── examples/                     # Usage examples
├── tests/                        # Test files
└── docs/                         # Documentation
```

## Coding Standards

### TypeScript

- Use strict TypeScript with all strict checks enabled
- Prefer `interface` over `type` for object definitions
- Always provide explicit return types for functions
- Use `readonly` where appropriate
- Avoid `any` - use `unknown` instead

### Code Style

- Use 2 spaces for indentation
- Max line length: 100 characters
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use descriptive variable names

### Documentation

- Add JSDoc comments for all public APIs
- Include parameter descriptions and return types
- Provide usage examples for complex functions
- Document design decisions in comments

### Example

```typescript
/**
 * Load tracks from a search query or URL
 * @param identifier - Search query or track URL
 * @returns LoadResult with track data
 * @example
 * ```ts
 * const result = await node.loadTracks('ytsearch:never gonna give you up');
 * ```
 */
public async loadTracks(identifier: string): Promise<LoadResult> {
  const encodedIdentifier = encodeURIComponent(identifier);
  return this.http.get<LoadResult>(`/v4/loadtracks?identifier=${encodedIdentifier}`);
}
```

## Design Patterns

### Singleton Pattern
Used for `NodeManager` to ensure single source of truth for node management.

### Factory Pattern
Used for creating `Player` instances through the `Manager`.

### Builder Pattern
Used in `FilterBuilder` for chainable filter configuration.

### Event-Driven
All major operations emit events for reactive programming.

## Testing

We use Jest for testing. All new features should include tests.

```bash
npm test
```

### Test Guidelines

- Write unit tests for all new functions
- Test edge cases and error conditions
- Mock external dependencies (WebSocket, HTTP)
- Aim for >80% code coverage

### Example Test

```typescript
describe('Player', () => {
  it('should set volume correctly', async () => {
    const player = new Player(options, node, eventEmitter);
    await player.setVolume(75);
    expect(player.volume).toBe(75);
  });

  it('should throw error for invalid volume', async () => {
    const player = new Player(options, node, eventEmitter);
    await expect(player.setVolume(150)).rejects.toThrow('Volume must be between 0 and 100');
  });
});
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(player): add support for playlist loading

Add ability to load and queue entire playlists with a single call.
Includes automatic track queueing and playlist info tracking.

Closes #123
```

```
fix(node): prevent reconnection loop on permanent failures

Add maximum retry attempts to prevent infinite reconnection loops
when node is permanently unavailable.

Fixes #456
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build
   npm test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots/examples if applicable

## Feature Requests

Have an idea for a new feature? We'd love to hear it!

1. Check existing issues to avoid duplicates
2. Create a new issue with the `enhancement` label
3. Describe the feature and use case
4. Discuss implementation approach

## Bug Reports

Found a bug? Help us fix it!

1. Check if the bug is already reported
2. Create a new issue with the `bug` label
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, OS, etc.)
   - Code samples if applicable

## Questions?

- Open a discussion on GitHub Discussions
- Join our Discord server
- Check the documentation wiki

## License

By contributing to Lava.ts, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎵
=======
/*
* lavaflow Contributing
*/


# Contributing to lavaflow

Thank you for your interest in contributing to lavaflow! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryxu-xo/lavaflow.git
   cd lavaflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## Project Structure

```
lavaflow/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── manager/
│   │   ├── Manager.ts           # High-level manager
│   │   ├── VoiceForwarder.ts    # Voice state handling
│   │   └── events.ts            # Event system
│   ├── nodes/
│   │   ├── Node.ts              # Single node management
│   │   └── NodeManager.ts       # Node manager singleton
│   ├── player/
│   │   ├── Player.ts            # Player class
│   │   └── FilterBuilder.ts     # Filter builder
│   ├── types/
│   │   └── lavalink.ts          # TypeScript definitions
│   └── utils/
│       ├── http.ts              # HTTP client
│       └── backoff.ts           # Backoff utility
├── examples/                     # Usage examples
├── tests/                        # Test files
└── docs/                         # Documentation
```

## Coding Standards

### TypeScript

- Use strict TypeScript with all strict checks enabled
- Prefer `interface` over `type` for object definitions
- Always provide explicit return types for functions
- Use `readonly` where appropriate
- Avoid `any` - use `unknown` instead

### Code Style

- Use 2 spaces for indentation
- Max line length: 100 characters
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use descriptive variable names

### Documentation

- Add JSDoc comments for all public APIs
- Include parameter descriptions and return types
- Provide usage examples for complex functions
- Document design decisions in comments

### Example

```typescript
/**
 * Load tracks from a search query or URL
 * @param identifier - Search query or track URL
 * @returns LoadResult with track data
 * @example
 * ```ts
 * const result = await node.loadTracks('ytsearch:never gonna give you up');
 * ```
 */
public async loadTracks(identifier: string): Promise<LoadResult> {
  const encodedIdentifier = encodeURIComponent(identifier);
  return this.http.get<LoadResult>(`/v4/loadtracks?identifier=${encodedIdentifier}`);
}
```

## Design Patterns

### Singleton Pattern
Used for `NodeManager` to ensure single source of truth for node management.

### Factory Pattern
Used for creating `Player` instances through the `Manager`.

### Builder Pattern
Used in `FilterBuilder` for chainable filter configuration.

### Event-Driven
All major operations emit events for reactive programming.

## Testing

We use Jest for testing. All new features should include tests.

```bash
npm test
```

### Test Guidelines

- Write unit tests for all new functions
- Test edge cases and error conditions
- Mock external dependencies (WebSocket, HTTP)
- Aim for >80% code coverage

### Example Test

```typescript
describe('Player', () => {
  it('should set volume correctly', async () => {
    const player = new Player(options, node, eventEmitter);
    await player.setVolume(75);
    expect(player.volume).toBe(75);
  });

  it('should throw error for invalid volume', async () => {
    const player = new Player(options, node, eventEmitter);
    await expect(player.setVolume(150)).rejects.toThrow('Volume must be between 0 and 100');
  });
});
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(player): add support for playlist loading

Add ability to load and queue entire playlists with a single call.
Includes automatic track queueing and playlist info tracking.

Closes #123
```

```
fix(node): prevent reconnection loop on permanent failures

Add maximum retry attempts to prevent infinite reconnection loops
when node is permanently unavailable.

Fixes #456
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build
   npm test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots/examples if applicable

## Feature Requests

Have an idea for a new feature? We'd love to hear it!

1. Check existing issues to avoid duplicates
2. Create a new issue with the `enhancement` label
3. Describe the feature and use case
4. Discuss implementation approach

## Bug Reports

Found a bug? Help us fix it!

1. Check if the bug is already reported
2. Create a new issue with the `bug` label
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, OS, etc.)
   - Code samples if applicable

## Questions?

- Open a discussion on GitHub Discussions
- Join our Discord server
- Check the documentation wiki

## License

By contributing to lavaflow, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎵
>>>>>>> 39abba04681b7f67abc1b2f860831d5359128596
