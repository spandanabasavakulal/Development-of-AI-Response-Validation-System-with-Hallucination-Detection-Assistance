import io
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from ..rag import store
from ..schemas import SearchRequest, TextDocument

router = APIRouter(prefix="/api/knowledge", tags=["knowledge-base"])


def _read_upload(name: str, raw: bytes) -> str:
    if name.lower().endswith(".pdf"):
        try:
            from pypdf import PdfReader
        except ImportError:
            raise HTTPException(400, "PDF support needs: pip install pypdf")
        return "\n".join(p.extract_text() or "" for p in PdfReader(io.BytesIO(raw)).pages)
    return raw.decode("utf-8", errors="ignore")


@router.get("/documents")
def documents():
    return store.list_documents()


@router.post("/documents")
async def upload(file: UploadFile = File(...), corpus: str = Form("demo")):
    text = _read_upload(file.filename or "upload.txt", await file.read())
    try:
        return store.add_document(file.filename or "upload", corpus, text)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/documents/text")
def add_text(doc: TextDocument):
    return store.add_document(doc.name, doc.corpus, doc.text)


@router.delete("/documents/{doc_id}")
def delete(doc_id: int):
    if not store.delete_document(doc_id):
        raise HTTPException(404, "Document not found")
    return {"deleted": doc_id}


@router.get("/documents/{doc_id}/chunks")
def chunks(doc_id: int):
    return store.get_chunks(doc_id)


@router.post("/search")
def search(req: SearchRequest):
    return {"query": req.query, "results": store.search(req.query, req.top_k, req.corpus)}
