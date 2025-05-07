from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List, Optional
from app.core.db import connect_to_db

router = APIRouter()

class PlaceInput(BaseModel):
  name: str
  address: Optional[str] = None
  tags: Optional[List[str]] = []
  visited: bool = False
  favorited: bool = False

@router.get("/places")
async def get_places():
    conn = await connect_to_db()
    try:
        rows = await conn.fetch("SELECT * FROM places ORDER BY created_at DESC;")
        return [dict(row) for row in rows]
    finally:
        await conn.close()

@router.post("/places")
async def add_place(place: PlaceInput):
  conn = await connect_to_db()
  try:
    await conn.execute(
            """
            INSERT INTO places (name, address, tags, visited, favorited)
            VALUES ($1, $2, $3, $4, $5);
            """,
            place.name,
            place.address,
            place.tags,
            place.visited,
            place.favorited,
        )
    return {"success": True}
  finally:
    await conn.close()