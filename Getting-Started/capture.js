const { results } = require('@permaweb/aoconnect');
const WebSocket = require('ws');

let cursor = '';
const ws = new WebSocket('ws://localhost:8080');

let sentMessages = new Set();
const MESSAGE_EXPIRATION_TIME = 1000; // 1 saniye

ws.on('open', () => {
  console.log('WebSocket baðlantýsý açýldý');
});

ws.on('error', (error) => {
  console.error('WebSocket hatasý:', error);
});

async function DevChatCheking() {
  try {
    if (cursor === '') {
      const resultsOut = await results({
        process: '6I1JBBc9SOMtqFxlX7OoYgsMh7QeZk2fFwUCHTUqshg',
        sort: 'DESC',
        limit: 1,
      });
      cursor = resultsOut.edges[0].cursor;
      console.log('Ýlk sonuçlar:', resultsOut);
    }

    console.log('DevChatCheking------>>>>');
    const resultsOut2 = await results({
      process: '6I1JBBc9SOMtqFxlX7OoYgsMh7QeZk2fFwUCHTUqshg',
      from: cursor,
      sort: 'ASC',
      limit: 50,
    });

    for (const element of resultsOut2.edges.reverse()) {
      cursor = element.cursor;
      console.log('Eleman Verisi:', JSON.stringify(element.node, null, 2));

      const messagesData = element.node.Messages.filter(e => {
        return e.Tags && e.Tags.length > 0 && e.Tags.some(f => f.name === 'Action' && f.value === 'Broadcasted');
      });
      console.log('Filtrelenmiþ Mesaj Verisi:', messagesData);

      for (const messagesItem of messagesData) {
        const content = messagesItem.Data || 'No content';
        const nicknameTag = messagesItem.Tags.find(tag => tag.name === 'Nickname');
        const nickname = nicknameTag ? nicknameTag.value : 'Unknown';

        // Nickname'in ilk ve son 5 karakterini almak
        const formattedNickname = `${nickname.substring(0, 5)}***${nickname.substring(nickname.length - 5)}`;

        // Belirli bir nickname ile eþleþirse mesajý gönderme
        if (nickname === '_TvvXcFb4RWIPUg03g_8jfTjgNyQMpKt6wMcEBEaByE') {
          console.log(`Mesaj gönderilmiyor: ${content} - Nickname: ${nickname}`);
          continue;
        }

        if (!sentMessages.has(content)) {
          const discordMessage = `USER_FROM_AOS, [${formattedNickname}] >>>> ${content}`;
          console.log('Yakalanan Mesaj:', content);
          // Discord'a gönder
          await sendToDiscord(discordMessage);

          // Mesajýn tekrar gönderilmesini önlemek için kaydediyoruz
          sentMessages.add(content);
          // Mesajý belirli bir süre sonra set'ten kaldýr
          setTimeout(() => {
            sentMessages.delete(content);
          }, MESSAGE_EXPIRATION_TIME);
        }
      }
    }
  } catch (error) {
    console.error('DevChatCheking hatasý:', error);
  } finally {
    setTimeout(DevChatCheking, 5000);
  }
}

async function sendToDiscord(content) {
  const ws = new WebSocket('ws://localhost:8080');

  ws.on('open', () => {
    ws.send(content);
    console.log(`Mesaj Discord'a gönderildi: ${content}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket hatasý:', error);
  });

  ws.on('close', () => {
    console.log('WebSocket baðlantýsý kapandý');
  });
}

DevChatCheking();
