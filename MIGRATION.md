# Migration Guide: v2.x → v3.0

This guide will help you migrate from erela.js v2.x to v3.0 with Lavalink v4 support.

## Prerequisites

Before starting the migration:

1. **Node.js 18+** - Upgrade if you're on an older version
2. **Lavalink v4** - Download and configure Lavalink v4
3. **Backup** - Save your current code before migrating

## Quick Migration Checklist

- [ ] Update Node.js to 18+
- [ ] Set up Lavalink v4
- [ ] Update erela.js to v3.0
- [ ] Update your code (if needed)
- [ ] Test thoroughly
- [ ] Deploy

## Step 1: Update Node.js

```bash
# Check your current version
node --version

# If below 18, upgrade Node.js
# Download from: https://nodejs.org/
```

## Step 2: Set Up Lavalink v4

### Download Lavalink v4

```bash
# Download the latest Lavalink v4 JAR
wget https://github.com/lavalink-devs/Lavalink/releases/download/4.0.0/Lavalink.jar
```

### Configure Lavalink

Create `application.yml`:

```yaml
server:
  port: 2333
  address: 0.0.0.0

lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      http: true
      local: false
    filters:
      volume: true
      equalizer: true
      karaoke: true
      timescale: true
      tremolo: true
      vibrato: true
      distortion: true
      rotation: true
      channelMix: true
      lowPass: true
    bufferDurationMs: 400
    frameBufferDurationMs: 5000
    youtubePlaylistLoadLimit: 6
    playerUpdateInterval: 5
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true

metrics:
  prometheus:
    enabled: false
    endpoint: /metrics

sentry:
  dsn: ""
  environment: ""

logging:
  file:
    path: ./logs/

  level:
    root: INFO
    lavalink: INFO
```

### Optional: Add Plugins

For Spotify, Apple Music, Deezer support:

```yaml
plugins:
  - dependency: "com.github.topisenpai:lavasrc-plugin:4.0.0"
    repository: "https://maven.topi.wtf/releases"
```

### Start Lavalink

```bash
java -jar Lavalink.jar
```

## Step 3: Update erela.js

```bash
# Using npm
npm install erela.js@latest

# Using yarn
yarn add erela.js@latest

# Using pnpm
pnpm add erela.js@latest
```

## Step 4: Update Your Code

### Manager Configuration

**v2.x code:**
```typescript
const manager = new Manager({
  nodes: [{
    host: "localhost",
    port: 2333,
    password: "youshallnotpass",
  }],
  send: (id, payload) => { /* ... */ },
});
```

**v3.0 code (same!):**
```typescript
const manager = new Manager({
  nodes: [{
    host: "localhost",
    port: 2333,
    password: "youshallnotpass",
  }],
  send: (id, payload) => { /* ... */ },
});
```

✅ **No changes needed for basic configuration!**

### Search LoadType Handling

**v2.x code:**
```typescript
const res = await manager.search(query, user);

if (res.loadType === "SEARCH_RESULT") {
  // Add tracks
}
if (res.loadType === "PLAYLIST_LOADED") {
  // Add playlist
}
```

**v3.0 code (recommended):**
```typescript
const res = await manager.search(query, user);

// New v4 format (recommended)
if (res.loadType === "search") {
  // Add tracks
}
if (res.loadType === "playlist") {
  // Add playlist
}

// OR keep old format (still works!)
if (res.loadType === "SEARCH_RESULT") {
  // Add tracks
}
if (res.loadType === "PLAYLIST_LOADED") {
  // Add playlist
}
```

✅ **Backward compatible - both formats work!**

### Using New Features

#### Audio Filters (NEW in v3.0)

```typescript
// Nightcore effect
player.filters.setTimescale({
  speed: 1.3,
  pitch: 1.3,
  rate: 1.0
});

// 8D Audio
player.filters.setRotation({ rotationHz: 0.2 });

// Bass Boost
player.filters.setEqualizer([
  { band: 0, gain: 0.6 },
  { band: 1, gain: 0.67 },
  { band: 2, gain: 0.67 },
]);

// Clear filters
player.filters.clearFilters();
```

#### Extended Search Platforms (NEW in v3.0)

```typescript
// Search YouTube Music
await manager.search({
  query: "song name",
  source: "youtube music"
}, user);

// Search Spotify (requires plugin)
await manager.search({
  query: "song name",
  source: "spotify"
}, user);

// Search Apple Music (requires plugin)
await manager.search({
  query: "song name",
  source: "apple music"
}, user);
```

#### New Player Features

```typescript
// Get player ping
console.log(`Ping: ${player.ping}ms`);

// Get player uptime
console.log(`Uptime: ${player.uptime}ms`);

// Restart current track
player.restart();

// Change player node
player.setNode("backup-node");
```

#### Node Information (NEW in v3.0)

```typescript
// Get Lavalink info
const info = await manager.getInfo();
console.log(`Version: ${info.version.semver}`);
console.log(`Plugins: ${info.plugins.map(p => p.name).join(", ")}`);

// Get node stats
const stats = await manager.getStats();
console.log(`Players: ${stats.players}`);
console.log(`Memory: ${stats.memory.used / 1024 / 1024} MB`);
```

