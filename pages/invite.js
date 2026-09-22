import { useState } from 'react'

export default function InvitePage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function createInvite(e) {
    e.preventDefault()
    const adminSecret = prompt('Introduce el ADMIN_SECRET (no guardado):')
    if (!adminSecret) return
    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminSecret
      },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (res.ok) setMessage('Invitación creada. Token: ' + data.token)
    else setMessage('Error: ' + (data.error || data.message))
  }

  return (
    <main style={{padding:20}}>
      <h1>Crear invitación (Admin)</h1>
      <p>Esta página solicita el `ADMIN_SECRET` en un prompt y lo enviará al servidor para crear la invitación.</p>
      <form onSubmit={createInvite}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@ejemplo.com" />
        <button type="submit">Crear invitación</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  )
}
