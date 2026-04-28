from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from groq import Groq
from config import settings
from services.embeddings import EmbeddingService
from services.vector_store import VectorStore, VectorStoreConfig

router = APIRouter(prefix="/api/chat")

# Initialize services
vector_store_config = VectorStoreConfig(
    db_path=settings.CHROMA_DB_PATH,
    collection_name=settings.COLLECTION_NAME
)
vector_store = VectorStore(config=vector_store_config)
embedding_service = EmbeddingService(model_name=settings.EMBEDDING_MODEL)
groq_client = Groq(api_key=settings.GROQ_API_KEY)

class ChatRequest(BaseModel):
    message: str
    case_id: Optional[str] = None
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[dict] = []
    conversation_id: str

@router.post("/query", response_model=ChatResponse)
async def chat_query(request: ChatRequest):
    """Query the RAG system with a question"""
    try:
        # Generate embedding for the query
        query_embedding = embedding_service.generate_embedding(request.message)
        
        # Search for relevant documents
        search_results = vector_store.search(
            query_embedding=query_embedding,
            n_results=settings.DEFAULT_SEARCH_RESULTS,
            case_id=request.case_id,
            min_score=settings.MIN_SIMILARITY_SCORE
        )
        
        # Extract relevant context
        context = ""
        sources = []
        if search_results.get('documents') and search_results['documents'][0]:
            for doc, metadata in zip(search_results['documents'][0], search_results['metadatas'][0]):
                context += doc + "\n\n"
                sources.append({
                    "content": doc[:200],
                    "metadata": metadata
                })
        
        # Build prompt with context
        system_prompt = """You are a legal assistant helping with case-related questions. 
Use the provided context to answer questions accurately. If the context doesn't contain 
relevant information, say so. Always cite your sources."""
        
        user_message = f"Context:\n{context}\n\nQuestion: {request.message}"
        
        # Call Groq API
        completion = groq_client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1024
        )
        
        response_text = completion.choices[0].message.content
        
        return ChatResponse(
            response=response_text,
            sources=sources,
            conversation_id=request.conversation_id or "new"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
