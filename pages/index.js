import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [session, setSession] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      if (data.session) {
        await loadUsers()
      }
      setLoading(false)
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      if (nextSession) {
        await loadUsers()
      } else {
        setUsers([])
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  async function loadUsers() {
    const { data, error } = await supabase.from('profiles').select('*').order('username', { ascending: true })
    if (!error) setUsers(data || [])
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <main style={{ padding: 20 }}><h1>Cargando...</h1></main>
  }

  if (!session) {
    return (
      <main style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
        <h1>TheList</h1>
        <p>Una watchlist privada por invitación.</p>
        <ul>
          <li><Link href="/signup">Crear cuenta</Link></li>
          <li><Link href="/login">Iniciar sesión</Link></li>
          <li><Link href="/invite">Generar invitación</Link></li>
        </ul>
      </main>
    )
  }

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Watchlists</h1>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <p>Bienvenido. Elige un usuario para ver su watchlist.</p>

      <div style={{ marginBottom: 20 }}>
        <Link href={`/watchlist?user=${session.user.id}`}>Ir a mi watchlist</Link>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => {
          if (user.id === session.user.id) return null
          return (
            <li key={user.id} style={{ marginBottom: 12 }}>
              <Link href={`/watchlist?user=${user.username}`}>{user.username}</Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
