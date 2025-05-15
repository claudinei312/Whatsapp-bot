import { google } from 'googleapis';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let client;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!client) {
    client = new Client();
    client.on('qr', qr => {
      console.log('QR Code recebido:');
      qrcode.generate(qr, { small: true });
    });
    client.on('ready', () => {
      console.log('Cliente WhatsApp pronto!');
    });
    client.initialize();
  }

  const { telefone, mensagem } = req.body;
  if (!telefone || !mensagem) {
    res.status(400).json({ error: 'Telefone ou mensagem ausente' });
    return;
  }

  try {
    await client.sendMessage(telefone + '@c.us', mensagem);
    res.status(200).json({ status: 'Mensagem enviada' });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
}
