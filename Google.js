import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SHEET_ID = process.env.SHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

export async function getSheetData() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "A2:C", // Ajuste para a faixa que sua planilha usa (Nome, Telefone, Mensagem)
  });

  return response.data.values || [];
}
