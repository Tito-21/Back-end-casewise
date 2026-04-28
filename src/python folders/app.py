import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from Routes.Documents import router as documents_router
from Routes.chat_router import router as chat_router

# Create FastAPI app
app = FastAPI(
    title="CaseWise Legal Document RAG System",
    description="RAG-based system for querying legal documents",
    version="1.0.0"
)

# Include routers
app.include_router(chat_router)
app.include_router(documents_router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "CaseWise Legal Document RAG System",
        "version": "1.0.0",
        "status": "running"
    }
@app.post("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
