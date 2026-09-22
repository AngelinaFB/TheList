import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Watchlist() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const { data, error } = await supabase.from('watchlist').select('*').order('id', { ascending: false })
    if (error) {
      console.error(error)
      return
    }
    setItems(data || [])
  }

  async function addItem(e) {
    e.preventDefault()
    if (!title) return
    const { error } = await supabase.from('watchlist').insert([{ title, added_at: new Date().toISOString() }])
    if (error) return console.error(error)
    setTitle('')
    fetchItems()
  }

  return (
    <main style={{padding:20}}>
      <h1>Watchlist</h1>
      <form onSubmit={addItem}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título de película/serie" />
        <button type="submit">Añadir</button>
      </form>
      <ul>
        {items.map(it => (
          <li key={it.id}>{it.title} — {new Date(it.added_at).toLocaleString()}</li>
        ))}
      </ul>
    </main>
  )
}
