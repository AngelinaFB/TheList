import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const verifyRes = await fetch('/api/verify-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      })

      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Invitación inválida')
      }

      const createUserRes = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      })

      const createUserData = await createUserRes.json()
      if (!createUserRes.ok) {
        throw new Error(createUserData.error || 'No se pudo crear la cuenta invitada')
      }

      setMessage('Cuenta creada. Ahora revisa tu correo para entrar.')
      router.push('/login')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h1>Crear cuenta por invitación</h1>
      <p>Necesitas un token de invitación válido para registrarte. No harás login con contraseña; el acceso será por correo.</p>

      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 12 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nombre de usuario" style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token de invitación" style={{ width: '100%' }} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Registrarme'}</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
      </p>
    </main>
  )
}
