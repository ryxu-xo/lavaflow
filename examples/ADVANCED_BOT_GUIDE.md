# Advanced Bot Example Guide

## 📖 Overview

`advanced-bot.js` is a feature-rich Discord music bot example showcasing:
- **Advanced search** with track selection
- **Discord embeds** for beautiful formatting
- **Queue management** with pagination
- **Comprehensive commands** (13+ commands)
- **Statistics tracking** with Phase 8 features
- **Interactive buttons** for queue navigation

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install discord.js dotenv
```

### 2. Setup Environment Variables
Create `.env` file:
```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
DEBUG=false
```

### 3. Run the Bot
```bash
node examples/advanced-bot.js
```

---

## 📋 Commands

### ▶️ Playback Commands

#### `!play <song name or URL>`
Play a song directly
```
!play epic music
!play https://www.youtube.com/watch?v=...
```
**Response**: Embed showing track title, artist, duration, and position in queue

#### `!search <query>`
Search with interactive selection (top 5 results)
```
!search gaming lofi beats
```
**Response**: 
1. Shows 5 search results with numbers
2. Wait for user to reply with number (1-5)
3. Add selected track to queue

#### `!skip`
Skip to next track
```
!skip
```
**Response**: Embed showing skipped track and next track

#### `!pause`
Pause current playback
```
!pause
```
**Response**: Embed showing paused track

#### `!resume`
Resume playback
```
!resume
```
**Response**: Embed showing resumed track

#### `!stop`
Stop playback and disconnect from voice
```
!stop
```
**Response**: Embed confirming disconnection

### 📜 Queue Commands

#### `!queue [page]`
Show queue with pagination
```
!queue
!queue 2
!queue 3
```
**Features**:
- 10 tracks per page
- Previous/Next buttons
- Total duration displayed
- Track links clickable

#### `!shuffle`
Shuffle the queue randomly
```
!shuffle
```
**Response**: Embed confirming shuffle with track count

#### `!clear`
Clear entire queue
```
!clear
```
**Response**: Embed showing number of tracks removed

#### `!remove <position>`
Remove specific track from queue
```
!remove 3
!remove 1
```
**Response**: Embed showing removed track details

#### `!np` or `!nowplaying`
Show current track with progress bar
```
!np
!nowplaying
```
**Response**: Embed with:
- Track title (clickable link)
- Artist and duration
- Progress bar visualization
- Current time / Total time
- Volume and status

### 📊 Info Commands

#### `!stats`
Show player statistics
```
!stats
```
**Response**: Embed with:
- Tracks played
- Session duration
- Error count
- Tracks skipped
- Unique tracks played
- Current queue size

#### `!help`
Show all available commands
```
!help
```
**Response**: Formatted embed with all commands categorized

---

## 🎨 Features Showcase

### 1. Beautiful Embeds
All responses are formatted with rich Discord embeds featuring:
- Colored titles (red theme: #FF0000)
- Descriptions with formatted text
- Inline and non-inline fields
- Thumbnails from YouTube
- Footers with metadata

### 2. Track Selection
Interactive search with timeout:
```
🔍 User runs: !search lofi
📜 Bot shows: Top 5 results with numbers
⏱️ Timeout: 30 seconds to respond
✅ User replies with number 1-5
🎵 Track automatically added to queue
```

### 3. Progress Visualization
Now playing embed shows:
```
Progress: ████████░░░░░░░░░░░░ 4:32 / 10:15
Status: ▶️ Playing | Volume: 100%
```

### 4. Queue Pagination
Navigate queue with buttons:
- **Page indicator**: "Page 2/5"
- **Previous button**: Disabled on page 1
- **Next button**: Disabled on last page
- **10 tracks per page** with duration info

### 5. Statistics Tracking
Uses Phase 8 features:
```typescript
// Automatically tracks:
- Tracks played (getMetrics())
- Tracks skipped (getHistoryStats().skipped)
- Unique tracks (getHistoryStats().unique)
- Session duration (getMetrics().sessionDuration)
```

---

## 🛠️ Configuration

### Bot Settings
```javascript
const PREFIX = '!';           // Command prefix
const EMBED_COLOR = '#FF0000'; // Embed color (red)
const SEARCH_TIMEOUT = 30000; // Search selection timeout (30s)
```

### Manager Settings
```javascript
new Manager({
  maxQueueSize: 500,        // Max tracks per player
  apiRateLimitDelay: 50,    // Rate limit (50ms)
  autoPlay: true,           // Auto-play next track
  defaultSearchPlatform: 'ytsearch',
  debug: false,             // Debug logging
})
```

---

## 📝 Code Structure

### Event Handlers
```javascript
client.on('ready', ...) // Initialize manager
client.on('raw', ...) // Handle voice events
client.on('messageCreate', ...) // Process commands
```

### Command Handler
```javascript
switch (command) {
  case 'play': await commandPlay(...); break;
  case 'search': await commandSearch(...); break;
  // ... more commands
}
```

### Utility Functions
- `formatTime(ms)` - Convert milliseconds to MM:SS
- `getTotalQueueDuration(queue)` - Sum all track durations

---

## 🔍 Advanced Features

### 1. Interactive Search
```javascript
// Waits for user input with timeout
const filter = (m) => m.author.id === message.author.id && /^[1-5]$/.test(m.content);
const collected = await message.channel.awaitMessages({
  filter,
  max: 1,
  time: SEARCH_TIMEOUT,
  errors: ['time'],
});
```

### 2. Rich Embeds
```javascript
new EmbedBuilder()
  .setColor(EMBED_COLOR)
  .setTitle('Title')
  .setDescription('Description')
  .addFields(...)
  .setThumbnail(trackArtwork)
  .setFooter({text: 'Footer'})
