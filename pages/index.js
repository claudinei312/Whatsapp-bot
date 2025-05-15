import { useState } from 'react';

export default function Home() {
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState('');

  async function enviarMensagem() {
    setStatus('Enviando...');
    try {
      const res = await fetch('/api/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefone, mensagem }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Mensagem enviada com sucesso!');
      } else {
        setStatus('Erro: ' + data.error);
      }
    } catch (e) {
      setStatus('Erro ao enviar mensagem');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Envio de Mensagem WhatsApp</h1>
      <input
        placeholder="Telefone (somente números)"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <textarea
        placeholder="Mensagem"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8, height: 100 }}
      />
      <button onClick={enviarMensagem} style={{ padding: 10 }}>
        Enviar
      </button>
      <p>{status}</p>
    </div>
  );
          }
