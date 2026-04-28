import sys
import os
import numpy as np

# Add parent directory to path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from Services.vector_store import VectorStore, VectorStoreConfig

# Mock embedding service to avoid dependency conflicts
class MockEmbeddingService:
    def generate_embedding(self, text: str):
        # Generate a random embedding vector (384 dimensions for all-MiniLM-L6-v2)
        return np.random.rand(384).tolist()
    
    def generate_embeddings(self, texts):
        return [self.generate_embedding(text) for text in texts]

def test_chroma_setup():
    """Test ChromaDB setup and basic operations"""
    
    # Initialize
    config = VectorStoreConfig(
        db_path="./test_chroma_db",
        collection_name="test_collection"
    )
    vector_store = VectorStore(config=config)
    embedding_service = MockEmbeddingService()
    
    print("✅ ChromaDB initialized")
    
    # Test adding documents
    test_chunks = [
        {
            "content": "This is a test legal document about contracts.",
            "metadata": {"filename": "test.pdf", "case_id": "TEST-001"}
        },
        {
            "content": "This document discusses property law.",
            "metadata": {"filename": "test2.pdf", "case_id": "TEST-001"}
        }
    ]
    
    texts = [chunk["content"] for chunk in test_chunks]
    embeddings = embedding_service.generate_embeddings(texts)
    
    ids = vector_store.add_documents(test_chunks, embeddings)
    print(f"✅ Added {len(ids)} documents")
    
    # Test search
    query = "What does the document say about contracts?"
    query_embedding = embedding_service.generate_embedding(query)
    results = vector_store.search(query_embedding, n_results=2)
    
    print(f"✅ Search returned {len(results['documents'][0])} results")
    print(f"   First result: {results['documents'][0][0][:100]}...")
    
    # Test stats
    info = vector_store.get_collection_info()
    print(f"✅ Collection info: {info}")
    
    # Cleanup
    vector_store.reset_collection()
    print("✅ Collection reset")
    
    print("\n🎉 All tests passed!")

if __name__ == "__main__":
    test_chroma_setup()