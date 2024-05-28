const { results } = require('@permaweb/aoconnect');
const WebSocket = require('ws');

let cursor = '';
const ws = new WebSocket('ws://localhost:8080'); // WebSocket bağlantısını başlat

ws.on('open', () => {
  console.log('WebSocket bağlantısı açıldı');
});

ws.on('error', (error) => {
  console.error('WebSocket hatası:', error);
});

// DevChatCheking fonksiyonunu tanımla
async function DevChatCheking() {
  try {
    if (cursor == '') {
      const resultsOut = await results({
        process: '90O7RFBp7M2c9TkOot4Nb5r-rbN9QMUAmcxu0Hf3K6Q',
        sort: 'DESC',
        limit: 1,
      });
      cursor = resultsOut.edges[0].cursor;
      console.log('İlk sonuçlar:', resultsOut);
    }

    console.log('DevChatCheking------>>>>');
    const resultsOut2 = await results({
      process: '90O7RFBp7M2c9TkOot4Nb5r-rbN9QMUAmcxu0Hf3K6Q',
      from: cursor,
      sort: 'ASC',
      limit: 50,
    });

    for (const element of resultsOut2.edges.reverse()) {
      cursor = element.cursor;
      console.log('Eleman Verisi:', element.node.Messages);

      for (const msg of element.node.Messages) {
        console.log('Mesaj Etiketleri:', msg.Tags);
      }

      const messagesData = element.node.Messages.filter(e => e.Tags.length > 0 && e.Tags.some(f => f.name == 'Action' && f.value == 'Say'));
      console.log('Filtrelenmiş Mesaj Verisi:', messagesData);
      for (const messagesItem of messagesData) {
          const event = messagesItem.Tags.find(e => e.name == 'Event')?.value || 'Message in CoinssporRoom';
          const sendTest = event + ' : ' + messagesItem.Data;
          console.log('Yakalanan Mesaj:', sendTest);
          ws.send(sendTest); // WebSocket üzerinden mesajı gönder
      }
    }

  } catch (error) {
    console.error('DevChatCheking hatası:', error);
    console.error('Hata detayları:', error.message);
  } finally {
    setTimeout(DevChatCheking, 5000);
  }
}

DevChatCheking();
