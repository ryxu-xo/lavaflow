/**
 * Advanced Discord Music Bot Example
 * Demonstrates: search, embeds, queue management, now playing, advanced commands
 * Version: 2.0
 */

const { Client, GatewayIntentBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Manager } = require('../dist/index.js');
// require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Initialize Lavaflow Manager
const manager = new Manager({
  nodes: [
    {
      name: 'lavalink',
      host: process.env.LAVALINK_HOST || 'lavalink.jirayu.net',
      port: parseInt(process.env.LAVALINK_PORT) || 13592,
      password: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
      secure: process.env.LAVALINK_SECURE === 'false',
    },
  ],
  send: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild?.shard) {
      guild.shard.send(payload);
    }
  },
  clientId: process.env.DISCORD_CLIENT_ID || '1461331383854301207',
  autoPlay: false,
  defaultSearchPlatform: 'spsearch',
  debug: process.env.DEBUG === 'true',
  maxQueueSize: 500,
  apiRateLimitDelay: 50,
});

const PREFIX = '!';
const EMBED_COLOR = '#FF0000';
const SEARCH_TIMEOUT = 30000; // 30 seconds for search selection
const userSearches = new Map(); // Track active searches

// ==================== EVENT HANDLERS ====================

client.on('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  await manager.init();
  console.log('✅ Lavaflow Manager initialized');
});

client.on('raw', (packet) => {
  if (manager.isInitialized()) {
    manager.updateVoiceState(packet);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    switch (command) {
      case 'play':
        await commandPlay(message, args);
        break;
      case 'search':
        await commandSearch(message, args);
        break;
      case 'skip':
        await commandSkip(message);
        break;
      case 'stop':
        await commandStop(message);
        break;
      case 'pause':
        await commandPause(message);
        break;
      case 'resume':
        await commandResume(message);
        break;
      case 'queue':
        await commandQueue(message);
        break;
      case 'np':
      case 'nowplaying':
        await commandNowPlaying(message);
        break;
      case 'shuffle':
        await commandShuffle(message);
        break;
      case 'clear':
        await commandClear(message);
        break;
      case 'remove':
        await commandRemove(message, args);
        break;
      case 'playnext':
        await commandPlayNext(message, args);
        break;
      case 'move':
        await commandMove(message, args);
        break;
      case 'swap':
        await commandSwap(message, args);
        break;
      case 'jump':
        await commandJump(message, args);
        break;
      case 'queueinfo':
        await commandQueueInfo(message);
        break;
      case 'upcoming':
        await commandUpcoming(message, args);
        break;
      case 'stats':
        await commandStats(message);
        break;
      case 'help':
        await commandHelp(message);
        break;
      default:
        await message.reply('❌ Unknown command. Use `!help` for available commands.');
    }
  } catch (error) {
    console.error(`Error executing command ${command}:`, error);
    await message.reply('❌ An error occurred while executing the command.');
  }
});

// ==================== COMMANDS ====================

/**
 * !play <song name or URL>
 * Plays a song or adds it to the queue
 */
async function commandPlay(message, args) {
  if (!args.length) {
    return message.reply('❌ Please provide a song name or URL. Usage: `!play <song>`');
  }

  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply('❌ You must be in a voice channel to play music.');
  }

  // Get or create player
  let player = manager.get(message.guildId);
  if (!player) {
    player = manager.create({
      guildId: message.guildId,
      voiceChannelId: voiceChannel.id,
      textChannelId: message.channelId,
    });
  }

  const query = args.join(' ');
  const loading = await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor('Yellow')
        .setTitle('🔍 Searching...')
        .setDescription(`Searching for: **${query}**`),
    ],
  });

  try {
    const results = await player.search(query);
    
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

    const track = results.data[0];
    player.addTrack(track);

    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setTitle('✅ Track Added')
      .setDescription(`[${track.info.title}](${track.info.uri})`)
      .addFields(
        { name: 'Artist', value: track.info.author, inline: true },
        { name: 'Duration', value: formatTime(track.info.length), inline: true },
        { name: 'Queue Position', value: `#${player.queue.length}`, inline: true }
      )
      .setThumbnail(track.info.artworkUrl);

    await loading.edit({ embeds: [embed] });

    if (!player.track) {
      await player.play();
    }
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
}

/**
 * !search <query>
 * Search for tracks with selection
 */
