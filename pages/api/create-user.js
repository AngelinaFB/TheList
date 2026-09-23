import { supabaseAdmin } from '../../lib/supabaseAdmin'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, username } = req.body || {}

  if (!email || !username) {
    return res.status(400).json({ error: 'email and username required' })
  }

  const password = crypto.randomBytes(24).toString('hex')

  try {
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
      },
    })

    if (createError) {
      return res.status(400).json({ error: createError.message })
    }

    const user = userData?.user
    if (!user) {
      return res.status(500).json({ error: 'No se pudo crear el usuario' })
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').upsert([
      {
        id: user.id,
        username,
        email,
      },
    ])

    if (profileError) {
      return res.status(500).json({ error: profileError.message })
    }

    return res.status(200).json({ ok: true, userId: user.id })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'unknown error' })
  }
}
