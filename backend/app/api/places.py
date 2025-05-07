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
        rows = await conn.fetch("""
            SELECT 
                p.id,
                p.name,
                p.address,
                p.visited,
                p.favorited,
                p.created_at,
                ARRAY_REMOVE(ARRAY_AGG(t.name), NULL) AS tags
            FROM places p
            LEFT JOIN place_tags pt ON p.id = pt.place_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            GROUP BY p.id
            ORDER BY p.created_at DESC;
        """)
        return [dict(row) for row in rows]
    finally:
        await conn.close()

@router.post("/places")
async def add_place(place: PlaceInput):
  conn = await connect_to_db()
  try:
    async with conn.transaction():
            # Insert the new place
            place_row = await conn.fetchrow(
                """
                INSERT INTO places (name, address, visited, favorited)
                VALUES ($1, $2, $3, $4)
                RETURNING id;
                """,
                place.name,
                place.address,
                place.visited,
                place.favorited,
            )
            place_id = place_row["id"]

            tag_ids = []
            for tag_name in place.tags:
                tag_row = await conn.fetchrow(
                    """
                    INSERT INTO tags (name)
                    VALUES ($1)
                    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                    RETURNING id;
                    """,
                    tag_name,
                )
                tag_ids.append(tag_row["id"])

            for tag_id in tag_ids:
                await conn.execute(
                    """
                    INSERT INTO place_tags (place_id, tag_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING;
                    """,
                    place_id,
                    tag_id,
                )
    return {"success": True}
  finally:
    await conn.close()