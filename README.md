# Erela.JS - Enhanced Lavalink v4 Client

[![npm](https://img.shields.io/npm/v/erela.js)](https://www.npmjs.com/package/erela.js)
[![npm downloads](https://img.shields.io/npm/dt/erela.js)](https://www.npmjs.com/package/erela.js)
[![License](https://img.shields.io/npm/l/erela.js)](https://github.com/MenuDocs/erela.js/blob/master/LICENSE)

A powerful and modern Lavalink v4 client for Node.js with advanced audio filtering, improved performance, and extensive customization options.

> **Note**: This is a modernized fork of the original erela.js by MenuDocs, updated with full Lavalink v4 support, new audio filters, and enhanced features. For the original v2.x version, see [MenuDocs/erela.js](https://github.com/MenuDocs/erela.js).

## 🎉 What's New in v3.0

- ✨ **Full Lavalink v4 Support** - Updated REST API and WebSocket endpoints
- 🎛️ **Advanced Audio Filters** - Karaoke, Timescale, Tremolo, Vibrato, Rotation, Distortion, Channel Mix, Low Pass
- 🔍 **Extended Search Platforms** - YouTube, YouTube Music, Soundcloud, Spotify, Apple Music, Deezer, Yandex Music
- 🚀 **Better Performance** - Improved node balancing and connection management
- 📦 **Modern Dependencies** - Node.js 18+ support with latest packages
- 🎯 **Enhanced Type Safety** - Comprehensive TypeScript definitions
- 🔧 **Improved REST API** - v4 REST endpoints with better error handling
- 📊 **Player Statistics** - Track uptime, ping, and connection states
- 🎨 **Backward Compatible** - Works with existing v3 Lavalink nodes (legacy mode)

## 📦 Installation

### From npm (Stable Release)

```bash
npm install erela.js
# or
yarn add erela.js
# or
pnpm add erela.js
```

### From GitHub (Development/Latest)

```bash
# Install directly from GitHub
npm install ryxu-xo/erela.js

# or clone and install locally
git clone https://github.com/ryxu-xo/erela.js.git
cd erela.js
npm install
npm run build

# then in your project
npm install /path/to/erela.js
```

### Package Manager Alternatives

```bash
# Using Yarn from GitHub
yarn add https://github.com/ryxu-xo/erela.js

# Using pnpm from GitHub
pnpm add ryxu-xo/erela.js
```

## 🚀 Quick Start

```typescript
import { Manager } from "erela.js";
import { Client } from "discord.js";

const client = new Client({
  intents: ["Guilds", "GuildVoiceStates", "GuildMessages"]
});

const manager = new Manager({
  nodes: [{
    host: "localhost",
    port: 2333,
    password: "youshallnotpass",
  }],
  restVersion: "v4", // "v3" or "v4" (default: "v4")
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

manager.on("nodeConnect", node => {
  console.log(`Node ${node.options.identifier} connected`);
});

manager.on("trackStart", (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
  channel?.send(`Now playing: ${track.title}`);
});

client.on("ready", () => {
  manager.init(client.user.id);
  console.log("Bot is ready!");
});

client.on("raw", d => manager.updateVoiceState(d));

client.login("your-token-here");
```

## 🎵 Playing Music

```typescript
// Search for a track
const res = await manager.search("Never Gonna Give You Up", message.author);

// Create a player
const player = manager.create({
  guild: message.guild.id,
  voiceChannel: message.member.voice.channel.id,
  textChannel: message.channel.id,
});

// Connect to voice channel
player.connect();

// Add tracks to queue
player.queue.add(res.tracks[0]);

// Play
if (!player.playing) player.play();
```

## 🎛️ Audio Filters

### Applying Filters

```typescript
// Karaoke effect
player.filters.setKaraoke({
  level: 1.0,
  monoLevel: 1.0,
  filterBand: 220.0,
  filterWidth: 100.0
});

// Speed up audio (Nightcore)
player.filters.setTimescale({
  speed: 1.3,
  pitch: 1.3,
  rate: 1.0
});

// Tremolo effect
player.filters.setTremolo({
  frequency: 2.0,
  depth: 0.5
});

// Vibrato effect
player.filters.setVibrato({
  frequency: 2.0,
  depth: 0.5
});

// 8D Audio effect
player.filters.setRotation({
  rotationHz: 0.2
});

// Bass boost with equalizer
player.filters.setEqualizer([
  { band: 0, gain: 0.6 },
  { band: 1, gain: 0.67 },
  { band: 2, gain: 0.67 },
]);

// Clear all filters
player.filters.clearFilters();
```

## 🔍 Advanced Search Options

```typescript
// Search with specific platform
await manager.search({
  query: "Shape of You",
  source: "youtube music"
}, message.author);

// Available platforms:
// - "youtube"
// - "youtube music"
// - "soundcloud"
// - "spotify"
// - "apple music"
// - "deezer"
// - "yandex music"

// Or use direct URLs
await manager.search("https://open.spotify.com/track/...", message.author);
```

## ⚙️ Player Options

```typescript
const player = manager.create({
  guild: guildId,
  voiceChannel: voiceChannelId,
  textChannel: textChannelId,
  volume: 100,
  selfDeafen: true,
  selfMute: false,
});

// Volume control (0-1000)
player.setVolume(80);

// Track repeat
player.setTrackRepeat(true);

// Queue repeat
player.setQueueRepeat(true);

// Seek to position (milliseconds)
player.seek(60000);

// Pause/Resume
player.pause(true);
player.pause(false);

// Skip tracks
player.stop(); // Skip 1
player.stop(3); // Skip 3 tracks

// Restart current track
player.restart();

// Get player uptime
console.log(`Uptime: ${player.uptime}ms`);

// Get ping
console.log(`Ping: ${player.ping}ms`);
```

## 📊 Queue Management

```typescript
// Add tracks
player.queue.add(track);
player.queue.add([track1, track2, track3]);

// Add at specific position
player.queue.add(track, 0); // Add at start

// Remove tracks
player.queue.remove(0); // Remove first
player.queue.remove(2, 5); // Remove range

// Clear queue
player.queue.clear();

// Shuffle queue
player.queue.shuffle();

// Get queue info
console.log(`Size: ${player.queue.size}`);
console.log(`Total size: ${player.queue.totalSize}`);
console.log(`Duration: ${player.queue.duration}ms`);
console.log(`Current: ${player.queue.current?.title}`);
console.log(`Previous: ${player.queue.previous?.title}`);
```

## 🎯 Node Management

```typescript
// Multiple nodes for load balancing
const manager = new Manager({
  nodes: [
    {
      identifier: "node-1",
      host: "lavalink1.example.com",
      port: 2333,
      password: "password1",
    },
    {
      identifier: "node-2",
      host: "lavalink2.example.com",
      port: 2333,
      password: "password2",
    },
  ],
  // ... other options
});

// Get node stats
const stats = await manager.getStats();
console.log(`Players: ${stats.players}`);
console.log(`Playing Players: ${stats.playingPlayers}`);
console.log(`Uptime: ${stats.uptime}`);
console.log(`Memory: ${stats.memory.used / 1024 / 1024} MB`);

// Get Lavalink info
const info = await manager.getInfo();
console.log(`Version: ${info.version.semver}`);
console.log(`Plugins: ${info.plugins.map(p => p.name).join(", ")}`);

// Change player node
player.setNode("node-2");

// Get least used nodes
const leastUsed = manager.leastUsedNodes.first();

// Get least loaded nodes (by CPU)
const leastLoaded = manager.leastLoadNodes.first();
```

## 🎪 Events

```typescript
// Node events
manager.on("nodeCreate", (node) => {});
manager.on("nodeConnect", (node) => {});
manager.on("nodeReconnect", (node) => {});
manager.on("nodeDisconnect", (node, reason) => {});
manager.on("nodeError", (node, error) => {});
manager.on("nodeDestroy", (node) => {});
manager.on("nodeRaw", (payload) => {});

// Player events
manager.on("playerCreate", (player) => {});
manager.on("playerDestroy", (player) => {});
manager.on("playerMove", (player, oldChannel, newChannel) => {});
manager.on("playerDisconnect", (player, oldChannel) => {});

// Track events
manager.on("trackStart", (player, track) => {});
manager.on("trackEnd", (player, track, payload) => {});
manager.on("trackStuck", (player, track, payload) => {});
manager.on("trackError", (player, track, payload) => {});
manager.on("queueEnd", (player) => {});

// WebSocket events
manager.on("socketClosed", (player, payload) => {});
```

## 🔌 Plugin System

```typescript
import { Plugin } from "erela.js";

class MyPlugin extends Plugin {
  public load(manager) {
    console.log("Plugin loaded!");
    
    // Extend manager functionality
    manager.customFunction = () => {
      console.log("Custom function!");
    };
  }
  
  public unload(manager) {
    console.log("Plugin unloaded!");
  }
}

const manager = new Manager({
  plugins: [new MyPlugin()],
  // ... other options
});
```

## 🛠️ Extending Structures

```typescript
import { Structure } from "erela.js";

// Extend Player
Structure.extend("Player", (Player) => {
  class CustomPlayer extends Player {
    public customMethod() {
      console.log("Custom method!");
    }
  }
  return CustomPlayer;
});

// Extend Queue
Structure.extend("Queue", (Queue) => {
  class CustomQueue extends Queue {
    public getRandomTrack() {
      return this[Math.floor(Math.random() * this.length)];
    }
  }
  return CustomQueue;
});
```

## 📝 Configuration Options

```typescript
interface ManagerOptions {
  /** Array of Lavalink nodes */
  nodes?: NodeOptions[];
  
  /** Discord client ID */
  clientId?: string;
  
  /** Client name header for Lavalink */
  clientName?: string;
  
  /** Number of shards */
  shards?: number;
  
  /** Array of plugins */
  plugins?: Plugin[];
  
  /** Auto-play next track */
  autoPlay?: boolean;
  
  /** Track properties to keep */
  trackPartial?: string[];
  
  /** Default search platform */
  defaultSearchPlatform?: "youtube" | "youtube music" | "soundcloud" | "spotify" | "apple music" | "deezer" | "yandex music";
  
  /** Lavalink REST API version (default: "v4") */
  restVersion?: "v3" | "v4";
  
  /** Function to send packets to Discord */
  send: (id: string, payload: any) => void;
}

interface NodeOptions {
  /** Node identifier */
  identifier?: string;
  
  /** Node host */
  host: string;
  
  /** Node port (default: 2333) */
  port?: number;
  
  /** Node password */
  password?: string;
  
  /** Use SSL/TLS */
  secure?: boolean;
  
  /** Reconnection attempts (default: 5) */
  retryAmount?: number;
  
  /** Delay between reconnection attempts (default: 30000ms) */
  retryDelay?: number;
  
  /** Request timeout (default: 10000ms) */
  requestTimeout?: number;
  
  /** Undici pool options */
  poolOptions?: Pool.Options;
}
```

## 🔧 Lavalink v4 Configuration

Example `application.yml` for Lavalink v4:

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
    gc-warnings: true

plugins:
  - dependency: "com.github.topisenpai:lavasrc-plugin:4.0.0"
    repository: "https://maven.topi.wtf/releases"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **Original Library**: [MenuDocs](https://github.com/MenuDocs) team (erela.js v2.x)
- **v3.0 Modernization & Lavalink v4 Support**: [ryxu-xo](https://github.com/ryxu-xo)
- **Original Contributors**: Solaris9, Anish-Shobith, melike2d, ayntee
- Built for the Discord.js ecosystem
- Community contributors and testers

## 📚 Links

### This Fork (v3.0 - Lavalink v4)
- **GitHub Repository**: [ryxu-xo/erela.js](https://github.com/ryxu-xo/erela.js)
- **Issues & Support**: [GitHub Issues](https://github.com/ryxu-xo/erela.js/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ryxu-xo/erela.js/discussions)

### Original & Resources
- **Original erela.js**: [MenuDocs/erela.js](https://github.com/MenuDocs/erela.js)
- **npm Package**: [erela.js on npm](https://www.npmjs.com/package/erela.js)
- **Lavalink v4**: [Lavalink Repository](https://github.com/lavalink-devs/Lavalink)
- **Discord.js**: [Discord.js Guide](https://discordjs.guide)

## ⚠️ Requirements

- **Node.js**: 18.0.0 or higher
- **Lavalink**: v4.0.0 or higher (v3 supported via `restVersion: "v3"`)
- **Discord Library**: discord.js v14+, eris, or any compatible library
- **TypeScript**: 5.0+ (optional, for TypeScript projects)

## 🔄 Version Compatibility

| erela.js Version | Lavalink Version | Node.js Version |
|-----------------|------------------|-----------------|
| v3.0.x (this fork) | v4.0.0+ | 18.0.0+ |
| v2.4.0 (original) | v3.x | 16.0.0+ |

## 🆚 Differences from Original

This fork includes several major enhancements over the original erela.js:

### New Features ✨
- ✅ Full Lavalink v4 REST API and WebSocket support
- ✅ 8 advanced audio filters (Karaoke, Timescale, Tremolo, Vibrato, etc.)
- ✅ Extended search platforms (Spotify, Apple Music, Deezer, Yandex)
- ✅ Version switching (`restVersion` option for v3/v4 compatibility)
- ✅ Enhanced player statistics (ping, uptime tracking)
- ✅ Modern TypeScript 5.x support
- ✅ Updated dependencies (Node 18+, undici 6+)

### Migration from Original
If you're migrating from MenuDocs/erela.js v2.x:
1. Update Node.js to 18+
2. Update Lavalink to v4+
3. Install this fork: `npm install ryxu-xo/erela.js`
4. Optional: Add `restVersion: "v4"` to your config
5. Check [MIGRATION.md](./MIGRATION.md) for detailed guide

## 💡 Tips

- Use multiple nodes for better reliability and load balancing
- Implement proper error handling for production environments
- Monitor node stats to ensure optimal performance
- Use audio filters moderately to avoid quality degradation
- Always handle voice state updates from Discord properly

---

Made with ❤️ by the Erela.JS team
