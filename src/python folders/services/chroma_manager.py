import chromadb
from chromadb.config import Settings
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class ChromaDBManager:
    """Advanced ChromaDB management utilities"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.client = chromadb.PersistentClient(
            path=db_path,
            settings=Settings(anonymized_telemetry=False)
        )
    
    def list_collections(self) -> List[str]:
        """List all collections in the database"""
        collections = self.client.list_collections()
        return [col.name for col in collections]
    
    def create_collection(
        self, 
        name: str, 
        metadata: Optional[Dict] = None,
        distance_metric: str = "cosine"
    ) -> bool:
        """Create a new collection"""
        try:
            self.client.create_collection(
                name=name,
                metadata=metadata or {},
            )
            logger.info(f"Created collection: {name}")
            return True
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
            return False
    
    def delete_collection(self, name: str) -> bool:
        """Delete a collection"""
        try:
            self.client.delete_collection(name=name)
            logger.info(f"Deleted collection: {name}")
            return True
        except Exception as e:
            logger.error(f"Error deleting collection: {e}")
            return False
    
    def get_collection_stats(self, name: str) -> Dict:
        """Get statistics for a collection"""
        try:
            collection = self.client.get_collection(name=name)
            return {
                "name": collection.name,
                "count": collection.count(),
                "metadata": collection.metadata
            }
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return {}
    
    def export_collection(self, name: str, output_path: str) -> bool:
        """Export collection to JSON"""
        try:
            collection = self.client.get_collection(name=name)
            data = collection.get()
            
            import json
            with open(output_path, 'w') as f:
                json.dump(data, f, indent=2)
            
            logger.info(f"Exported {name} to {output_path}")
            return True
        except Exception as e:
            logger.error(f"Error exporting collection: {e}")
            return False
    
    def import_collection(
        self, 
        name: str, 
        input_path: str,
        create_if_not_exists: bool = True
    ) -> bool:
        """Import collection from JSON"""
        try:
            import json
            with open(input_path, 'r') as f:
                data = json.load(f)
            
            # Get or create collection
            try:
                collection = self.client.get_collection(name=name)
            except:
                if create_if_not_exists:
                    collection = self.client.create_collection(name=name)
                else:
                    raise
            
            # Add data
            if data.get('ids'):
                collection.add(
                    ids=data['ids'],
                    documents=data.get('documents', []),
                    metadatas=data.get('metadatas', []),
                    embeddings=data.get('embeddings', [])
                )
            
            logger.info(f"Imported data to {name}")
            return True
        except Exception as e:
            logger.error(f"Error importing collection: {e}")
            return False