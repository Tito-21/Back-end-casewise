from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Keys
    GROQ_API_KEY: str
    
    # Model Configuration
    GROQ_MODEL: str = "mixtral-8x7b-32768"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # ChromaDB Configuration
    CHROMA_DB_PATH: str = "./chroma_db"
    COLLECTION_NAME: str = "legal_documents"
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:3000"
    
    # Chunking Configuration
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # Upload Configuration
    MAX_FILE_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: str = ".pdf,.docx,.pptx,.txt,.md"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @property
    def allowed_extensions_list(self) -> List[str]:
        return [ext.strip() for ext in self.ALLOWED_EXTENSIONS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs(settings.CHROMA_DB_PATH, exist_ok=True)