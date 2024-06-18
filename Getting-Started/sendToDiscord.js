const { message, createDataItemSigner } = require('@permaweb/aoconnect');
const { readFileSync } = require('node:fs');

const wallet = JSON.parse(
  readFileSync('/root/.aos.json').toString(),
);

async function sendMessage(msg) {
  const username = msg.author.username;

  await message({
    process: '_TvvXcFb4RWIPUg03g_8jfTjgNyQMpKt6wMcEBEaByE', // Yeni process ID burada
    tags: [
      { name: 'Action', value: 'BroadcastDiscord' },
      { name: 'Data', value: msg.content },
      { name: 'Event', value: username },
    ],
    signer: createDataItemSigner(wallet),
    data: msg.content,
  })
  .then(console.log)
  .catch(console.error);
}

module.exports = {
  sendMessage,
};
