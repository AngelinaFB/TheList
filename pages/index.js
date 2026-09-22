import Link from 'next/link'

export default function Home() {
  return (
    <main style={{padding:20}}>
      <h1>TheList — Watchlist privada</h1>
      <p>Proyecto privado para compartir listas con invitación (admin invites).</p>
      <ul>
        <li><Link href="/watchlist">Ver Watchlist</Link></li>
        <li><Link href="/invite">Crear invitación (admin)</Link></li>
        <li><Link href="/accept">Aceptar invitación</Link></li>
      </ul>
    </main>
  )
}
