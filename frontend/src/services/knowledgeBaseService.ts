import { KBDocument, RetrievalQueryResult } from '../types/knowledgeBase';
import { INITIAL_DOCUMENTS } from '../data/mockKnowledgeBase';

const KB_STORAGE_KEY = 'ai_eval_kb_docs_v1';

const getStoredDocuments = (): KBDocument[] => {
  try {
    const raw = localStorage.getItem(KB_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DOCUMENTS;
  }
};

const saveStoredDocuments = (docs: KBDocument[]) => {
  try {
    localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.error('Failed to save KB docs in localStorage', err);
  }
};

export const knowledgeBaseService = {
  getAll: async (): Promise<KBDocument[]> => {
    return getStoredDocuments();
  },

  addDocument: async (
    name: string,
    fileType: 'PDF' | 'TXT' | 'DOCX' | 'MD' | 'JSON',
    fileSizeBytes: number,
    contentPreview?: string
  ): Promise<KBDocument> => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newId = `DOC-${Math.floor(100 + Math.random() * 900)}`;

    const simulatedChunks = [
      {
        id: `CHUNK-${newId}-1`,
        chunkIndex: 1,
        content: contentPreview 
          ? contentPreview.slice(0, 180) 
          : `Extracted passage 1 from ${name}: Overview of specifications, core functional assumptions, and technical parameters for evaluation grounding.`,
        tokenCount: 42,
        embeddingVectorPreview: [0.035, -0.082, 0.284, 0.119, -0.045]
      },
      {
        id: `CHUNK-${newId}-2`,
        chunkIndex: 2,
        content: `Extracted passage 2 from ${name}: Operational constraints, edge case behaviors, and verified reference values for evaluation comparison.`,
        tokenCount: 38,
        embeddingVectorPreview: [0.051, -0.064, 0.312, 0.098, -0.021]
      }
    ];

    const newDoc: KBDocument = {
      id: newId,
      name,
      fileType,
      fileSizeBytes,
      uploadDate: dateStr,
      status: 'Indexed',
      chunkCount: simulatedChunks.length,
      indexStatus: 'FAISS Synchronized',
      description: `Uploaded reference document: ${name}`,
      category: 'Uploaded Reference',
      chunks: simulatedChunks
    };

    const current = getStoredDocuments();
    saveStoredDocuments([newDoc, ...current]);
    return newDoc;
  },

  deleteDocument: async (id: string): Promise<boolean> => {
    const current = getStoredDocuments();
    const filtered = current.filter(d => d.id !== id);
    saveStoredDocuments(filtered);
    return true;
  },

  reindexDocument: async (id: string): Promise<KBDocument | null> => {
    const current = getStoredDocuments();
    const doc = current.find(d => d.id === id);
    if (!doc) return null;
    doc.indexStatus = 'FAISS Synchronized';
    doc.status = 'Indexed';
    saveStoredDocuments(current);
    return doc;
  },

  testRetrieval: async (query: string): Promise<RetrievalQueryResult[]> => {
    const docs = getStoredDocuments();
    const results: RetrievalQueryResult[] = [];
    const qLower = query.toLowerCase();

    // Query across all chunks
    docs.forEach(doc => {
      if (doc.chunks && doc.chunks.length > 0) {
        doc.chunks.forEach(chunk => {
          const contentLower = chunk.content.toLowerCase();
          // Calculate realistic semantic overlap score
          let score = 0.55;
          const words = qLower.split(/\s+/).filter(w => w.length > 3);
          let matchCount = 0;
          words.forEach(w => {
            if (contentLower.includes(w)) matchCount++;
          });

          if (words.length > 0) {
            score = Math.min(0.96, 0.50 + (matchCount / words.length) * 0.45);
          }

          results.push({
            chunkId: chunk.id,
            documentName: doc.name,
            content: chunk.content,
            similarityScore: Number(score.toFixed(3)),
            tokenCount: chunk.tokenCount,
            isSimulated: true
          });
        });
      }
    });

    // Sort by highest similarity
    return results.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 4);
  }
};
