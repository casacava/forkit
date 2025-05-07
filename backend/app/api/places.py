from fastapi import APIRouter
from app.core.db import connect_to_db

router = APIRouter()

@router.get("/places")
async def get_places():
  conn = await connect_to_db()
  try:
    rows = await conn.fetch("SELECT * FROM places ORDER BY created_at DESC;")
    return [dict(row) for row in rows]
  finally:
    await conn.close()