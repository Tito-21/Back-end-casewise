from fastapi import APIRouter, HTTPException
from ..services.chroma_manager import ChromaDBManager
from ..services.vector_store import VectorStore, VectorStoreConfig
from ..config import settings

router = APIRouter(prefix="/api/admin", tags=["admin"])

chroma_manager = ChromaDBManager(db_path=settings.CHROMA_DB_PATH)

@router.get("/collections")
async def list_collections():
    """List all collections"""
    return {"collections": chroma_manager.list_collections()}

@router.get("/collection/{name}/stats")
async def get_collection_stats(name: str):
    """Get collection statistics"""
    stats = chroma_manager.get_collection_stats(name)
    if not stats:
        raise HTTPException(status_code=404, detail="Collection not found")
    return stats

@router.post("/collection/{name}/export")
async def export_collection(name: str, output_path: str):
    """Export collection to file"""
    success = chroma_manager.export_collection(name, output_path)
    if not success:
        raise HTTPException(status_code=500, detail="Export failed")
    return {"message": f"Collection exported to {output_path}"}

@router.post("/collection/{name}/reset")
async def reset_collection(name: str):
    """Reset a collection (delete all documents)"""
    config = VectorStoreConfig(
        db_path=settings.CHROMA_DB_PATH,
        collection_name=name
    )
    vector_store = VectorStore(config=config)
    
    success = vector_store.reset_collection()
    if not success:
        raise HTTPException(status_code=500, detail="Reset failed")
    return {"message": f"Collection {name} has been reset"}

@router.get("/collection/{name}/info")
async def get_collection_info(name: str):
    """Get detailed collection information"""
    config = VectorStoreConfig(
        db_path=settings.CHROMA_DB_PATH,
        collection_name=name
    )
    vector_store = VectorStore(config=config)
    
    return vector_store.get_collection_info()