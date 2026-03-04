# Bot Examples Comparison

## 📊 Overview

Lavaflow provides multiple bot examples for different complexity levels.

---

## 🔄 Comparison Table

| Feature | simple-5-commands.js | advanced-bot.js |
|---------|---|---|
| **Commands** | 5 | 13+ |
| **Embeds** | ❌ | ✅ |
| **Search** | Basic | Advanced with selection |
| **Queue Display** | ❌ | Paginated with buttons |
| **Progress Bar** | ❌ | ✅ |
| **Statistics** | ❌ | ✅ |
| **Error Handling** | Basic | Comprehensive |
| **Config Options** | Basic | Advanced |
| **Complexity** | Beginner | Intermediate |
| **Lines of Code** | ~200 | ~700 |

---

## 📚 Quick Guide

### When to Use simple-5-commands.js
```
✅ Learning Lavaflow basics
✅ Quick proof-of-concept
✅ Minimal dependencies
✅ Understanding core API
❌ Production use
❌ Complex features
```

**Commands**: `!play`, `!stop`, `!pause`, `!resume`, `!skip`

### When to Use advanced-bot.js
```
✅ Production deployment
✅ Professional features
✅ User-friendly interface
✅ Statistics and monitoring
✅ Queue management
✅ Learning advanced features
```

**Commands**: `!play`, `!search`, `!skip`, `!pause`, `!resume`, `!stop`, `!queue`, `!np`, `!shuffle`, `!clear`, `!remove`, `!stats`, `!help`

---

## 🎯 Feature Comparison

### Command Variety

**simple-5-commands.js**:
- `!play <song>` - Play song
- `!stop` - Stop music
- `!pause` - Pause
- `!resume` - Resume
- `!skip` - Skip

**advanced-bot.js**:
- Playback: `!play`, `!search`, `!skip`, `!pause`, `!resume`, `!stop` (6 commands)
- Queue: `!queue`, `!shuffle`, `!clear`, `!remove` (4 commands)
- Info: `!np`, `!stats`, `!help` (3 commands)

### User Interface

**simple-5-commands.js**:
```
Simple text responses
No formatting
Basic error messages
```

**advanced-bot.js**:
```
Rich Discord embeds
Color-coded responses
Thumbnail images
Progress bars
Button controls
Pagination
```

### Search Functionality

**simple-5-commands.js**:
```
!play <query> - Instant play
Plays first result automatically
```

**advanced-bot.js**:
```
!search <query> - Show top 5
User selects track number
Timeout: 30 seconds
Numbered results with duration
```

### Queue Management

**simple-5-commands.js**:
```
No queue display
Simple add/remove
```

**advanced-bot.js**:
```
!queue - Full queue view
Pagination (10 per page)
Total duration calculation
Previous/Next buttons
Track links
Remove by position
Shuffle support
Clear all
```

### Statistics

**simple-5-commands.js**:
```
No statistics
No tracking
```

**advanced-bot.js**:
```
!stats command
Tracks played
Session duration
Errors counted
Skips tracked
Unique tracks
Queue size
```

---

## 🚀 Migration Guide

### From simple-5-commands.js to advanced-bot.js

**Step 1: Install Dependencies**
```bash
npm install discord.js dotenv
```

**Step 2: Copy advanced-bot.js**
```bash
cp examples/advanced-bot.js examples/my-bot.js
```

**Step 3: Update .env**
```env
DISCORD_TOKEN=your_token
DISCORD_CLIENT_ID=your_client_id
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
DEBUG=true
```

**Step 4: Run**
```bash
node examples/my-bot.js
```

---

## 💡 Examples

### Playing Music

**simple-5-commands.js**:
```
User: !play epic music
Bot: 🎵 Playing...
```

**advanced-bot.js**:
```
User: !search epic music
Bot: Shows 5 results with numbers
User: 2
Bot: Adds track #2 with rich embed showing:
- Title (clickable link)
- Artist
- Duration
- Queue position
- Thumbnail image
```

