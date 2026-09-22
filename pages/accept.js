import { useState } from 'react'

export default function AcceptInvite() {
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function verify(e) {
    e.preventDefault()
    const res = await fetch('/api/verify-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email })
    })
    const data = await res.json()
    if (res.ok) setMessage('Invitación verificada. Ahora regístrate en Supabase usando ese email.')
    else setMessage('Error: ' + (data.error || data.message))
  }

  return (
    <main style={{padding:20}}>
      <h1>Aceptar invitación</h1>
      <form onSubmit={verify}>
        <input value={token} onChange={e=>setToken(e.target.value)} placeholder="token de invitación" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu email registrado" />
        <button type="submit">Verificar</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  )
}