async function commandSearch(message, args) {
  if (!args.length) {
    return message.reply('❌ Please provide a search query. Usage: `!search <query>`');
  }

  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply('❌ You must be in a voice channel to use search.');
  }

  let player = manager.get(message.guildId);
  if (!player) {
    player = manager.create({
      guildId: message.guildId,
      voiceChannelId: voiceChannel.id,
      textChannelId: message.channelId,
    });
  }

  const query = args.join(' ');
  const loading = await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor('Yellow')
        .setTitle('🔍 Searching...')
        .setDescription(`Searching for: **${query}**`),
    ],
  });

  try {
    const results = await player.search(query);
    
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

    const tracks = results.data.slice(0, 5); // Top 5 results
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setTitle('🎵 Search Results')
      .setDescription(`Found ${results.data.length} results. Select one:\n`)
      .addFields(
        ...tracks.map((track, index) => ({
          name: `${index + 1}. ${track.info.title}`,
          value: `${track.info.author} • ${formatTime(track.info.length)}`,
          inline: false,
        }))
      )
      .setFooter({ text: 'Reply with a number (1-5) to select a track' });

    const resultMessage = await loading.edit({ embeds: [embed] });

    // Collect user input
    const filter = (m) => m.author.id === message.author.id && /^[1-5]$/.test(m.content);
    const collected = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: SEARCH_TIMEOUT,
      errors: ['time'],
    });

    const selected = parseInt(collected.first().content) - 1;
    const selectedTrack = tracks[selected];

    player.addTrack(selectedTrack);

    const confirmEmbed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setTitle('✅ Track Added')
      .setDescription(`[${selectedTrack.info.title}](${selectedTrack.info.uri})`)
      .addFields(
        { name: 'Artist', value: selectedTrack.info.author, inline: true },
        { name: 'Duration', value: formatTime(selectedTrack.info.length), inline: true },
        { name: 'Queue Position', value: `#${player.queue.length}`, inline: true }
      )
      .setThumbnail(selectedTrack.info.artworkUrl);

    await message.reply({ embeds: [confirmEmbed] });

    if (!player.track) {
      await player.play();
    }
  } catch (error) {
    if (error.code === 'TIME') {
      return message.reply('⏱️ Search timed out. Please try again.');
    }
    console.error('Search error:', error);
    await message.reply('❌ An error occurred during search.');
  }
}

/**
 * !nowplaying
 * Shows current track information with embed
 */
async function commandNowPlaying(message) {
  const player = manager.get(message.guildId);
  if (!player || !player.track) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Red')
          .setTitle('❌ Nothing Playing')
          .setDescription('No track is currently playing.'),
      ],
    });
  }

  const track = player.track;
  const position = player.position || 0;
  const duration = track.info.length;
  const progress = Math.round((position / duration) * 20);
  const bar = '█'.repeat(progress) + '░'.repeat(20 - progress);

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('🎵 Now Playing')
    .setDescription(`[${track.info.title}](${track.info.uri})`)
    .addFields(
      { name: 'Artist', value: track.info.author, inline: true },
      { name: 'Volume', value: `${player.volume}%`, inline: true },
      { name: 'Status', value: player.paused ? '⏸️ Paused' : '▶️ Playing', inline: true },
      { name: 'Progress', value: `\`${bar}\` ${formatTime(position)} / ${formatTime(duration)}` }
    )
    .setThumbnail(track.info.artworkUrl)
    .setFooter({ text: `Queue: ${player.queue.length} tracks` });

  await message.reply({ embeds: [embed] });
}

/**
 * !queue [page]
 * Shows the current queue with embed pagination
 */
async function commandQueue(message, args) {
  const player = manager.get(message.guildId);
  if (!player || player.queue.length === 0) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Yellow')
          .setTitle('📜 Queue')
          .setDescription('Queue is empty.'),
      ],
    });
  }

  const page = parseInt(args[0]) || 1;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(player.queue.length / itemsPerPage);

  if (page < 1 || page > totalPages) {
    return message.reply(`❌ Invalid page. Please choose between 1 and ${totalPages}.`);
  }

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const queueSlice = player.queue.slice(start, end);

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('📜 Queue')
    .setDescription(
      queueSlice
        .map(
          (track, idx) =>
            `${start + idx + 1}. [${track.info.title}](${track.info.uri}) - ${formatTime(track.info.length)}`
        )
        .join('\n')
    )
    .setFooter({
      text: `Page ${page}/${totalPages} • Total: ${player.queue.length} tracks • ${formatTime(getTotalQueueDuration(player.queue))}`,
    });

  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('queue_prev')
        .setLabel('⬅️ Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 1),
      new ButtonBuilder()
        .setCustomId('queue_next')
        .setLabel('Next ➡️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === totalPages)
    );

  await message.reply({ embeds: [embed], components: [buttons] });
}

