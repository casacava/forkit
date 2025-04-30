import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: () => {
    const [data, setData] = useState('loading...')

    useEffect(() => {
      fetch('http://127.0.0.1:8000/test-db')
        .then((res) => res.json())
        .then((json) => setData(JSON.stringify(json)))
        .catch(() => setData('error fetching backend'))
    }, [])

    return (
      <main className="p-6 text-lg">
        <h1 className="font-bold text-2xl">🍴 Forkit Home</h1>
        <p className="mt-4 text-slate-700">
          Backend response: <span className="font-mono text-blue-500">{data}</span>
        </p>
      </main>
    )
  },
})
