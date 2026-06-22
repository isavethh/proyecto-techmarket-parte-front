import { apiPost } from "@/lib/api/apiClient";

/** A semantic-search hit from the marketplace RAG index (TechMarket-AI). */
export type MarketplaceHit = {
  id: string;
  type: string; // "empresa" | "especialista"
  title: string;
  ownerName: string | null;
  score: number;
};

// La busqueda semantica vive en TechMarket-AI (8091), no en TechMarket-IA.
const AI = { service: "ai" } as const;

/**
 * Busqueda en lenguaje natural sobre el catalogo: devuelve empresas/especialistas por SIGNIFICADO
 * (embeddings + pgvector), no por keyword. Ej.: "alguien que repare placas y configure redes".
 */
export function searchMarketplaceSemantic(query: string, topK = 8): Promise<MarketplaceHit[]> {
  return apiPost<MarketplaceHit[]>("/api/v1/ai/marketplace/buscar", { query, topK }, AI);
}
