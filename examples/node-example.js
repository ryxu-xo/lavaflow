// Generic Node.js example (no Discord.js)
// Demonstrates using Manager + Player directly
// Run with: node examples/node-example.js

const Lava = require('../dist/index.js'); // build first with: npm run build

async function main() {
  const manager = new Lava.Manager({
    nodes: [
      {
        name: 'Main Node',
        host: process.env.LAVALINK_HOST || 'localhost',
        port: Number(process.env.LAVALINK_PORT || 2333),
        password: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
        secure: process.env.LAVALINK_SECURE === 'true',
      },
    ],
    // send() is required for Discord voice; here we provide a noop
    send: (_guildId, _payload) => {},
    autoPlay: true,
    defaultSearchPlatform: 'ytsearch',
  });

  // Since there's no Discord client, we still need a clientId to open the WS
  const pseudoClientId = 'generic-client-id-123';
  await manager.init(pseudoClientId);

  // Create a pseudo player for a pseudo guild
  const player = manager.create({
    guildId: 'generic-guild-1',
    voiceChannelId: 'generic-voice-1',
    textChannelId: undefined,
    selfDeafen: true,
    volume: 50,
  });

  // Note: Without Discord voice, playback won't be audible.
  // This example shows REST & WS interactions, search, and filter APIs.

  // Search (YouTube)
  const result = await manager.search('lofi hip hop');
  if (result.loadType === 'search' && result.data.length > 0) {
    const track = result.data[0];
    console.log('Loaded track:', track.info.title);

    // Play the track (sends Update Player REST call)
    await player.play(track);
    console.log('Play request sent.');

    // Apply filters
    await player.filters()
      .bassboost('medium')
      .rotation({ rotationHz: 0.15 })
      .apply();
    console.log('Filters applied.');

    // Seek after 10 seconds
    setTimeout(async () => {
      try {
        await player.seek(10_000);
        console.log('Seeked to 10s.');
      } catch (e) {
        console.error('Seek error:', e.message || e);
      }
    }, 5000);
  } else {
    console.log('No results or error:', result.loadType);
  }

  // Observe events
  manager.on('trackStart', (_player, track) => {
    console.log('Event: trackStart ->', track.info.title);
  });
  manager.on('trackEnd', (_player, track, reason) => {
    console.log('Event: trackEnd ->', track.info.title, reason);
  });

  // Clean up after a minute
  setTimeout(async () => {
    await manager.destroyAll();
    console.log('Manager destroyed.');
    process.exit(0);
  }, 60_000);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
