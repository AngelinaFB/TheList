import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { token, email } = req.body || {}
  if (!token || !email) return res.status(400).json({ error: 'token and email required' })
  const { data, error } = await supabaseAdmin.from('invites').select('*').eq('token', token).single()
  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'invalid token' })
  if (data.used) return res.status(400).json({ error: 'token already used' })
  if (data.email !== email) return res.status(400).json({ error: 'token does not match email' })
  // mark used
  await supabaseAdmin.from('invites').update({ used: true }).eq('token', token)
  res.status(200).json({ ok: true })
}
