# lavaflow

> A professional-grade, TypeScript-first Lavalink v4 client library for Node.js

[![npm version](https://img.shields.io/npm/v/lavaflow.svg)](https://www.npmjs.com/package/lavaflow)
[![License](https://img.shields.io/npm/l/lavaflow.svg)](LICENSE)

**v2.0.0** - Now with advanced queue management, production-ready bot examples, and comprehensive documentation!

## Features

### 🆕 v2.0.0 Highlights
- **Advanced Queue Management** - `playNext()`, `moveTrack()`, `swapTracks()`, `jumpTo()`, `getQueueInfo()`, `getUpcoming()`
- **Player Statistics** - Comprehensive metrics and history tracking
- **Production-Ready Bot Examples** - Advanced bot with 19 commands, rich embeds, interactive UI
- **Comprehensive Guides** - 4 documentation files covering setup, commands, comparisons, and visuals

### Core Features
- 🎯 **Full Lavalink v4 Support** - Complete implementation of the latest REST API and WebSocket protocol
- 🏗️ **TypeScript-First** - Strongly typed APIs with full autocomplete support
- ⚡ **Smart Load Balancing** - Advanced penalty system for optimal node selection
- 🌍 **Voice Region Optimization** - Auto-select nodes based on Discord voice region
- 🔄 **Automatic Reconnection** - Exponential backoff with jitter for fault tolerance
- ⏱️ **Rate Limiting Handler** - Built-in retry strategies (exponential/linear/none)
- 🎨 **Fluent Filter API** - Chainable filter configuration for elegant code
- 🎭 **Event-Driven** - Comprehensive event system for reactive programming
- 🔌 **Plugin Support** - Extend functionality with custom plugins
- 🛡️ **Production-Ready** - Battle-tested design patterns and error handling

### Player Features
- ▶️ **Full Playback Control** - Play, pause, resume, stop, seek
- ⏭️ **Queue Management** - Add, remove, clear, shuffle queue
- ⏮️ **Previous Track** - Play previous tracks (last 10 stored)
- � **Shuffle** - Randomize queue order
- �🔁 **Loop Modes** - Track loop, queue loop, or off
- 📜 **Playback History** - Track last 50 played songs
- ⭐ **Favorites/Bookmarks** - Save favorite tracks per user/guild
- 💾 **Queue Persistence** - Save and restore queue state
- 🔊 **Volume Control** - 0-100% volume adjustment with normalization
- 🎛️ **Speed/Pitch Control** - Independent speed and pitch adjustment (0.25x-3.0x)
- 🌊 **Crossfade** - Smooth transitions between tracks
- 🎵 **Gapless Playback** - Seamless track transitions
- 🔍 **Multi-Platform Search** - YouTube, YouTube Music, SoundCloud support
- 📊 **Position Tracking** - Real-time playback position updates
- 🤖 **Intelligent AutoPlay** - Automatically plays related tracks when queue ends (YouTube, SoundCloud, Spotify)
- 💿 **Metadata Cache** - Cache track info to reduce API calls

### Audio Filters
- 🎚️ **10 Filter Types** - Volume, Equalizer, Karaoke, Timescale, Tremolo, Vibrato, Rotation, Distortion, ChannelMix, LowPass
- 🎵 **8 Equalizer Presets** - Bass, Treble, Soft, Flat, Electronic, Rock, Classical, Pop
- ✨ **5 Effect Presets** - Nightcore, Vaporwave, 8D Audio, Bassboost (4 levels), Soft
- 🔗 **Chainable API** - Fluent filter configuration with `filters().effect1().effect2().apply()`

## Installation

```bash
npm install lavaflow
```

## Quick Start

### Basic Usage

```typescript
import { Manager } from 'lavaflow';
import { Client } from 'discord.js';

const client = new Client({ intents: ['Guilds', 'GuildVoiceStates'] });

const manager = new Manager({
  nodes: [
    {
      name: 'Node 1',
      host: 'localhost',
      port: 2333,
      password: 'youshallnotpass',
      secure: false
    }
  ],
  send: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(payload);
  },
  autoPlay: true,
  debug: false
});

// Initialize manager after client is ready
client.on('ready', () => {
  manager.init(client.user!.id);
});

// Forward voice state updates
client.on('raw', (packet) => {
  if (manager.isInitialized()) {
    manager.updateVoiceState(packet);
  }
});

// Create and use a player
const player = manager.create({
  guildId: 'guild-id',
  voiceChannelId: 'voice-channel-id',
  textChannelId: 'text-channel-id'
});

await player.connect();

const result = await player.search('Never Gonna Give You Up');
if (result.loadType === 'track') {
  await player.play(result.data);
}
```

### v2.0.0 - Advanced Queue Management

```typescript
// Add to front of queue (play next)
player.playNext(track);

// Reorder queue
player.moveTrack(fromIndex, toIndex);

// Swap two tracks
player.swapTracks(indexA, indexB);

// Jump to track and play immediately
await player.jumpTo(trackIndex);

// Get queue summary
const info = player.getQueueInfo();
console.log(`${info.length} tracks, ${info.totalDurationMs}ms total`);

// Peek at next 5 tracks
const upcoming = player.getUpcoming(5);

// Get player metrics
const metrics = player.getMetrics();
console.log(`Played ${metrics.tracksPlayed} tracks this session`);

// Get history statistics
const stats = player.getHistoryStats();
console.log(`${stats.skipped} tracks skipped`);
```

### Use the Advanced Bot Example

Start with the production-ready bot example (19 commands, rich embeds, interactive UI):

```bash
node examples/advanced-bot.js
```

**Commands**: `!play`, `!search`, `!skip`, `!queue`, `!playnext`, `!move`, `!swap`, `!jump`, `!stats`, `!queueinfo`, `!upcoming`, and more!

See `examples/ADVANCED_BOT_GUIDE.md` for complete documentation.

### Audio Filters & Advanced Features

```typescript
// Use filters with fluent API
await player.filters()
  .timescale({ speed: 1.2, pitch: 1.0, rate: 1.0 })
  .tremolo({ frequency: 4.0, depth: 0.5 })
  .karaoke()
  .apply();

// Advanced player features
player.setLoopMode('track'); // Loop current track
player.setLoopMode('queue'); // Loop entire queue
player.setLoopMode('off');   // Disable loop

await player.setSpeed(1.5);  // 1.5x speed (independent)
await player.setPitch(1.2);  // Higher pitch (independent)
await player.setSpeedAndPitch(1.3, 1.3); // Both together

player.setCrossfade(3000);   // 3 second crossfade
player.setVolumeNormalization(true); // Enable normalization

// Favorites
import { FavoritesManager } from 'lavaflow';
const favorites = new FavoritesManager();
favorites.addUserFavorite('userId', track);
favorites.addGuildFavorite('guildId', track, 'userId');
const userFavs = favorites.getUserFavorites('userId');

// Queue persistence
const saved = player.saveQueue(); // Returns JSON string
// Later...
await player.restoreQueue(saved); // Restore queue state

// Playback history
const history = player.getHistory(); // Last 50 tracks
player.clearHistory();

// Metadata cache
import { MetadataCache } from 'lavaflow';
const cache = new MetadataCache(1000, 3600000); // 1000 items, 1 hour TTL
const cachedTrack = cache.get('identifier');
if (!cachedTrack) {
  const track = await player.search('query');
  cache.set('identifier', track);
}
```

## Architecture

### Node Manager
Manages multiple Lavalink nodes with intelligent load balancing based on:
- Player count (active and playing players)
- CPU load (normalized by core count)
- Memory usage
- Custom penalty calculations

### Player
Feature-rich player with:
- Play, pause, stop, seek controls
- Volume management
- Filter support (v4 filters: Timescale, Tremolo, Karaoke, Distortion, Rotation, etc.)
- Queue management
- Voice state handling

### Filter Builder
Chainable API for audio filters:
```typescript
player.filters()
  .volume(0.8)
  .equalizer([{ band: 0, gain: 0.2 }])
  .timescale({ speed: 1.1 })
  .tremolo({ frequency: 2.0, depth: 0.5 })
  .vibrato({ frequency: 2.0, depth: 0.5 })
  .rotation({ rotationHz: 0.2 })
  .distortion({ sinOffset: 0, sinScale: 1, cosOffset: 0, cosScale: 1, tanOffset: 0, tanScale: 1, offset: 0, scale: 1 })
  .channelMix({ leftToLeft: 1, leftToRight: 0, rightToLeft: 0, rightToRight: 1 })
  .lowPass({ smoothing: 20 })
  .apply();
```

## Events

- `nodeConnect` - Node connected successfully
- `nodeDisconnect` - Node disconnected
- `nodeError` - Node encountered an error
- `nodeReconnect` - Node attempting reconnection
- `trackStart` - Track started playing
- `trackEnd` - Track finished playing
- `trackStuck` - Track got stuck
- `trackException` - Track encountered an error
- `playerCreate` - Player created
- `playerDestroy` - Player destroyed
- `queueEnd` - Queue finished playing
- `debug` - Debug messages (only if `debug: true`)

## Examples

### Simple Bot (Beginner-Friendly)
See [simple-5-commands.js](examples/simple-5-commands.js) for a basic Discord music bot with 5 commands (~200 lines).

**Commands**: `!play`, `!stop`, `!pause`, `!resume`, `!skip`

### Advanced Bot (Production-Ready) ⭐ NEW
See [advanced-bot.js](examples/advanced-bot.js) for a feature-rich bot with 19 commands (~900 lines).

**Features**:
- Rich Discord embeds with colors, thumbnails, fields
- Interactive search with 5-result selection (30s timeout)
- Queue pagination with Previous/Next buttons
- Progress bar visualization with time tracking
- Advanced queue control (playNext, move, swap, jump)
- Comprehensive statistics and queue info
- Full error handling with helpful messages

**Commands**:
- **Playback** (6): play, search, skip, pause, resume, stop
- **Queue** (5): queue, shuffle, clear, remove, nowplaying
- **Advanced** (4): playnext, move, swap, jump
- **Info** (4): stats, queueinfo, upcoming, help

### Documentation

New in v2.0.0:
- [Advanced Bot Guide](examples/ADVANCED_BOT_GUIDE.md) - Complete command reference and setup
- [Examples Comparison](examples/EXAMPLES_COMPARISON.md) - Compare simple vs advanced bots
- [Visual Guide](examples/ADVANCED_BOT_VISUAL.md) - Diagrams and visual examples
- [Examples Index](examples/INDEX.md) - Master navigation guide

### Node.js Example
See [node-example.js](examples/node-example.js) for using lavaflow without Discord.js.

## AutoPlay Feature

lavaflow includes intelligent AutoPlay that automatically finds and plays related tracks when your queue ends:

- **YouTube**: Uses YouTube's recommendation system (RD playlists)
- **SoundCloud**: Searches for similar tracks by artist/title
- **Spotify**: Converts to YouTube, gets recommendations, finds related tracks

AutoPlay keeps track of the last 50 played tracks to avoid repetition.

```typescript
const manager = new Manager({
  autoPlay: true, // Enable AutoPlay (default: true)
  debug: true     // Show debug logs (default: false)
});
```

## Plugin System

lavaflow supports custom plugins to extend functionality:

```typescript
import { Manager, LavaPlugin } from 'lavaflow';

const myPlugin: LavaPlugin = {
  name: 'MyPlugin',
  onLoad(manager) {
    console.log('Plugin loaded!');
  },
  onEvent(event, ...args) {
    if (event === 'trackStart') {
      console.log('Track started:', args);
    }
  }
};

manager.use(myPlugin);
```

Check out [lava-plugin-voice-status](https://github.com/ryxu-xo/lava-voice-status) for a voice channel status plugin example.

## API Documentation

### v2.0.0 Queue Management API

```typescript
// Add track to front of queue (play next)
player.playNext(track): boolean;

// Reorder queue positions
player.moveTrack(fromIndex: number, toIndex: number): boolean;

// Swap two queue positions
player.swapTracks(indexA: number, indexB: number): boolean;

// Jump to track and play immediately
await player.jumpTo(index: number): Promise<boolean>;

// Get queue summary
player.getQueueInfo(): {
  length: number;
  totalDurationMs: number;
  nowPlaying: Track | null;
  upcomingSample: Track[];
};

// Peek at next N tracks
player.getUpcoming(count?: number): Track[];

// Get player metrics
player.getMetrics(): {
  tracksPlayed: number;
  errorCount: number;
  totalPlaybackTime: number;
  sessionDuration: number;
  uptime: number;
  avgTracksPerMinute: number;
};

// Get history statistics
player.getHistoryStats(): {
  skipped: number;
  unique: number;
  repeated: number;
};
```

### Manager Options

```typescript
interface ManagerOptions {
  nodes: NodeOptions[];
  send: (guildId: string, payload: any) => void;
  clientId?: string;
  shards?: number;
  autoPlay?: boolean;
  defaultSearchPlatform?: 'ytsearch' | 'ytmsearch' | 'scsearch';
  debug?: boolean;
}
```

### Node Options

```typescript
interface NodeOptions {
  name: string;
  host: string;
  port: number;
  password: string;
  secure?: boolean;
  resumeKey?: string;
  resumeTimeout?: number;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  region?: string; // Geographic region for voice optimization
  retryStrategy?: 'exponential' | 'linear' | 'none'; // Rate limiting strategy
}
```

### Player Options

```typescript
interface PlayerOptions {
  guildId: string;
  voiceChannelId: string;
  textChannelId?: string;
  selfDeafen?: boolean;
  selfMute?: boolean;
  volume?: number;
}
```

## Design Patterns

- **Singleton**: NodeManager for centralized node management
- **Factory**: Player creation through Manager
- **Builder**: Fluent API for filter configuration
- **Event-Driven**: Comprehensive event system for reactive patterns

## Fault Tolerance

- Automatic reconnection with exponential backoff
- Jitter to prevent thundering herd
- Node health monitoring
- Graceful degradation

## License

MIT © [ryxu-xo](https://github.com/ryxu-xo)

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct.

## Support

- [Documentation](https://github.com/ryxu-xo/lavaflow/wiki)
- [Issues](https://github.com/ryxu-xo/lavaflow/issues)
- [Discord Server](https://discord.gg/your-invite)
