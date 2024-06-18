const { Client, GatewayIntentBits } = require('discord.js');
const { message, createDataItemSigner } = require('@permaweb/aoconnect');
const { readFileSync } = require('fs');

const token = '*************************';
const channelId = '******************'; // Discord kanal ID'si

const walletPath = '/root/.aos.json'; // Doðru dosya yolu
const walletContent = JSON.parse(readFileSync(walletPath).toString());

async function relayMessageToDevChat(incomingMsg) {
  const senderName = incomingMsg.author.username;
  const msgContent = incomingMsg.content;

  console.log(`Preparing to relay message from ${senderName} to DevChat: ${msgContent}`);

  await message({
    process: '_TvvXcFb4RWIPUg03g_8jfTjgNyQMpKt6wMcEBEaByE', // Process ID doðru þekilde ayarlanmalý
    tags: [
      { name: 'Action', value: 'BroadcastDiscord' },
      { name: 'Data', value: msgContent },
      { name: 'Event', value: senderName },
    ],
    signer: createDataItemSigner(walletContent),
    data: msgContent,
  })
  .then(response => {
    console.log('Message successfully relayed to DevChat:', response);
  })
  .catch(error => {
    console.error('Error relaying message to DevChat:', error);
  });
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

client.on('messageCreate', message => {
  if (message.channel.id === channelId && !message.author.bot) {
    console.log(`Message from ${message.author.username}: ${message.content}`);
    relayMessageToDevChat(message);
  }
});