### Viewing Queue

**simple-5-commands.js**:
```
No queue command available
```

**advanced-bot.js**:
```
User: !queue
Bot: Shows 10 tracks per page with:
- Track numbers
- Titles (clickable links)
- Artists
- Durations
- Total duration
- Pagination buttons
- Current page indicator
```

### Now Playing

**simple-5-commands.js**:
```
No now playing command
```

**advanced-bot.js**:
```
User: !np
Bot: Shows embed with:
- Current track
- Artist
- Progress bar (████░░░░)
- Current time / Total time
- Volume percentage
- Status (playing/paused)
- Thumbnail
- Queue length
```

### Statistics

**simple-5-commands.js**:
```
No statistics available
```

**advanced-bot.js**:
```
User: !stats
Bot: Shows comprehensive stats:
- Tracks played: 42
- Session duration: 2:15
- Errors: 0
- Tracks skipped: 5
- Unique tracks: 38
- Queue size: 12
```

---

## 🔧 Code Examples

### Error Handling

**simple-5-commands.js**:
```javascript
try {
  await player.play();
} catch (error) {
  message.reply('❌ Error');
}
```

**advanced-bot.js**:
```javascript
try {
  const results = await player.search(query, 'ytsearch');
  
  if (!results.data || results.data.length === 0) {
    return loading.edit({
      embeds: [
        new EmbedBuilder()
          .setColor('Red')
          .setTitle('❌ No Results')
          .setDescription(`No tracks found for: **${query}**`),
      ],
    });
  }
  // Process results...
} catch (error) {
  console.error('Play error:', error);
  await loading.edit({
    embeds: [
      new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Error')
        .setDescription('Failed to play track. Please try again.'),
    ],
  });
}
```

### User Input

**simple-5-commands.js**:
```javascript
const args = message.content.slice(PREFIX.length).trim().split(/ +/);
const command = args.shift().toLowerCase();
```

**advanced-bot.js**:
```javascript
// With validation and timeout
const filter = (m) => m.author.id === message.author.id && /^[1-5]$/.test(m.content);
const collected = await message.channel.awaitMessages({
  filter,
  max: 1,
  time: SEARCH_TIMEOUT,
  errors: ['time'],
});
```

---

## 📈 Feature Roadmap

### Phase 0-7 Features
Both examples support the complete Lavaflow API

### Phase 8 Features
**simple-5-commands.js**: Basic integration  
**advanced-bot.js**: Full integration with:
- `getMetrics()` for statistics
- `getHistoryStats()` for skip tracking
- `eventEmitter.on('queueChanged', ...)` for queue events
- Ready for hooks/callbacks

---

## 🎓 Learning Path

### Beginner
1. Start with `simple-5-commands.js`
2. Understand basic play/pause/skip
3. Learn command parsing
4. Understand manager and player

### Intermediate
1. Move to `advanced-bot.js`
2. Learn Discord embeds
3. Understand pagination
4. Learn interactive selection
5. Implement statistics tracking

### Advanced
1. Customize `advanced-bot.js`
2. Add more commands (volume, seek, loop)
3. Add database for favorites
4. Implement user preferences
5. Add analytics dashboard

---

## 🚀 Getting Started

### Option 1: Quick Start
```bash
# Use simple-5-commands.js
node examples/simple-5-commands.js
```

### Option 2: Full Featured
```bash
# Use advanced-bot.js
node examples/advanced-bot.js
```

### Option 3: Custom
```bash
# Combine features from both
# Create examples/my-bot.js
# Import from advanced-bot.js and customize
```

---

## 📝 Summary

| Aspect | simple | advanced |
|--------|--------|----------|
| Learning | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Features | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Production | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Customization | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Code Length | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 Recommendation

**For Learning**: Use `simple-5-commands.js`  
**For Production**: Use `advanced-bot.js`  
**For Custom Needs**: Fork either and customize

Both examples are fully functional and deployable!

