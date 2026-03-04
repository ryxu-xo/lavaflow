# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-01-15

### Added

#### Advanced Queue Management
- **Queue Control Methods**: 6 new Player methods for complete queue control
  - `playNext(track)` - Add track to front of queue
  - `moveTrack(fromIndex, toIndex)` - Reorder queue positions
  - `swapTracks(indexA, indexB)` - Swap two queue positions  
  - `jumpTo(index)` - Jump to track and start playing immediately
  - `getQueueInfo()` - Get queue summary with duration and upcoming tracks
  - `getUpcoming(count)` - Peek at next N tracks without mutation

#### Player Statistics & History
- **Metrics API**: Performance tracking with `getMetrics()`
  - Tracks played count
  - Error count tracking
  - Total playback time
  - Session duration calculation
  - Uptime tracking
  - Tracks per minute calculation

- **History Statistics**: Track history analysis with `getHistoryStats()`
  - Skipped tracks count
  - Unique tracks count
  - Repeated tracks count
  - Skip rate calculation
  - Play count analysis

#### Production-Ready Examples
- **Advanced Bot Example** (`examples/advanced-bot.js`) - 900+ lines, 19 commands
  - **Playback Commands** (6): play, search, skip, pause, resume, stop
  - **Queue Management** (5): queue, shuffle, clear, remove, nowplaying
  - **Advanced Queue** (4): playnext, move, swap, jump
  - **Information** (4): stats, queueinfo, upcoming, help
  
- **Advanced Features in Bot**:
  - Rich Discord embeds with colors, fields, thumbnails
  - Interactive search with 5-result selection (30s timeout)
  - Queue pagination with Previous/Next buttons (10 per page)
  - Progress bar visualization with Unicode characters
  - Comprehensive error handling with embed responses
  - Phase 8 feature integration (metrics, history stats)
  - Time formatting (MM:SS, HH:MM:SS)
  - Queue duration calculations

#### Comprehensive Documentation
- **`examples/ADVANCED_BOT_GUIDE.md`** (400+ lines)
  - Complete command reference with examples
  - Setup instructions and .env configuration
  - Feature explanations
  - Code structure walkthrough
  - Phase 8 integration guide
  - Troubleshooting section
  - Customization ideas
  
- **`examples/ADVANCED_BOT_VISUAL.md`** (300+ lines)
  - Visual ASCII art diagrams
  - Embed response examples
  - Command flow diagrams
  - Feature visualizations
  - Performance profiles
  - Deployment checklist
  
- **`examples/EXAMPLES_COMPARISON.md`** (350+ lines)
  - Side-by-side feature comparison
  - Simple vs Advanced bot comparison matrix
  - Migration guide
  - Code example comparisons
  - Learning path recommendations
  - Feature roadmap alignment
  
- **`examples/INDEX.md`** - Master index for all examples
  - Quick navigation guide
  - File organization
  - Feature matrix
  - Use case recommendations
  - Learning progression

### Fixed

#### Voice State Handling
- **Fixed `packet.d` undefined error**: Improved raw event handler
  - Added proper initialization check with `manager.isInitialized()`
  - Better packet validation before processing
  - Graceful handling of malformed packets
  - Safe voice state routing

#### Queue Operations
- **Bounds checking**: All index-based operations now validate bounds
- **Event emission**: Proper event emission for all queue mutations
- **Queue validation**: Safe queue length checks across all operations

### Improved

#### Code Quality
- Enhanced type safety for queue operations
- Better error messages with actionable guidance
- Comprehensive input validation
- Consistent embed formatting across all commands
- JSDoc comments for all command functions

#### Performance
- Optimized queue operations
- Efficient pagination system
- Minimal memory overhead for history tracking
- Rate limit awareness with configurable delays

#### User Experience
- Rich Discord embeds with consistent styling
- Interactive UI with buttons and timeouts
- Clear progress visualization
- Helpful error messages with usage examples
- Organized command categories in help

### Changed

#### Documentation Updates
- Updated README.md with v2.0.0 features and examples
- Added Feature highlights section
- Updated Quick Start guide with new methods
- Enhanced Examples section with bot showcase
- Added Production-Ready designation

### Documentation

**Lines Added**:
- CHANGELOG.md expansion
- README.md updates
- 4 new guide files (1350+ lines)
- Code comments and JSDoc

