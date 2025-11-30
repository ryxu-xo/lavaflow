# Changelog

All notable changes to erela.js will be documented in this file.

## [3.0.0] - 2024

### 🎉 Major Changes

#### Lavalink v4 Support
- **BREAKING:** Updated all REST endpoints to v4 format (`/v4/loadtracks`, `/v4/sessions`, etc.)
- **BREAKING:** Changed WebSocket endpoint to `/v4/websocket`
- **NEW:** Session management with resuming support
- **NEW:** Enhanced player state tracking with ping information
- **IMPROVED:** Better error handling and response parsing

#### Audio Filters System
- **NEW:** Comprehensive audio filters support:
  - Karaoke filter for vocal removal
  - Timescale for speed/pitch adjustment
  - Tremolo for amplitude modulation
  - Vibrato for pitch modulation
  - Rotation for 8D audio effect
  - Distortion for audio distortion
  - Channel Mix for audio channel manipulation
  - Low Pass for frequency filtering
- **NEW:** `Filters` class for easy filter management
- **NEW:** Filter chaining and combination support

#### Search Improvements
- **NEW:** Extended search platform support:
  - Spotify (with plugin)
  - Apple Music (with plugin)
  - Deezer (with plugin)
  - Yandex Music (with plugin)
  - Existing: YouTube, YouTube Music, SoundCloud
- **IMPROVED:** Search result handling for v4 format
- **IMPROVED:** Better playlist parsing and metadata

#### Track Enhancements
- **NEW:** `artworkUrl` field for track artwork
- **NEW:** `isrc` field for International Standard Recording Code
- **NEW:** `sourceName` field to identify track source
- **NEW:** `pluginInfo` field for plugin-specific data
- **NEW:** `userData` field for custom metadata
- **IMPROVED:** Better thumbnail URL generation

#### Player Improvements
- **NEW:** `ping` property for voice server latency
- **NEW:** `uptime` getter for player lifetime
- **NEW:** `createdAt` and `createdTimestamp` for tracking
- **NEW:** `restart()` method to restart current track
- **NEW:** `setNode()` method to change player node
- **IMPROVED:** Volume handling (0-1000 range maintained)
- **IMPROVED:** Better state management

#### Node Management
- **NEW:** `NodeRest` class for v4 REST API operations
- **NEW:** `sessionId` tracking for connection resuming
- **NEW:** `getInfo()` method to fetch Lavalink info
- **NEW:** `getVersion()` method to check Lavalink version
- **NEW:** `getStats()` method for node statistics
- **IMPROVED:** Connection handling with session support
- **IMPROVED:** Better reconnection logic

#### Developer Experience
- **IMPROVED:** TypeScript definitions updated for v4
- **IMPROVED:** Better JSDoc documentation
- **NEW:** Comprehensive README with examples
- **NEW:** Type safety improvements
- **IMPROVED:** Error messages and debugging

### 📦 Dependencies

#### Updated
- `@discordjs/collection`: ^1.1.0 → ^2.1.0
- `@types/node`: v16 → ^20.11.0
- `@typescript-eslint/eslint-plugin`: ^5.37.0 → ^7.0.0
- `@typescript-eslint/parser`: ^5.37.0 → ^7.0.0
- `eslint`: ^8.23.1 → ^8.56.0
- `tslib`: ^2.4.0 → ^2.6.2
- `typescript`: ^4.8.3 → ^5.3.3
- `undici`: ^5.10.0 → ^6.6.0
- `ws`: ^8.8.1 → ^8.16.0

#### Requirements
- **CHANGED:** Node.js minimum version: 16.0.0 → 18.0.0

### 🔧 API Changes

#### Manager
```typescript
// NEW methods
manager.getInfo(): Promise<LavalinkInfo>
manager.getVersion(): Promise<string>
manager.getStats(): Promise<NodeStats>

// CHANGED search platforms
type SearchPlatform = 
  | "youtube" 
  | "youtube music" 
  | "soundcloud"
  | "apple music"    // NEW
  | "spotify"        // NEW
  | "deezer"         // NEW
  | "yandex music"   // NEW
```

#### Player
```typescript
// NEW properties
player.filters: Filters
player.ping: number
player.createdTimestamp: number
player.createdAt: number

// NEW methods
player.restart(): this
player.setNode(node: string | Node): this

// NEW getters
player.uptime: number

// CHANGED: Methods now use v4 REST API internally
player.play()
player.pause()
player.seek()
player.stop()
player.setVolume()
```