/**
 * !skip
 * Skip to next track
 */
async function commandSkip(message) {
  const player = manager.get(message.guildId);
  if (!player) {
    return message.reply('❌ No player active in this guild.');
  }

  if (player.queue.length === 0 && !player.track) {
    return message.reply('❌ Nothing to skip.');
  }

  const skipped = player.track;
  const success = await player.skip();

  if (success) {
    const nextTrack = player.queue[0];
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setTitle('⏭️ Track Skipped')
      .addFields(
        { name: 'Skipped', value: `[${skipped.info.title}](${skipped.info.uri})`, inline: false },
        {
          name: 'Now Playing',
          value: nextTrack ? `[${nextTrack.info.title}](${nextTrack.info.uri})` : 'None',
          inline: false,
        }
      );

    await message.reply({ embeds: [embed] });
  } else {
    await message.reply('❌ Failed to skip track.');
  }
}

/**
 * !pause
 * Pause playback
 */
async function commandPause(message) {
  const player = manager.get(message.guildId);
  if (!player || !player.track) {
    return message.reply('❌ No track is playing.');
  }

  if (player.paused) {
    return message.reply('❌ Player is already paused.');
  }

  await player.pause(true);
  const embed = new EmbedBuilder()
    .setColor('Orange')
    .setTitle('⏸️ Paused')
    .setDescription(`Paused: **${player.track.info.title}**`);

  await message.reply({ embeds: [embed] });
}

/**
 * !resume
 * Resume playback
 */
async function commandResume(message) {
  const player = manager.get(message.guildId);
  if (!player || !player.track) {
    return message.reply('❌ No track is loaded.');
  }

  if (!player.paused) {
    return message.reply('❌ Player is already playing.');
  }

  await player.pause(false);
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('▶️ Resumed')
    .setDescription(`Resumed: **${player.track.info.title}**`);

  await message.reply({ embeds: [embed] });
}

/**
 * !stop
 * Stop playback and disconnect
 */
async function commandStop(message) {
  const player = manager.get(message.guildId);
  if (!player) {
    return message.reply('❌ No player active in this guild.');
  }

  player.clearQueue();
  await player.stop();
  await player.disconnect();

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('⏹️ Stopped')
    .setDescription('Playback stopped and disconnected from voice channel.');

  await message.reply({ embeds: [embed] });
}

/**
 * !shuffle
 * Shuffle the queue
 */
async function commandShuffle(message) {
  const player = manager.get(message.guildId);
  if (!player || player.queue.length === 0) {
    return message.reply('❌ Queue is empty.');
  }

  player.shuffleQueue();
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('🔀 Queue Shuffled')
    .setDescription(`Shuffled ${player.queue.length} tracks.`);

  await message.reply({ embeds: [embed] });
}

/**
 * !clear
 * Clear the queue
 */
async function commandClear(message) {
  const player = manager.get(message.guildId);
  if (!player || player.queue.length === 0) {
    return message.reply('❌ Queue is already empty.');
  }

  const count = player.queue.length;
  player.clearQueue();

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('🗑️ Queue Cleared')
    .setDescription(`Removed ${count} tracks from the queue.`);

  await message.reply({ embeds: [embed] });
}

/**
 * !remove <position>
 * Remove a track from queue by position
 */
async function commandRemove(message, args) {
  const player = manager.get(message.guildId);
  if (!player || player.queue.length === 0) {
    return message.reply('❌ Queue is empty.');
  }

  const position = parseInt(args[0]);
  if (isNaN(position) || position < 1 || position > player.queue.length) {
    return message.reply(`❌ Invalid position. Queue has ${player.queue.length} tracks.`);
  }

  const removed = player.removeTrack(position - 1);

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('🗑️ Track Removed')
    .setDescription(`Removed: **${removed.info.title}**`)
    .setFooter({ text: `Queue: ${player.queue.length} tracks remaining` });

  await message.reply({ embeds: [embed] });
}

/**
 * !playnext <song>
 * Add track to front of queue (play next)
 */
