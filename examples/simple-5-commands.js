// Simple 5-command music bot with lava.ts (prefix commands)
// Commands: !play, !stop, !pause, !resume, !skip

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Manager } = require('../dist/index.js');

const PREFIX = '!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// Initialize Lavalink Manager
const manager = new Manager({
  nodes: [
    {
      name: 'Main',
      host: 'lava-v4.ajieblogs.eu.org',
      port: 443,
      password: 'https://dsc.gg/ajidevserver',
      secure: true,
    },
  ],
  send: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(payload);
  },
  autoPlay: true,
  debug: true,
});

client.on('ready', async () => {
  console.log(`✓ Bot logged in as ${client.user.tag}`);
  
  // Initialize manager with bot's user ID
  if (!manager.isInitialized()) {
    await manager.init(client.user.id);
    console.log('✓ Lavalink Manager initialized');
  }
});

client.on('raw', (packet) => {
    if (manager.isInitialized()) {
        manager.updateVoiceState(packet);
    }
});

// Prefix command handler
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  const guildId = message.guildId;
  const voiceChannel = message.member?.voice?.channel;
  const textChannelId = message.channelId;

  // Ensure command exists
  if (!command) return;

  // Command: !play <song>
  if (command === 'play') {
    const query = args.join(' ');
    if (!query) {
      return message.reply('❌ Usage: !play <song or URL>');
    }

    if (!voiceChannel) {
      return message.reply('❌ Join a voice channel first!');
    }

    try {
      // Get or create player
      let player = manager.get(guildId);
      if (!player) {
        player = manager.create({
          guildId,
          voiceChannelId: voiceChannel.id,
          textChannelId,
          selfDeafen: true,
          selfMute: false,
        });
      }

      // Search for tracks
      const result = await player.search(query);
      if (!result.data || result.data.length === 0) {
        return message.reply('❌ No tracks found!');
      }

      const track = Array.isArray(result.data) ? result.data[0] : result.data;
      player.addTrack(track);

      if (!player.track) {
        await player.play();
      }

      message.reply(`✅ Queued: **${track.info.title}** by ${track.info.author}`);
    } catch (error) {
      message.reply(`❌ Error: ${error.message}`);
    }
  }

  // Command: !stop
  else if (command === 'stop') {
    const player = manager.get(guildId);
    if (!player) {
      return message.reply('❌ No player active!');
    }

    await player.stop();
    player.queue = [];
    message.reply('⏹️ Stopped playback');
  }

  // Command: !pause
  else if (command === 'pause') {
    const player = manager.get(guildId);
    if (!player || !player.track) {
      return message.reply('❌ Nothing playing!');
    }

    await player.pause();
    message.reply('⏸️ Paused');
  }

  // Command: !resume
  else if (command === 'resume') {
    const player = manager.get(guildId);
    if (!player || !player.track) {
      return message.reply('❌ Nothing to resume!');
    }

    await player.resume();
    message.reply('▶️ Resumed');
  }

  // Command: !skip
  else if (command === 'skip') {
    const player = manager.get(guildId);
    if (!player || !player.track) {
      return message.reply('❌ Nothing playing!');
    }

    const skipped = await player.skip();
    if (skipped) {
      message.reply('⏭️ Skipped to next track');
    } else {
      message.reply('⏹️ Queue ended');
    }
  }

  // Command: !help
  else if (command === 'help') {
    message.reply(
      'Commands:\n' +
      '!play <song/url> - queue a track\n' +
      '!stop - stop and clear queue\n' +
      '!pause - pause playback\n' +
      '!resume - resume playback\n' +
      '!skip - skip to next track'
    );
  }
});

client.login(process.env.DISCORD_BOT_TOKEN || "YOUR_BOT_TOKEN");