## Step 5: Common Migration Patterns

### Pattern 1: Basic Play Command

**Before and After (SAME!):**
```typescript
const res = await manager.search(query, user);
const player = manager.create({
  guild: guildId,
  voiceChannel: voiceChannelId,
  textChannel: textChannelId,
});

player.connect();
player.queue.add(res.tracks[0]);
if (!player.playing) player.play();
```

### Pattern 2: Queue Management

**Before and After (SAME!):**
```typescript
// Add tracks
player.queue.add(track);

// Remove tracks
player.queue.remove(0);

// Clear queue
player.queue.clear();

// Shuffle
player.queue.shuffle();
```

### Pattern 3: Volume Control

**Before and After (SAME!):**
```typescript
player.setVolume(80);
```

### Pattern 4: Equalizer (IMPROVED in v3.0)

**v2.x:**
```typescript
player.setEQ([
  { band: 0, gain: 0.6 },
  { band: 1, gain: 0.67 },
]);
```

**v3.0 (recommended):**
```typescript
// Old method still works!
player.setEQ([
  { band: 0, gain: 0.6 },
  { band: 1, gain: 0.67 },
]);

// New recommended way
player.filters.setEqualizer([
  { band: 0, gain: 0.6 },
  { band: 1, gain: 0.67 },
]);
```

## Step 6: Testing Your Migration

### Test Checklist

1. **Basic Playback**
   ```typescript
   await manager.search("test song", user);
   player.queue.add(track);
   player.play();
   ```

2. **Queue Operations**
   ```typescript
   player.queue.add(tracks);
   player.queue.shuffle();
   player.skip();
   ```

3. **Volume Control**
   ```typescript
   player.setVolume(50);
   ```

4. **Filters (NEW)**
   ```typescript
   player.filters.setTimescale({ speed: 1.3 });
   player.filters.clearFilters();
   ```

5. **Multiple Nodes**
   ```typescript
   const node1 = manager.nodes.get("node1");
   const node2 = manager.nodes.get("node2");
   ```

## Troubleshooting

### Issue: "No available nodes"

**Cause:** Lavalink v4 not running or connection failed

**Solution:**
1. Check Lavalink is running: `java -jar Lavalink.jar`
2. Verify configuration in `application.yml`
3. Check password matches in both configs
4. Look for connection errors in logs

### Issue: "Cannot find module 'undici'"

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
# or
yarn install
```

### Issue: "Query not found" errors

**Cause:** Using old Lavalink v3 server

**Solution:**
- Upgrade to Lavalink v4
- Or downgrade erela.js to v2.x for v3 support

### Issue: Filters not working

**Cause:** Filters disabled in Lavalink config

**Solution:**
Add to `application.yml`:
```yaml
lavalink:
  server:
    filters:
      volume: true
      equalizer: true
      karaoke: true
      timescale: true
      tremolo: true
      vibrato: true
      distortion: true
      rotation: true
      channelMix: true
      lowPass: true
```

### Issue: Search returns empty

**Cause:** Search source not enabled

**Solution:**
Enable sources in `application.yml`:
```yaml
lavalink:
  server:
    sources:
      youtube: true
      soundcloud: true
```

## Best Practices

### 1. Error Handling

```typescript
manager.on("nodeError", (node, error) => {
  console.error(`Node ${node.options.identifier} error:`, error);
});

manager.on("trackError", (player, track, payload) => {
  console.error(`Track error: ${track.title}`, payload);
  player.stop(); // Skip to next
});
```

### 2. Graceful Shutdown

```typescript
process.on("SIGINT", () => {
  console.log("Shutting down...");
  
  // Destroy all players
  for (const player of manager.players.values()) {
    player.destroy();
  }
  
  // Destroy all nodes
  for (const node of manager.nodes.values()) {
    node.destroy();
  }
  
  process.exit(0);
});
```

### 3. Multiple Nodes

```typescript
const manager = new Manager({
  nodes: [
    {
      identifier: "primary",
      host: "lavalink1.example.com",
      port: 2333,
      password: "password",
    },
    {
      identifier: "backup",
      host: "lavalink2.example.com",
      port: 2333,
      password: "password",
    },
  ],
  // ...
});
```

## What's Next?

After migrating, explore new features:

1. **Audio Filters** - Create unique sound effects
2. **Extended Search** - Use Spotify, Apple Music, etc.
3. **Better Monitoring** - Track node stats and player info
4. **Enhanced Queue** - Better queue management

## Getting Help

If you encounter issues:

1. Check the [README.md](./README.md) for examples
2. Review the [CHANGELOG.md](./CHANGELOG.md) for changes
3. Open an issue on GitHub
4. Join our Discord community

## Rollback Plan

If you need to rollback:

```bash
# Reinstall v2.x
npm install erela.js@2.4.0

# Use Lavalink v3
java -jar Lavalink-v3.jar
```

---

**Happy migrating! 🎉**

For more information, see:
- [README.md](./README.md) - Full documentation
- [CHANGELOG.md](./CHANGELOG.md) - Detailed changes
- [example.ts](./example.ts) - Working example