async function commandPlayNext(message, args) {
  if (!args.length) {
    return message.reply('❌ Please provide a song name. Usage: `!playnext <song>`');
  }

  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply('❌ You must be in a voice channel.');
  }

  let player = manager.get(message.guildId);
  if (!player) {
    player = manager.create({
      guildId: message.guildId,
      voiceChannelId: voiceChannel.id,
      textChannelId: message.channelId,
    });
  }

  const query = args.join(' ');
  const loading = await message.reply('🔍 Searching...');

  try {
    const results = await player.search(query);
    if (!results.data || results.data.length === 0) {
      return loading.edit('❌ No tracks found.');
    }

    const track = results.data[0];
    const added = player.playNext(track);

    if (!added) {
      return loading.edit('❌ Queue is full.');
    }

    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setTitle('⏭️ Playing Next')
      .setDescription(`[${track.info.title}](${track.info.uri})`)
      .addFields(
        { name: 'Artist', value: track.info.author, inline: true },
        { name: 'Duration', value: formatTime(track.info.length), inline: true }
      )
      .setThumbnail(track.info.artworkUrl);

    await loading.edit({ embeds: [embed] });
  } catch (error) {
    console.error('PlayNext error:', error);
    await loading.edit('❌ Error adding track.');
  }
}

/**
 * !move <from> <to>
 * Move a track to a different position
 */
async function commandMove(message, args) {
  const player = manager.get(message.guildId);
  if (!player || player.queue.length === 0) {
    return message.reply('❌ Queue is empty.');
  }

  const from = parseInt(args[0]);
  const to = parseInt(args[1]);

  if (isNaN(from) || isNaN(to) || from < 1 || to < 1 || from > player.queue.length || to > player.queue.length) {
    return message.reply(`❌ Invalid positions. Usage: \`!move <from> <to>\` (1-${player.queue.length})`);
  }

  const success = player.moveTrack(from - 1, to - 1);
  if (!success) {
    return message.reply('❌ Failed to move track.');
  }

  const track = player.queue[to - 1];
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('📋 Track Moved')
    .setDescription(`[${track.info.title}](${track.info.uri})`)
    .addFields(
      { name: 'From Position', value: String(from), inline: true },
      { name: 'To Position', value: String(to), inline: true }
    );

  await message.reply({ embeds: [embed] });
}

/**
 * !swap <pos1> <pos2>
 * Swap two tracks in queue
 */
async function commandSwap(message, args) {
  const player = manager.get(message.guildId);
  if (!player || player.queue.length === 0) {
    return message.reply('❌ Queue is empty.');
  }

  const pos1 = parseInt(args[0]);
  const pos2 = parseInt(args[1]);

  if (isNaN(pos1) || isNaN(pos2) || pos1 < 1 || pos2 < 1 || pos1 > player.queue.length || pos2 > player.queue.length) {
    return message.reply(`❌ Invalid positions. Usage: \`!swap <pos1> <pos2>\` (1-${player.queue.length})`);
  }

  const success = player.swapTracks(pos1 - 1, pos2 - 1);
  if (!success) {
    return message.reply('❌ Failed to swap tracks.');
  }

  const track1 = player.queue[pos2 - 1];
  const track2 = player.queue[pos1 - 1];

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('🔄 Tracks Swapped')
    .addFields(
      { name: `Position ${pos1}`, value: `[${track2.info.title}](${track2.info.uri})`, inline: false },
      { name: `Position ${pos2}`, value: `[${track1.info.title}](${track1.info.uri})`, inline: false }
    );

  await message.reply({ embeds: [embed] });
}

/**
 * !jump <index>
 * Jump to a track and play it
 */
async function commandJump(message, args) {
  const player = manager.get(message.guildId);
  if (!player || player.queue.length === 0) {
    return message.reply('❌ Queue is empty.');
  }

  const index = parseInt(args[0]);
  if (isNaN(index) || index < 1 || index > player.queue.length) {
    return message.reply(`❌ Invalid index. Usage: \`!jump <index>\` (1-${player.queue.length})`);
  }

  const success = await player.jumpTo(index - 1);
  if (!success) {
    return message.reply('❌ Failed to jump to track.');
  }

  const track = player.track;
  if (!track) {
    return message.reply('❌ No track to play.');
  }

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('⏩ Jumped to Track')
    .setDescription(`[${track.info.title}](${track.info.uri})`)
    .addFields(
      { name: 'Artist', value: track.info.author, inline: true },
      { name: 'Duration', value: formatTime(track.info.length), inline: true }
    )
    .setThumbnail(track.info.artworkUrl);

  await message.reply({ embeds: [embed] });
}

