from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Optional
import os
import uuid
from datetime import datetime
from config import settings
from services.document_processor import DocumentProcessor
from services.embeddings import EmbeddingService
from services.vector_store import VectorStore, VectorStoreConfig
from models.schemas import DocumentResponse

router = APIRouter(prefix="/api/documents")

# Initialize services with configuration
vector_store_config = VectorStoreConfig(
    db_path=settings.CHROMA_DB_PATH,
    collection_name=settings.COLLECTION_NAME,
    distance_metric=settings.CHROMA_DISTANCE_METRIC,
    anonymized_telemetry=settings.CHROMA_ANONYMIZED_TELEMETRY,
    allow_reset=settings.CHROMA_ALLOW_RESET,
    max_batch_size=settings.CHROMA_MAX_BATCH_SIZE
)

vector_store = VectorStore(config=vector_store_config)
doc_processor = DocumentProcessor(
    chunk_size=settings.CHUNK_SIZE,
    chunk_overlap=settings.CHUNK_OVERLAP
)
embedding_service = EmbeddingService(model_name=settings.EMBEDDING_MODEL)

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx", ".md"}
UPLOAD_DIR = getattr(settings, "UPLOAD_DIR", "uploads")


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile, case_id: str):
    # ------------------------------------------------------------------ #
    # 1. Validate file extension                                           #
    # ------------------------------------------------------------------ #
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file_ext}'. "
                   f"Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # ------------------------------------------------------------------ #
    # 2. Save uploaded file                                                #
    # ------------------------------------------------------------------ #
    document_id = str(uuid.uuid4())
    case_upload_dir = os.path.join(UPLOAD_DIR, case_id)
    os.makedirs(case_upload_dir, exist_ok=True)

    safe_filename = f"{document_id}{file_ext}"
    file_path = os.path.join(case_upload_dir, safe_filename)

    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save uploaded file: {str(e)}"
        )

    # ------------------------------------------------------------------ #
    # 3. Chunk the document                                                #
    # ------------------------------------------------------------------ #
    try:
        metadata = {
            "document_id": document_id,
            "case_id": case_id,
            "filename": file.filename,
            "uploaded_at": datetime.utcnow().isoformat()
        }
        chunks = doc_processor.process_file(file_path, metadata=metadata)
    except Exception as e:
        _cleanup_file(file_path)
        raise HTTPException(
            status_code=422,
            detail=f"Document processing failed: {str(e)}"
        )

    if not chunks:
        _cleanup_file(file_path)
        raise HTTPException(
            status_code=422,
            detail="Document produced no processable content after chunking."
        )

    # ------------------------------------------------------------------ #
    # 4. Generate embeddings                                               #
    # ------------------------------------------------------------------ #
    try:
        chunk_texts = [chunk["content"] for chunk in chunks]
        embeddings = embedding_service.generate_embeddings(chunk_texts)
    except Exception as e:
        _cleanup_file(file_path)
        raise HTTPException(
            status_code=500,
            detail=f"Embedding generation failed: {str(e)}"
        )

    # ------------------------------------------------------------------ #
    # 5. Persist to ChromaDB                                               #
    # ------------------------------------------------------------------ #
    try:
        # add_documents handles IDs and metadata internally
        vector_store.add_documents(
            chunks=chunks,
            embeddings=embeddings
        )
    except Exception as e:
        _cleanup_file(file_path)
        raise HTTPException(
            status_code=500,
            detail=f"Vector store insertion failed: {str(e)}"
        )

    # ------------------------------------------------------------------ #
    # 6. Return response                                                   #
    # ------------------------------------------------------------------ #
    return DocumentResponse(
        document_id=document_id,
        case_id=case_id,
        filename=file.filename,
        chunk_count=len(chunks),
        status="indexed",
        uploaded_at=datetime.utcnow().isoformat(),
        message=f"Document successfully processed and indexed into {len(chunks)} chunks."
    )


def _cleanup_file(path: str) -> None:
    try:
        if os.path.exists(path):
            os.remove(path)
    except OSError:
        pass