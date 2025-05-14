import { google } from 'googleapis';
import venom from 'venom-bot';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;

let client;

async function getGoogleSheets() {
  const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  await jwtClient.authorize();
  return google.sheets({ version: 'v4', auth: jwtClient });
}

async function getRows(sheets) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'A2:D',
  });
  return response.data.values || [];
}

async function sendMessage(client, number, message) {
  const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
  return client.sendText(formattedNumber, message);
}

async function updateStatus(sheets, rowNumber, status) {
  const range = `D${rowNumber}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [[status]] },
  });
}

async function createVenomClient() {
  if (client) return client;
  client = await venom.create({
    session: 'sessionName',
    multidevice: true,
  });
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    const sheets = await getGoogleSheets();
    const rows = await getRows(sheets);
    const venomClient = await createVenomClient();

    for (let i = 0; i < rows.length; i++) {
      const [name, phone, message, status] = rows[i];
      if (status === 'Enviado') continue;

      await sendMessage(venomClient, phone, message);
      await updateStatus(sheets, i + 2, 'Enviado');
    }

    return res.status(200).json({ message: 'Mensagens enviadas com sucesso' });
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: error.message });
  }
}