/**
 * !queueinfo
 * Show queue summary
 */
async function commandQueueInfo(message) {
  const player = manager.get(message.guildId);
  if (!player) {
    return message.reply('❌ No player active.');
  }

  const info = player.getQueueInfo();
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('📊 Queue Info')
    .addFields(
      { name: 'Total Tracks', value: String(info.length), inline: true },
      { name: 'Total Duration', value: formatTime(info.totalDurationMs), inline: true },
      { name: 'Now Playing', value: info.nowPlaying ? `[${info.nowPlaying.info.title}](${info.nowPlaying.info.uri})` : 'None', inline: false }
    );

  if (info.upcomingSample.length > 0) {
    embed.addFields(
      { name: 'Next Tracks', value: info.upcomingSample.map((t, i) => `${i + 1}. ${t.info.title}`).join('\n'), inline: false }
    );
  }

  await message.reply({ embeds: [embed] });
}

/**
 * !upcoming [count]
 * Show next N tracks
 */
async function commandUpcoming(message, args) {
  const player = manager.get(message.guildId);
  if (!player || player.queue.length === 0) {
    return message.reply('❌ Queue is empty.');
  }

  const count = parseInt(args[0]) || 10;
  if (count < 1 || count > 25) {
    return message.reply('❌ Count must be between 1 and 25.');
  }

  const upcoming = player.getUpcoming(count);
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('🎵 Upcoming Tracks')
    .setDescription(
      upcoming
        .map((track, i) => `${i + 1}. [${track.info.title}](${track.info.uri}) - ${formatTime(track.info.length)}`)
        .join('\n')
    )
    .setFooter({ text: `Showing ${upcoming.length} of ${player.queue.length} queued tracks` });

  await message.reply({ embeds: [embed] });
}

/**
 * !stats
 * Show player statistics
 */
async function commandStats(message) {
  const player = manager.get(message.guildId);
  if (!player) {
    return message.reply('❌ No player active in this guild.');
  }

  const metrics = player.getMetrics();
  const historyStats = player.getHistoryStats();

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('📊 Player Statistics')
    .addFields(
      { name: 'Tracks Played', value: String(metrics.tracksPlayed), inline: true },
      { name: 'Session Duration', value: formatTime(metrics.sessionDuration), inline: true },
      { name: 'Errors', value: String(metrics.errorCount), inline: true },
      { name: 'Tracks Skipped', value: String(historyStats.skipped), inline: true },
      { name: 'Unique Tracks', value: String(historyStats.unique), inline: true },
      { name: 'Queue Size', value: String(player.queue.length), inline: true }
    );

  await message.reply({ embeds: [embed] });
}

/**
 * !help
 * Show all available commands
 */
async function commandHelp(message) {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('🎵 Music Bot Commands')
    .addFields(
      {
        name: '▶️ Playback',
        value: '`!play <song>` - Play a song\n`!search <query>` - Search and select\n`!skip` - Skip\n`!pause` - Pause\n`!resume` - Resume\n`!stop` - Stop',
        inline: false,
      },
      {
        name: '📜 Queue Management',
        value: '`!queue [page]` - Show queue\n`!shuffle` - Shuffle\n`!clear` - Clear\n`!remove <pos>` - Remove\n`!np` - Now playing',
        inline: false,
      },
      {
        name: '🔀 Advanced Queue',
        value: '`!playnext <song>` - Play next\n`!move <from> <to>` - Reorder\n`!swap <pos1> <pos2>` - Swap\n`!jump <index>` - Jump to track',
        inline: false,
      },
      {
        name: '📊 Info',
        value: '`!stats` - Stats\n`!queueinfo` - Queue summary\n`!upcoming [count]` - Next tracks\n`!help` - Commands',
        inline: false,
      }
    )
    .setFooter({ text: 'Prefix: ! | All commands require voice channel access' });

  await message.reply({ embeds: [embed] });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format milliseconds to MM:SS or HH:MM:SS
 */
function formatTime(ms) {
  if (!ms || ms === 0) return '0:00';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

/**
 * Get total duration of all tracks in queue
 */
function getTotalQueueDuration(queue) {
  return queue.reduce((total, track) => total + (track.info.length || 0), 0);
}

// Login
client.login(process.env.DISCORD_BOT_TOKEN || 'YOUR_BOT_TOKEN');
