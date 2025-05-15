import { adicionarLinha } from '@/google/sheets';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { nome, telefone, frase } = req.body;

  if (!nome || !telefone || !frase) {
    return res.status(400).json({ erro: 'Dados incompletos' });
  }

  try {
    await adicionarLinha(nome, telefone, frase);
    return res.status(200).json({ sucesso: true, mensagem: 'Mensagem enviada com sucesso!' });
  } catch (erro) {
    console.error('Erro ao enviar:', erro);
    return res.status(500).json({ erro: 'Erro ao enviar os dados' });
  }
}
