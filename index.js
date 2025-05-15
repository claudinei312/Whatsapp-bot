// index.js
import { create } from 'venom-bot';
import { google } from './google/google.js';

create({
  session: 'bot',
  multidevice: true
})
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

async function start(client) {
  const auth = await google.authorize();
  const data = await google.readSheet(auth);

  for (const [nome, telefone, frase, status] of data.slice(1)) {
    if (status !== 'ENVIADO') {
      const numero = telefone + '@c.us';
      const mensagem = `Olá ${nome}, ${frase}`;
      await client.sendText(numero, mensagem);
      console.log(`Mensagem enviada para ${nome}`);
    }
  }
}
