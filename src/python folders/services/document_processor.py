import os
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def process_pdf(self, file_path: str, metadata: Dict = None) -> List[Dict]:
        try:
            import PyPDF2
        except ImportError:
            logger.error("PyPDF2 not installed. Run: pip install PyPDF2")
            raise

        chunks = []
        text_content = ""

        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text_content += page.extract_text() + "\n"

        chunks = self._create_chunks(text_content, metadata)
        logger.info(f"Processed PDF: {len(chunks)} chunks created")
        return chunks

    def process_text(self, file_path: str, metadata: Dict = None) -> List[Dict]:
        with open(file_path, 'r', encoding='utf-8') as file:
            text_content = file.read()

        chunks = self._create_chunks(text_content, metadata)
        logger.info(f"Processed text file: {len(chunks)} chunks created")
        return chunks

    def process_docx(self, file_path: str, metadata: Dict = None) -> List[Dict]:
        try:
            import docx
        except ImportError:
            logger.error("python-docx not installed. Run: pip install python-docx")
            raise

        doc = docx.Document(file_path)
        text_content = "\n".join([paragraph.text for paragraph in doc.paragraphs])

        chunks = self._create_chunks(text_content, metadata)
        logger.info(f"Processed DOCX: {len(chunks)} chunks created")
        return chunks

    def _create_chunks(self, text: str, metadata: Dict = None) -> List[Dict]:
        if metadata is None:
            metadata = {}

        chunks = []
        start = 0
        chunk_id = 0

        while start < len(text):
            end = start + self.chunk_size
            chunk_text = text[start:end]

            if chunk_text.strip():
                chunk_metadata = {
                    **metadata,
                    "chunk_id": chunk_id,
                    "chunk_start": start,
                    "chunk_end": end
                }
                chunks.append({
                    "content": chunk_text,
                    "metadata": chunk_metadata
                })
                chunk_id += 1

            start = end - self.chunk_overlap

        return chunks

    def process_file(self, file_path: str, metadata: Dict = None) -> List[Dict]:
        file_ext = os.path.splitext(file_path)[1].lower()

        if file_ext == '.pdf':
            return self.process_pdf(file_path, metadata)
        elif file_ext == '.txt':
            return self.process_text(file_path, metadata)
        elif file_ext == '.docx':
            return self.process_docx(file_path, metadata)
        elif file_ext == '.md':
            return self.process_text(file_path, metadata)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")