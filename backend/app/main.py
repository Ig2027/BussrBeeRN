from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.transit.router import router as transit_router
from app.user.router import router as user_router
from app.chat.router import router as chat_router

app = FastAPI(title="BussrBee API")

# CORS - React Native doesn't send Origin header in some cases
# But this configuration works for both development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Fine for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transit_router, prefix="/api/transit", tags=["transit"])
app.include_router(user_router, prefix="/api/user", tags=["user"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

@app.get("/")
def root():
    return {"message": "BussrBee API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}