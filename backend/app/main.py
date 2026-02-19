from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()
from transit.router import router as transit_router

app = FastAPI(title="BussrBee API")

app.include_router(transit_router)

@app.get("/health")
def health():
    return {"status": "ok"}