import { google } from '../../google';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { Nome, Telefone, Frase } = req.body;

    if (!Nome || !Telefone || !Frase) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }

    const sheets = await google();

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Página1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[Nome, Telefone, Frase, 'PENDENTE']],
      },
    });

    return res.status(200).json({ message: 'Mensagem enviada com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}
