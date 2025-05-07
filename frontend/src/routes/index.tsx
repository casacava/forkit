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

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [favorited, setFavorited] = useState(false)

    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<Array<string>>([])

    const fetchPlaces = async () => {
      const res = await fetch('http://127.0.0.1:8000/places')
      const data = await res.json()
      setPlaces(data)
      setLoading(false)
    }

    useEffect(() => {
      fetchPlaces()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const res = await fetch('http://127.0.0.1:8000/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          name,
          address,
          tags,
          visited: false,
          favorited,
        }),
      })

      if (res.ok) {
        setName('')
        setAddress('')
        setFavorited(false)
        setTags([])
        fetchPlaces()
      }
    }

    const handleAddTag = () => {
      const trimmed = tagInput.trim()
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed])
      }
      setTagInput('')
    }

    const handleRemoveTag = (tagToRemove: string) => {
      setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
    }

    return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">🍴 Forkit: Places</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-2 p-4 bg-white rounded shadow"
      >
        <h2 className="font-semibold text-lg">Add a new place</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Place name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address (optional)"
          className="w-full border p-2 rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={favorited}
            onChange={(e) => setFavorited(e.target.checked)}
          />
          <span>Favorited</span>
        </label>

        <div className="space-y-1">
          <label className="block font-medium">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag and press Enter"
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>


        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Place
        </button>
      </form>

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
