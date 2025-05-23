from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import connect_to_db
from app.api import places

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test-db")
async def test_db():
    conn = await connect_to_db()
    result = await conn.fetch("SELECT 1;")
    await conn.close()
    return {"result": result}

app.include_router(places.router)