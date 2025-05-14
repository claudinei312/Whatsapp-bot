import { create } from 'venom-bot';
import { getSheetData } from './google.js';
import dotenv from 'dotenv';

dotenv.config();

create().then((client) => start(client));

async function start(client) {
  const contatos = await getSheetData();

  for (let [nome, telefone, frase, status] of contatos) {
    if (status.toLowerCase() !== 'enviado') {
      await client.sendText(`${telefone}@c.us`, `Olá ${nome}, ${frase}`);
      console.log(`Mensagem enviada para ${nome}`);
    }
  }
}