**Examples**:
- advanced-bot.js: 900+ lines with 19 commands
- simple-5-commands.js: Remains unchanged, still 200 lines

**Total Documentation**: 2000+ lines of guides and examples

---

## Previous Releases

See git history for [1.x.x] and earlier versions.
  
- **Playback State Management**: Save and restore player state
  - Export/import playback state
  - Resume playback from exact position
  - Queue state preservation
  - Stale state detection

- **Fade Effects**: Audio fade in/out support
  - `stopWithFade`: Stop with fade-out effect
  - `seekWithFade`: Seek with fade transitions
  - Crossfade duration configuration
  - Automatic crossfade between tracks
  
- **Stats Recording**: Automatic playback statistics
  - Play/skip event recording
  - Integration with Player class

#### Caching System
- **Multi-Layer Caching**: High-performance caching with TTL
  - `Cache<T>`: Generic cache with TTL support
  - `TrackCache`: Dedicated track caching
  - `SearchResultCache`: Search result caching
  - `CacheManager`: Unified cache management
  - Automatic cache eviction (LRU)
  - Cache statistics and utilization tracking
  - Cleanup of expired entries

#### Recommendations
- **Recommendation Engine**: Intelligent track recommendations
  - Similarity scoring based on artist, duration, source
  - Play history tracking
  - Top artists analysis
  - Configurable recommendation options (maxResults, minScore)
  - Reason explanations for recommendations

#### Monitoring & Health
- **Health Monitor**: Comprehensive health tracking
  - Node health metrics (uptime, latency, failures)
  - Player health metrics (connection, queue size, errors)
  - Health scores (0-100)
  - System-wide health aggregation
  - Status tracking (healthy, degraded, unhealthy, offline)
  - Track stuck/error event recording

- **Event Middleware**: Event interception and transformation
  - Event-specific and global middleware support
  - Middleware chaining with next() pattern
  - Built-in middlewares (logger, rate limiter, error handler)
  - Event modification and skipping support

### Changed

#### Player Enhancements
- **Queue Integration**: Player now uses advanced Queue class instead of raw arrays
  - All queue operations route through Queue API
  - Better queue serialization
  - Improved queue manipulation

- **Stats Integration**: Player automatically tracks playback statistics
  - Records play events on track start
  - Records skip events on manual skip
  - Exposes stats via `statsManager`

- **State Management**: Enhanced state export/import
  - `exportPlaybackState`: Export complete player state
  - `importPlaybackState`: Import and optionally resume playback
  - Better compatibility with queue system

#### Manager Enhancements
- **Caching Integration**: Manager uses cache for search results
  - Automatic search result caching
  - Cache statistics exposure via `getCacheStats`
  - Manual cache clearing via `clearCaches`

- **Recommendation Engine**: Manager exposes recommendation engine
  - `getRecommendationEngine`: Access recommendation system
  - Aggregate playback stats across all players

- **Logging**: Manager uses structured logging system
  - Log level configuration based on debug flag
  - Logger instance for manager operations

### Breaking Changes
- `Player.queue` is now a `Queue` instance instead of `Track[]`
  - Use `player.queue.getAll()` to get tracks as array
  - Use `player.queue.size()` instead of `player.queue.length`
  - Use `player.queue.isEmpty()` instead of `player.queue.length === 0`
  - Queue methods now return booleans for success/failure

- `Player.handleTrackEnd` now requires track parameter
  - Signature changed from `handleTrackEnd(reason)` to `handleTrackEnd(track, reason)`
  - Prevents race conditions during fast skips

### Fixed
- **Fast Skip Bug**: Fixed "no current song playing" error when skipping rapidly
  - Track end events now compare ended track with current track
  - Only clears player state if track matches
  - Better handling of replaced tracks

## [1.0.0] - 2025-12-01

### Added

#### Core Features
- Complete Lavalink v4 support with full REST API and WebSocket protocol implementation
- TypeScript-first design with comprehensive type definitions
- Singleton `NodeManager` with intelligent load balancing based on penalty system
- Factory pattern for `Player` creation through `Manager`
- Builder pattern for fluent filter configuration via `FilterBuilder`
- Event-driven architecture with typed `EventEmitter`

#### Node Management
- Automatic reconnection with exponential backoff and jitter
- Session resumption support
- Health monitoring with heartbeat tracking
- Configurable reconnection attempts and delays
- Real-time node statistics tracking
- Penalty-based load balancing algorithm
- Pluggable custom penalty calculator
- Node health checks