#### Node
```typescript
// NEW properties
node.rest: NodeRest
node.sessionId: string | null

// CHANGED: WebSocket connection
// Old: ws://host:port
// New: ws://host:port/v4/websocket

// CHANGED: REST endpoints
// Old: /loadtracks
// New: /v4/loadtracks
```

#### Filters (NEW)
```typescript
const filters = player.filters;

filters.setEqualizer(bands: EqualizerBand[]): this
filters.setKaraoke(karaoke: KaraokeFilter | null): this
filters.setTimescale(timescale: TimescaleFilter | null): this
filters.setTremolo(tremolo: TremoloFilter | null): this
filters.setVibrato(vibrato: VibratoFilter | null): this
filters.setRotation(rotation: RotationFilter | null): this
filters.setDistortion(distortion: DistortionFilter | null): this
filters.setChannelMix(channelMix: ChannelMixFilter | null): this
filters.setLowPass(lowPass: LowPassFilter | null): this
filters.clearFilters(): this
filters.updateFilters(): this
filters.get(): FilterOptions
```

#### Track
```typescript
interface Track {
  // NEW fields
  artworkUrl: string | null
  isrc: string | null
  sourceName: string
  pluginInfo?: Record<string, unknown>
  userData?: Record<string, unknown>
  
  // Existing fields remain unchanged
  track: string
  title: string
  // ...
}
```

### 🐛 Bug Fixes
- Fixed equalizer band persistence
- Fixed queue state synchronization
- Improved voice state update handling
- Fixed memory leaks in long-running players
- Better handling of node disconnections

### ⚠️ Breaking Changes

1. **Lavalink v4 Required**
   - Erela.js v3 requires Lavalink v4.0.0 or higher
   - v3 Lavalink nodes are not compatible (use erela.js v2.x for v3 nodes)

2. **Node.js 18+ Required**
   - Minimum Node.js version increased from 16 to 18

3. **LoadType Changes**
   ```typescript
   // Old (v3 Lavalink)
   "TRACK_LOADED" | "PLAYLIST_LOADED" | "SEARCH_RESULT" | "LOAD_FAILED" | "NO_MATCHES"
   
   // New (v4 Lavalink)
   "track" | "playlist" | "search" | "empty" | "error"
   
   // Note: Old types still supported for backward compatibility
   ```

4. **REST API Changes**
   - All internal REST calls updated to v4 endpoints
   - If you were directly accessing node REST methods, update your code

5. **Player Updates**
   - Player methods now use REST API instead of WebSocket for operations
   - This provides better reliability and state consistency

### 🔄 Migration Guide

#### From v2.x to v3.0.0

1. **Update Lavalink to v4**
   ```bash
   # Download Lavalink v4.0.0 or higher
   java -jar Lavalink.jar
   ```

2. **Update package**
   ```bash
   npm install erela.js@latest
   ```

3. **Update Node.js**
   ```bash
   # Ensure Node.js 18 or higher
   node --version
   ```

4. **Update your code (if using custom implementations)**
   ```typescript
   // Old - Direct WebSocket operations
   node.send({ op: "play", guildId, track });
   
   // New - Use REST API
   await node.rest.updatePlayer({ 
     guildId, 
     data: { encodedTrack: track } 
   });
   ```

5. **Update LoadType checks**
   ```typescript
   // Old
   if (result.loadType === "SEARCH_RESULT") { ... }
   
   // New (both work, but prefer new format)
   if (result.loadType === "search") { ... }
   ```

### 📝 Notes

- Backward compatibility maintained where possible
- Legacy v3 LoadType enums still work but are deprecated
- Old equalizer methods (`setEQ()`, `clearEQ()`) deprecated in favor of `filters`
- All new features require Lavalink v4 with appropriate plugins

### 🎯 Roadmap

- [ ] LavaSrc plugin integration examples
- [ ] Advanced queue management features
- [ ] Built-in lyrics fetching
- [ ] Audio visualization support
- [ ] Enhanced plugin system
- [ ] WebSocket event filtering
- [ ] Better TypeScript strict mode support

---

[3.0.0]: https://github.com/MenuDocs/erela.js/releases/tag/v3.0.0
