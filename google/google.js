// google/google.js
import fs from 'fs';
import { google as googleapis } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'google/token.json';

export const google = {
  authorize: async () => {
    const credentials = JSON.parse(fs.readFileSync('google/credentials.json'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new googleapis.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  },

  readSheet: async (auth) => {
    const sheets = googleapis.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SHEET_ID;
    const range = 'Página1!A:D'; // ajuste conforme o nome da aba e colunas

    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return res.data.values;
  }
};
