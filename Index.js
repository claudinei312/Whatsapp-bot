import venom from 'venom-bot';
import { google } from 'googleapis';

// Pega as variáveis do ambiente
const projectId = process.env.PROJECT_ID;
const clientEmail = process.env.CLIENT_EMAIL;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
const spreadsheetId = process.env.SPREADSHEET_ID1TwVvcisEawBftNnjwa8E-i8DBEtDbuNvrOiHFzhKJJg;

// Configura autenticação do Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function readMessages() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2:D', // exemplo, ajusta conforme sua planilha
  });
  return res.data.values || [];
}

async function sendWhatsAppMessages(client) {
  const messages = await readMessages();

  for (const [nome, telefone, frase, status] of messages) {
    if (status !== 'Enviado') {
      const number = telefone.replace(/\D/g, '') + '@c.us'; // formata número para WhatsApp
      const message = `Olá ${nome}, ${frase}`;

      try {
        await client.sendText(number, message);
        console.log(`Mensagem enviada para ${nome}`);

        // Atualiza planilha marcando como enviado
        const rowIndex = messages.indexOf([nome, telefone, frase, status]) + 2;
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `D${rowIndex}`,
          valueInputOption: 'RAW',
          requestBody: { values: [['Enviado']] },
        });
      } catch (e) {
        console.error(`Erro ao enviar para ${nome}:`, e.message);
      }

      // Pausa de 1 minuto entre mensagens (1000ms * 60)
      await new Promise((r) => setTimeout(r, 60000));
    }
  }
}

venom.create().then((client) => {
  console.log('WhatsApp conectado');
  sendWhatsAppMessages(client);
}).catch((err) => {
  console.error('Erro ao conectar WhatsApp:', err);
});
