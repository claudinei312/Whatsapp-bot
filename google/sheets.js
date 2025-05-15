const { google } = require('googleapis');

async function acessarPlanilha() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

async function adicionarLinha(nome, telefone, frase, status = 'Enviado') {
  const sheets = await acessarPlanilha();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Página1!A:D',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[nome, telefone, frase, status]],
    },
  });
}

module.exports = { adicionarLinha };
