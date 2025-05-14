import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

export default async function handler(req, res) {
  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = "Página1!A2:D";

    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = getRows.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ message: "Sem dados na planilha." });
    }

    let enviados = 0;
    for (let i = 0; i < rows.length; i++) {
      const [nome, telefone, frase, status] = rows[i];

      if (status !== "ENVIADO") {
        console.log(`Enviando para ${nome} (${telefone}) - ${frase}`);

        // Simula envio aqui. Substitua por integração com Venom Bot
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 segundo por contato

        // Atualiza status na planilha
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Página1!D${i + 2}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [["ENVIADO"]],
          },
        });

        enviados++;

        // Pausa de 20 minutos a cada 30 mensagens
        if (enviados % 30 === 0) {
          console.log("Pausando por 20 minutos...");
          await new Promise((resolve) => setTimeout(resolve, 20 * 60 * 1000));
        }
      }
    }

    res.status(200).json({ message: "Mensagens processadas com sucesso!" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao enviar mensagens." });
  }
}
