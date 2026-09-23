import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSendCode(e) {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setSent(true)
    setMessage('Te hemos enviado un código a tu correo. Introdúcelo para entrar.')
  }

  async function handleVerify(e) {
    e.preventDefault()
    setMessage('')

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      setMessage(error.message)
      return
    }

    if (data?.session) {
      router.push('/')
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h1>Acceso por correo</h1>
      <p>Si tu sesión expiró, te mandaremos un código a tu email para volver a entrar.</p>

      {!sent ? (
        <form onSubmit={handleSendCode}>
          <div style={{ marginBottom: 12 }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" style={{ width: '100%' }} />
          </div>
          <button type="submit">Enviar código</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: 12 }}>
            <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Código recibido por email" style={{ width: '100%' }} />
          </div>
          <button type="submit">Verificar y entrar</button>
        </form>
      )}

      {message && <p>{message}</p>}

      <p>
        ¿No tienes cuenta? <Link href="/signup">Regístrate</Link>
      </p>
    </main>
  )
}
