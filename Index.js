import venom from "venom-bot";
import express from "express";
import { getSheetData } from "./google.js";

const app = express();
const port = process.env.PORT || 3000;

let client;

app.get("/api/enviar", async (req, res) => {
  if (!client) {
    return res.status(500).send("Cliente WhatsApp não conectado ainda");
  }

  try {
    const dados = await getSheetData();

    for (const [nome, telefone, mensagem] of dados) {
      const numero = telefone.replace(/\D/g, "") + "@c.us"; // Formata o número para o padrão do WhatsApp

      const texto = `Olá ${nome}, ${mensagem}`;

      await client.sendText(numero, texto);

      // Você pode colocar uma pausa aqui para evitar bloqueios
      await new Promise((r) => setTimeout(r, 1500));
    }

    res.send("Mensagens enviadas!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao enviar mensagens");
  }
});

venom
  .create({
    session: "bot-session",
    multidevice: true, // para funcionar com WhatsApp Business multidevice
  })
  .then((clientInstance) => {
    client = clientInstance;
    console.log("WhatsApp conectado!");
  })
  .catch((error) => {
    console.error("Erro ao iniciar Venom:", error);
  });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
