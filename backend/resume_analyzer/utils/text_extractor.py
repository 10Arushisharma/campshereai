"""
CAMSPHER-AI Resume Analyzer
Text Extraction Module - Extracts text from PDF and DOCX resumes
"""

import io
import re
from typing import Optional

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False

try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False

try:
    from docx import Document
    PYTHON_DOCX_AVAILABLE = True
except ImportError:
    PYTHON_DOCX_AVAILABLE = False


class TextExtractor:
    """Extracts and cleans text from resume files (PDF, DOCX)."""

    def __init__(self):
        self.supported_formats = ['.pdf', '.docx', '.doc']

    def extract(self, file_content: bytes, filename: str) -> str:
        """
        Extract text from file content based on file extension.

        Args:
            file_content: Raw bytes of the file
            filename: Name of the file with extension

        Returns:
            Cleaned extracted text
        """
        filename_lower = filename.lower()

        if filename_lower.endswith('.pdf'):
            return self._extract_pdf(file_content)
        elif filename_lower.endswith(('.docx', '.doc')):
            return self._extract_docx(file_content)
        else:
            raise ValueError(f"Unsupported file format. Supported: {self.supported_formats}")

    def _extract_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF using pdfplumber (preferred) or PyPDF2."""
        text = ""

        # Try pdfplumber first (better extraction quality)
        if PDFPLUMBER_AVAILABLE:
            try:
                with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n\n"
            except Exception:
                text = ""  # Reset and try fallback

        # Fallback to PyPDF2
        if not text.strip() and PYPDF2_AVAILABLE:
            try:
                reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
            except Exception:
                pass

        if not text.strip():
            raise RuntimeError("Failed to extract text from PDF. Please ensure the PDF is not scanned/image-based.")

        return self._clean_text(text)

    def _extract_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file."""
        if not PYTHON_DOCX_AVAILABLE:
            raise RuntimeError("python-docx not installed. Install with: pip install python-docx")

        try:
            doc = Document(io.BytesIO(file_content))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            text = "\n\n".join(paragraphs)
            return self._clean_text(text)
        except Exception as e:
            raise RuntimeError(f"Failed to extract text from DOCX: {str(e)}")

    def _clean_text(self, text: str) -> str:
        """Clean extracted text by removing extra whitespace, special chars, etc."""
        # Remove null bytes
        text = text.replace('\x00', '')
        # Replace multiple newlines with double newline
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Replace multiple spaces with single space
        text = re.sub(r' {2,}', ' ', text)
        # Remove non-printable characters except newlines
        text = ''.join(char for char in text if char.isprintable() or char in '\n\t')
        # Strip whitespace from each line
        lines = [line.strip() for line in text.split('\n')]
        text = '\n'.join(lines)
        # Final strip
        return text.strip()

    def extract_from_text(self, text: str) -> str:
        """Clean raw pasted text (for direct text input)."""
        return self._clean_text(text)


def extract_text(file_content: bytes, filename: str) -> str:
    """Convenience function for text extraction."""
    extractor = TextExtractor()
    return extractor.extract(file_content, filename)
