import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function WatchlistPage() {
  const router = useRouter()
  const { user } = router.query

  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [type, setType] = useState('serie')
  const [category, setCategory] = useState('pendiente')
  const [commentText, setCommentText] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      setSession(sessionData.session)

      if (!user) {
        if (sessionData.session) {
          router.replace(`/watchlist?user=${sessionData.session.user.id}`)
        }
        setLoading(false)
        return
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.eq.${user},id.eq.${user}`)
        .maybeSingle()

      if (error) console.error(error)
      setProfile(profileData)

      if (profileData) {
        await fetchItems(profileData.id)
      }
      setLoading(false)
    }

    loadProfile()
  }, [user, router])

  async function fetchItems(targetUserId) {
    const { data, error } = await supabase
      .from('watchlist_items')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    const itemsWithComments = await Promise.all(
      (data || []).map(async (item) => {
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('item_id', item.id)
          .order('created_at', { ascending: true })

        return {
          ...item,
          comments: commentsData || [],
        }
      })
    )

    setItems(itemsWithComments)
  }

  async function addItem(e) {
    e.preventDefault()
    if (!session || !profile || !title.trim()) return

    const { error } = await supabase.from('watchlist_items').insert([
      {
        user_id: profile.id,
        title: title.trim(),
        type,
        category,
      },
    ])

    if (error) {
      console.error(error)
      return
    }

    setTitle('')
    setType('serie')
    setCategory('pendiente')
    fetchItems(profile.id)
  }

  async function removeItem(itemId) {
    if (!session || !profile) return
    const { error } = await supabase.from('watchlist_items').delete().eq('id', itemId).eq('user_id', profile.id)
    if (error) {
      console.error(error)
      return
    }
    fetchItems(profile.id)
  }

  async function addComment(itemId) {
    if (!session || !profile || !commentText[itemId]?.trim()) return

    const { error } = await supabase.from('comments').insert([
      {
        owner_user_id: session.user.id,
        target_user_id: profile.id,
        item_id: itemId,
        comment: commentText[itemId].trim(),
      },
    ])

    if (error) {
      console.error(error)
      return
    }

    setCommentText((prev) => ({ ...prev, [itemId]: '' }))
    fetchItems(profile.id)
  }

  const isOwner = !!session && !!profile && session.user.id === profile.id

  if (loading) {
    return <main style={{ padding: 20 }}><h1>Cargando watchlist...</h1></main>
  }

  if (!profile) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Usuario no encontrado</h1>
        <a href="/">Volver a inicio</a>
      </main>
    )
  }

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>{profile.username} — Watchlist</h1>
      <p><a href="/">Volver</a></p>

      {isOwner && (
        <form onSubmit={addItem} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la serie o película" />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="serie">Serie</option>
              <option value="pelicula">Película</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="viendo">Viendo</option>
              <option value="favorita">Favorita</option>
            </select>
          </div>
          <button type="submit">Añadir</button>
        </form>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <strong>{item.title}</strong>
              <span>{item.type} · {item.category}</span>
            </div>

            {isOwner && (
              <button type="button" onClick={() => removeItem(item.id)} style={{ marginTop: 8 }}>
                Quitar
              </button>
            )}

            <div style={{ marginTop: 12 }}>
              <h4>Comentarios</h4>
              {item.comments.length === 0 ? <p>No hay comentarios aún.</p> : (
                <ul>
                  {item.comments.map((comment) => (
                    <li key={comment.id} style={{ marginBottom: 8 }}>
                      {comment.comment}
                    </li>
                  ))}
                </ul>
              )}

              {!isOwner && session ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input
                    value={commentText[item.id] || ''}
                    onChange={(e) => setCommentText((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Escribe tu comentario"
                  />
                  <button type="button" onClick={() => addComment(item.id)}>Comentar</button>
                </div>
              ) : !session ? (
                <p>Inicia sesión para comentar.</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
