import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { randomUUID } from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const auth = req.headers['authorization'] || ''
  const ADMIN_SECRET = process.env.ADMIN_SECRET
  if (!ADMIN_SECRET || !auth.includes(ADMIN_SECRET)) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })
  const token = randomUUID()
  const { data, error } = await supabaseAdmin.from('invites').insert([{ email, token, used: false }])
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ token })
}
