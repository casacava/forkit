type Place = {
  id: string
  name: string
  address?: string
  tags?: Array<string>
  visited: boolean
  favorited: boolean
  created_at: string
}

export function PlaceCard({ place }: {place: Place}) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-2">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold">{place.name}</h2>
        {place.favorited && <span>⭐</span>}
      </div>
      <p className="text-sm text-gray-600">{place.address}</p>
      {Array.isArray(place.tags) && place.tags.length > 0 && (
        <div className="text-xs text-blue-600 space-x-1">
          {place.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">
        {place.visited ? '✅ Visited' : '🕐 Want to try'}
      </p>
    </div>
  )
}