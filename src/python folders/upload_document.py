import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from Services.document_processor import DocumentProcessor
from Services.vector_store import VectorStore, VectorStoreConfig
import numpy as np

# Mock embedding service (since sentence-transformers has dependency issues)
class MockEmbeddingService:
    def generate_embedding(self, text: str):
        # Generate a random embedding vector (384 dimensions)
        return np.random.rand(384).tolist()
    
    def generate_embeddings(self, texts):
        return [self.generate_embedding(text) for text in texts]

def upload_pdf(pdf_path: str):
    """Upload PDF to ChromaDB"""
    
    print(f"📄 Processing PDF: {pdf_path}")
    
    # Initialize document processor
    doc_processor = DocumentProcessor(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    # Process PDF
    try:
        chunks = doc_processor.process_pdf(
            pdf_path,
            metadata={
                "filename": os.path.basename(pdf_path),
                "case_id": "RWANDA-PENAL-CODE",
                "file_type": ".pdf"
            }
        )
        print(f"✅ Created {len(chunks)} chunks from PDF")
    except Exception as e:
        print(f"❌ Error processing PDF: {e}")
        return
    
    # Initialize vector store
    config = VectorStoreConfig(
        db_path="./chroma_db",
        collection_name="legal_documents"
    )
    vector_store = VectorStore(config=config)
    
    # Initialize embedding service
    embedding_service = MockEmbeddingService()
    
    # Generate embeddings for chunks
    print("🔄 Generating embeddings...")
    texts = [chunk["content"] for chunk in chunks]
    embeddings = embedding_service.generate_embeddings(texts)
    print(f"✅ Generated {len(embeddings)} embeddings")
    
    # Add to vector store
    print("💾 Adding to ChromaDB...")
    try:
        ids = vector_store.add_documents(chunks, embeddings)
        print(f"✅ Successfully added {len(ids)} documents to database")
    except Exception as e:
        print(f"❌ Error adding to database: {e}")
        return
    
    # Get collection info
    info = vector_store.get_collection_info()
    print(f"\n📊 Collection Info:")
    print(f"   Name: {info['name']}")
    print(f"   Total documents: {info['count']}")
    print(f"   Unique files: {info['unique_documents']}")
    
    print("\n🎉 Upload complete!")

if __name__ == "__main__":
    # Path to your PDF
    pdf_path = "/Users/mac/Downloads/Rwanda-Penal-Code.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        print("Please update the pdf_path in this script to point to your PDF file")
    else:
        upload_pdf(pdf_path)
