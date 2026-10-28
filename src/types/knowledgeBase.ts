export type DocumentStatus = 'Indexed' | 'Processing' | 'Failed' | 'Pending';

export interface DocumentChunk {
  id: string;
  chunkIndex: number;
  content: string;
  tokenCount: number;
  embeddingVectorPreview: number[]; // First few dimensions
}

export interface KBDocument {
  id: string;
  name: string;
  fileType: 'PDF' | 'TXT' | 'DOCX' | 'MD' | 'JSON';
  fileSizeBytes: number;
  uploadDate: string;
  status: DocumentStatus;
  chunkCount: number;
  indexStatus: 'FAISS Synchronized' | 'Indexing' | 'Out of Sync' | 'Failed';
  description: string;
  category: string;
  chunks?: DocumentChunk[];
}

export interface RetrievalQueryResult {
  chunkId: string;
  documentName: string;
  content: string;
  similarityScore: number; // 0.0 - 1.0 (Cosine similarity)
  tokenCount: number;
  isSimulated?: boolean;
}
