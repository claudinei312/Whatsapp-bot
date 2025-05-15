import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let client;

export default async function handler(req, res) {
  if (!client) {
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true }
    });

    client.on('qr', qr => {
      console.log('QR RECEIVED', qr);
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      console.log('Client is ready!');
    });

    client.initialize();
  }

  if (req.method === 'GET') {
    res.status(200).json({ message: 'WhatsApp client starting, check logs for QR code.' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
