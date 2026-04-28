import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from Services.vector_store import VectorStore, VectorStoreConfig
import numpy as np

# Mock embedding service
class MockEmbeddingService:
    def generate_embedding(self, text: str):
        return np.random.rand(384).tolist()

def test_search():
    """Test searching the uploaded document"""
    
    print("🔍 Testing search functionality...")
    
    # Initialize vector store
    config = VectorStoreConfig(
        db_path="./chroma_db",
        collection_name="legal_documents"
    )
    vector_store = VectorStore(config=config)
    
    # Get collection info
    info = vector_store.get_collection_info()
    print(f"\n📊 Current Collection:")
    print(f"   Name: {info['name']}")
    print(f"   Total documents: {info['count']}")
    print(f"   Unique files: {info['unique_documents']}")
    
    # List documents
    documents = vector_store.list_documents()
    print(f"\n📄 Documents in database:")
    for doc in documents:
        print(f"   - {doc['filename']}")
        print(f"     Case ID: {doc['case_id']}")
        print(f"     Chunks: {doc['chunk_count']}")
    
    # Test search
    print(f"\n🔎 Searching for relevant documents...")
    embedding_service = MockEmbeddingService()
    query_embedding = embedding_service.generate_embedding("penal code criminal law")
    
    results = vector_store.search(
        query_embedding=query_embedding,
        n_results=3,
        min_score=0.0
    )
    
    if results['documents'] and results['documents'][0]:
        print(f"\n✅ Found {len(results['documents'][0])} results:")
        for i, (doc, meta, dist) in enumerate(zip(
            results['documents'][0],
            results['metadatas'][0],
            results['distances'][0]
        )):
            print(f"\n   Result {i+1}:")
            print(f"   Content: {doc[:150]}...")
            print(f"   Filename: {meta.get('filename')}")
            print(f"   Distance: {dist:.4f}")
    else:
        print("❌ No results found")
    
    print("\n✅ Search test complete!")

if __name__ == "__main__":
    test_search()