```

### 3. Error Handling
All commands have try/catch blocks with detailed error messages

### 4. Voice Channel Validation
All commands check:
- User is in voice channel
- Player exists or can be created
- Sufficient queue tracks

---

## 📊 Example Responses

### Now Playing Embed
```
🎵 Now Playing
[Song Title](YouTube Link)

Artist: Song Artist        Volume: 100%       Status: ▶️ Playing

Progress: ████████░░░░░░░░░░░░ 4:32 / 10:15

Queue: 12 tracks
```

### Queue Embed
```
📜 Queue

1. [Track 1](link) - 3:45
2. [Track 2](link) - 4:20
3. [Track 3](link) - 5:10
...

Page 1/3 • Total: 27 tracks • 1:23:45
[⬅️ Previous] [Next ➡️]
```

### Stats Embed
```
📊 Player Statistics

Tracks Played: 42        Session Duration: 2:15:30    Errors: 0
Tracks Skipped: 5        Unique Tracks: 38             Queue Size: 12
```

---

## 🎯 Usage Examples

### Full Workflow
```
1. User: !search lo-fi beats
2. Bot: Shows 5 search results
3. User: 3
4. Bot: Adds track #3 to queue, starts playing
5. User: !queue
6. Bot: Shows current queue with pagination
7. User: !np
8. Bot: Shows now playing with progress bar
9. User: !stats
10. Bot: Shows comprehensive statistics
```

### Queue Management
```
!play song1        # Add to queue
!play song2        # Add to queue
!queue             # View queue
!remove 1          # Remove track 1
!shuffle           # Randomize queue
!skip              # Next track
!clear             # Empty queue
```

---

## 🐛 Troubleshooting

### Bot Not Responding
- Check `DISCORD_TOKEN` in `.env`
- Verify bot has "Send Messages" and "Embed Links" permissions
- Ensure PREFIX matches your commands

### Music Not Playing
- Check Lavalink is running on configured host/port
- Verify `LAVALINK_PASSWORD` is correct
- Ensure you're in a voice channel
- Check bot has "Connect" and "Speak" permissions

### Search Timeout
- Default is 30 seconds (`SEARCH_TIMEOUT`)
- Adjust if needed in bot configuration
- User must be in same guild

### Embeds Not Showing
- Verify bot has "Embed Links" permission
- Check color format is valid hex (e.g., `#FF0000`)

---

## 🚀 Customization Ideas

### 1. Add Loop Mode
```javascript
case 'loop':
  player.loopMode = player.loopMode === 'queue' ? 'off' : 'queue';
  break;
```

### 2. Add Volume Control
```javascript
case 'volume':
  await player.setVolume(parseInt(args[0]));
  break;
```

### 3. Add Seeking
```javascript
case 'seek':
  await player.seek(parseInt(args[0]) * 1000);
  break;
```

### 4. Add Filters
```javascript
case 'bass':
  await player.filterBuilder().reset().setEQ(...).apply();
  break;
```

### 5. Add Favorites
```javascript
case 'favorite':
  favorites.add(player.track);
  break;

case 'favorites':
  // Show user's favorite tracks
  break;
```

---

## 📚 Phase 8 Features Used

This bot automatically uses Phase 8 improvements:

1. **Event Listening** - `queueChanged` events fire when queue modifies
2. **Statistics** - `getHistoryStats()` for skip/unique tracking
3. **Metrics** - `getMetrics()` for comprehensive stats
4. **Hooks** - Can add `onBeforePlay()` / `onAfterPlay()` hooks
5. **Configuration** - Uses Manager options for queue size and rate limiting

Example with hooks:
```javascript
player.onBeforePlay(async (track) => {
  console.log(`🎵 Playing: ${track.info.title}`);
});

player.eventEmitter.on('queueChanged', (data) => {
  console.log(`Queue updated (${data.action}): ${data.queueLength} tracks`);
});
```

---

## 📖 Full Command Reference

| Command | Usage | Description |
|---------|-------|-------------|
| `!play` | `!play <song>` | Play or queue a song |
| `!search` | `!search <query>` | Search with selection |
| `!skip` | `!skip` | Skip current track |
| `!pause` | `!pause` | Pause playback |
| `!resume` | `!resume` | Resume playback |
| `!stop` | `!stop` | Stop and disconnect |
| `!queue` | `!queue [page]` | View queue (paginated) |
| `!shuffle` | `!shuffle` | Randomize queue |
| `!clear` | `!clear` | Clear entire queue |
| `!remove` | `!remove <pos>` | Remove track by position |
| `!np` | `!np` | Show now playing |
| `!stats` | `!stats` | Show player statistics |
| `!help` | `!help` | Show all commands |

---

## ✨ Summary

The Advanced Bot Example demonstrates:
- ✅ Professional embed formatting
- ✅ Interactive user selection
- ✅ Queue pagination with buttons
- ✅ Comprehensive statistics
- ✅ Error handling and validation
- ✅ Phase 8 feature integration
- ✅ Production-ready code structure

**Ready to deploy and customize!** 🎉

