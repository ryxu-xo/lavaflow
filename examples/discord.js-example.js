// Plain JavaScript example using Discord.js v14 and lava.ts
// Run with: node examples/discord.js-example.js

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Manager, Events } = require('../dist/index.js'); // after build; or require('lava.ts') if installed from npm

// If you're running from src directly (ts-node), use:
// const Lava = require('../src/index.ts');

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// Import the voice status plugin
const { LavaVoiceStatusPlugin } = require('../lava-voice-status');

// Create Lavalink manager (JS uses the compiled dist build)
const manager = new Manager({
  nodes: [
    {
      name: 'Main Node',
      host: process.env.LAVALINK_HOST || 'lava-v4.ajieblogs.eu.org',
      port: Number(process.env.LAVALINK_PORT || 443),
      password: process.env.LAVALINK_PASSWORD || 'https://dsc.gg/ajidevserver',
      secure: true,
      resumeKey: 'lava.ts-example',
      resumeTimeout: 60,
      maxReconnectAttempts: 10,
      reconnectDelay: 5000,
      region: 'eu-central',
    },
  ],
  send: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(payload);
  },
  autoPlay: true,
  defaultSearchPlatform: 'spsearch',
  debug: true, // Set to false to disable debug messages
});

// Instantiate the voice status plugin
const voiceStatusPlugin = new LavaVoiceStatusPlugin(client, {
  template: 'Now playing: {title} by {author}',
});

// Register plugin with manager
manager.use({
  name: 'LavaVoiceStatus',
  onEvent(event, ...args) {
    if (event === 'trackStart') {
      const [player, track] = args;
      if (player.voiceChannelId && track?.info) {
        voiceStatusPlugin.setVoiceStatus(player.voiceChannelId, track.info);
      }
    }
    if (event === 'trackEnd') {
      const [player] = args;
      if (player.voiceChannelId) {
        voiceStatusPlugin.clearVoiceStatus(player.voiceChannelId);
      }
    }
  }
});


manager.use({
  name: 'BotActivityStatus',

  onEvent(event, ...args) {

    // Track Start
    if (event === 'trackStart') {
      const [player, track] = args;

      if (track?.info) {
        const name = track.info.title ?? "Unknown Track";
        const author = track.info.author ?? "";

        player.client.user.setPresence({
          activities: [
            {
              name: `${name} ${author ? `- ${author}` : ""}`,
              type: 2 // 2 = Listening
            }
          ],
          status: 'online'
        });
      }
    }

    // Track End → Clear Status
    if (event === 'trackEnd') {
      const [player] = args;

      // Set to idle, or whatever you prefer
      player.client.user.setPresence({
        activities: [],
        status: 'idle'
      });
    }
  }
});


// Manager events for debugging - set up BEFORE init()
manager.on(Events.NodeConnect, (node) => {
  console.log(`✅ Node connected: ${node?.options?.name || 'unknown'}`);
});

manager.on(Events.NodeDisconnect, (node, code, reason) => {
  console.log(`❌ Node disconnected: ${node?.options?.name || 'unknown'} - ${code}: ${reason}`);
});

manager.on(Events.NodeReconnect, (node) => {
  console.log(`🔄 Node reconnecting: ${node?.options?.name || 'unknown'}`);
});

manager.on(Events.NodeError, (node, error) => {
  console.error(`❌ Node error: ${node?.options?.name || 'unknown'}`, error?.message || error);
});

manager.on(Events.Debug, (message) => {
  console.log(`[DEBUG] ${message}`);
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    await manager.init(client.user.id);
    console.log('Lavalink manager initialized');
  } catch (error) {
    console.error('Failed to initialize manager:', error);
    console.error('Make sure Lavalink server is running and accessible');
  }
});