#### Player Features
- Full playback control (play, pause, resume, stop, seek)
- Volume management (0-100 range with Lavalink conversion)
- Queue management (add, remove, shuffle, move, clear)
- Track history tracking (previous tracks)
- Search integration with multiple platforms
- Auto-play next track in queue
- Position tracking with real-time updates
- Voice state management

#### Filter System
- Complete v4 filter support:
  - Volume, Equalizer (15 bands)
  - Karaoke, Timescale
  - Tremolo, Vibrato
  - Rotation (8D audio)
  - Distortion, Channel Mix
  - Low Pass
- Fluent/chainable filter API
- Pre-built filter presets:
  - Bass, Treble, Soft, Flat
  - Electronic, Rock, Classical, Pop
- Effect presets:
  - Nightcore, Vaporwave
  - 8D Audio, Bass Boost (4 levels)
  - Soft audio
- Filter state management (get, set, merge, clear)

#### Voice Management
- `VoiceForwarder` for Discord voice state handling
- Automatic VOICE_SERVER_UPDATE processing
- Automatic VOICE_STATE_UPDATE processing
- Complete voice state aggregation
- Player movement detection
- Voice connection tracking

#### Developer Experience
- Full TypeScript autocomplete support
- Comprehensive JSDoc documentation
- Type-safe event handlers
- Descriptive error messages
- Debug event emission
- Extensive examples

#### Utilities
- `HttpClient` for REST API calls with fetch
- `ExponentialBackoff` utility with jitter
- Async sleep helper
- Retry logic with backoff

#### Documentation
- Complete README with quick start guide
- API reference documentation
- Advanced usage patterns guide
- Installation and setup guide
- Contributing guidelines
- Discord.js integration example
- Multiple use case examples

#### Configuration
- TypeScript configuration (strict mode)
- ESLint configuration with TypeScript rules
- Package.json with proper dependencies
- Git ignore patterns
- MIT License

### Technical Details

#### Design Patterns
- **Singleton**: NodeManager for centralized node management
- **Factory**: Player creation through Manager
- **Builder**: FilterBuilder for chainable API
- **Event-Driven**: Comprehensive event system

#### Lavalink v4 Compliance
- Update Player REST endpoint (`/v4/sessions/{sessionId}/players/{guildId}`)
- WebSocket path (`/v4/websocket`)
- Required headers (Authorization, User-Id, Client-Name, Resume-Key)
- All v4 filters supported
- Complete load result types (track, playlist, search, empty, error)
- Track encoding/decoding
- Session management with resumption

#### Load Balancing Algorithm
- Player count penalty
- Playing player count penalty (higher weight)
- CPU load penalty (normalized by core count)
- Memory usage penalty (threshold-based)
- Frame stats penalty (deficit and nulled frames)
- Pluggable for custom strategies

#### Fault Tolerance
- Exponential backoff: base delay × 2^attempt
- Random jitter to prevent thundering herd
- Configurable maximum attempts
- Automatic backoff reset on success
- Connection timeout handling
- Heartbeat monitoring (30s timeout)
- Graceful degradation

### Performance
- Efficient WebSocket connection handling
- Minimal REST API calls
- Position tracking optimization
- Connection pooling across nodes
- Lazy evaluation where appropriate

### Dependencies
- `ws` ^8.14.2 - WebSocket client
- TypeScript ^5.3.2 - Type system
- @types/node ^20.10.0 - Node.js types
- @types/ws ^8.5.9 - WebSocket types

### Peer Dependencies
- discord.js ^14.x (optional)

## [0.1.0] - Initial Development

### Added
- Initial project structure
- Basic TypeScript setup
- Core interfaces and types

---

## Version Guidelines

### Major Version (X.0.0)
- Breaking API changes
- Major architectural changes
- Lavalink protocol version changes

### Minor Version (0.X.0)
- New features (backward compatible)
- New filter types
- New convenience methods
- Performance improvements

### Patch Version (0.0.X)
- Bug fixes
- Documentation updates
- Minor improvements
- Dependency updates

[Unreleased]: https://github.com/ryxu-xo/lavaflow/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ryxu-xo/lavaflow/releases/tag/v1.0.0
[0.1.0]: https://github.com/ryxu-xo/lavaflow/releases/tag/v0.1.0