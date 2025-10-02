import { useEffect, useMemo, useState } from 'react'
import { fetchItems, postItem } from './lib/api'
import type { Item } from './lib/types'

export default function App() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')

  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE_URL as string, [])

  useEffect(() => {
    let mounted = true
    fetchItems()
      .then((data) => {
        if (mounted) setItems(data)
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const created = await postItem({ name })
      setItems((prev) => [...prev, created])
      setName('')
    } catch (e) {
      setError(String(e))
    }
  }

  return (
    <div className="container">
      <h1>Items</h1>
      <p className="muted">API: {apiBase}</p>
      <form onSubmit={onSubmit} className="form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          aria-label="Item name"
        />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error">Error: {error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="list">
          {items.map((it) => (
            <li key={it.id}>
              <span className="name">{it.name}</span>
              <span className="created">{new Date(it.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