// Simple commands
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;
  const args = message.content.slice(1).trim().split(/\s+/);
  const command = (args.shift() || '').toLowerCase();

  try {
    switch (command) {
      case 'play': {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) return message.reply('Join a voice channel first.');

        const query = args.join(' ');
        if (!query) return message.reply('Provide a search query or URL.');

        // Check if any nodes are connected
        const connectedNodes = manager.getNodes().filter(n => n.isConnected());
        if (connectedNodes.length === 0) {
          return message.reply('❌ No Lavalink nodes available. Check console for connection errors.');
        }

        let player = manager.get(message.guildId);
        if (!player) {
          player = manager.create({
            guildId: message.guildId,
            voiceChannelId: voiceChannel.id,
            textChannelId: message.channelId,
            selfDeafen: true,
            volume: 50,
          });
          await player.connect();
        }

        const result = await player.search(query);
        if (result.loadType === 'empty') return message.reply('No results.');
        if (result.loadType === 'error') return message.reply(`Error: ${result.data.message}`);

        if (result.loadType === 'track') {
          if (player.track) {
            player.addTrack(result.data);
            await message.reply(`⏱️ Queued: **${result.data.info.title}**`);
          } else {
            await player.play(result.data);
            // trackStart event will announce it
          }
        } else if (result.loadType === 'playlist') {
          player.addTracks(result.data.tracks);
          if (!player.track) await player.play();
          await message.reply(`📋 Queued playlist: **${result.data.info.name}** (${result.data.tracks.length} tracks)`);
        } else if (result.loadType === 'search') {
          const track = result.data[0];
          console.log(`[DEBUG] player.track is ${player.track ? 'playing' : 'null'}, queue length: ${player.queue.length}`);
          if (player.track) {
            player.addTrack(track);
            await message.reply(`⏱️ Queued: **${track.info.title}**`);
          } else {
            await player.play(track);
            // trackStart event will announce it
          }
        }
        break;
      }

      case 'pause': {
        const player = manager.get(message.guildId);
        if (!player) return message.reply('No player.');
        await player.pause();
        await message.reply('Paused.');
        break;
      }

      case 'resume': {
        const player = manager.get(message.guildId);
        if (!player) return message.reply('No player.');
        await player.resume();
        await message.reply('Resumed.');
        break;
      }

      case 'skip': {
        const player = manager.get(message.guildId);
        if (!player) return message.reply('No player.');
        const ok = await player.skip();
        await message.reply(ok ? 'Skipped.' : 'Nothing to skip.');
        break;
      }

      case 'stop': {
        const player = manager.get(message.guildId);
        if (!player) return message.reply('No player.');
        await player.stop();
        await message.reply('Stopped.');
        break;
      }

      case 'volume': {
        const player = manager.get(message.guildId);
        if (!player) return message.reply('No player.');
        const vol = Number(args[0]);
        if (Number.isNaN(vol) || vol < 0 || vol > 100) return message.reply('0-100');
        await player.setVolume(vol);
        await message.reply(`Volume: ${vol}%`);
        break;
      }

      case 'leave': {
        const ok = await manager.destroyPlayer(message.guildId);
        await message.reply(ok ? 'Left voice.' : 'Not in voice.');
        break;
      }

      default:
        await message.reply('Commands: !play, !pause, !resume, !skip, !stop, !volume <0-100>, !leave');
    }
  } catch (err) {
    console.error(err);
    await message.reply(`Error: ${err && err.message ? err.message : 'Unknown error'}`);
  }
});

// Events (optional)
manager.on('trackStart', (player, track) => {
  const channel = client.channels.cache.get(player.textChannelId || '');
  if (channel && channel.isTextBased()) channel.send(`🎵 Now playing: **[${track.info.title}](${track.info.uri})**`);
});

manager.on('queueEnd', (player) => {
  const channel = client.channels.cache.get(player.textChannelId || '');
  if (channel && channel.isTextBased()) channel.send('✅ Queue finished.');
});

// Forward raw voice events (VOICE_STATE_UPDATE, VOICE_SERVER_UPDATE)
client.on('raw', (packet) => {
  if (manager.isInitialized()) {
    manager.updateVoiceState(packet);
  }
});

// Start the bot
  const token = process.env.DISCORD_TOKEN || '';
  if (!token) {
  console.error('Set DISCORD_TOKEN env var.');
  process.exit(1);
}
client.login(token);
