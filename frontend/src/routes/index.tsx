import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PlaceCard } from '../components/PlaceCard'

type Place = {
  id: string
  name: string
  address?: string
  tags?: Array<string>
  visited: boolean
  favorited: boolean
  created_at: string
}

export const Route = createFileRoute('/')({
  component: () => {
    const [places, setPlaces] = useState<Array<Place>>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      fetch('http://127.0.0.1:8000/places')
        .then((res) => res.json())
        .then((json) => setPlaces(json))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }, [])

    return (
      <main className="p-6 space-y-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">🍴 Forkit: Places</h1>

        {loading && <p>Loading...</p>}
        {!loading && places.length === 0 && <p>No places yet.</p>}

        <div className="space-y-4">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </main>
    )
  },
})
