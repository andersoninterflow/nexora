'use client'

import { useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3000'

export default function Page() {
  const [email, setEmail] = useState('admin@nexora.local')
  const [password, setPassword] = useState('admin123')
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function login() {
    setError(null)
    const res = await fetch(`${API}/v1/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json().catch(() => null)
    if (!res.ok) {
      setError(data?.message ?? 'Falha no login')
      return
    }

    setToken(data.accessToken)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b0f17', color: 'white', padding: 24 }}>
      <div style={{ width: 'min(520px, 100%)', background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>NEXORA Admin</h1>
        <p style={{ opacity: 0.9, marginTop: 0 }}>
          Login de teste para validar integração com a API.
        </p>

        <label style={{ display: 'block', marginBottom: 8 }}>E-mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 10 }} />

        <label style={{ display: 'block', margin: '14px 0 8px' }}>Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 10 }} />

        <button onClick={login} style={{ marginTop: 16, width: '100%', padding: 12, borderRadius: 12, cursor: 'pointer' }}>
          Entrar
        </button>

        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}

        {token && (
          <div style={{ marginTop: 16 }}>
            <p style={{ marginBottom: 8 }}>✅ Access token recebido:</p>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#0b0f17', padding: 12, borderRadius: 12 }}>{token}</pre>
          </div>
        )}
      </div>
    </main>
  )
}
