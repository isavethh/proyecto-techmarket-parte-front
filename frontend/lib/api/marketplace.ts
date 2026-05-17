import { getToken } from "@/lib/auth/tokenStore";
import type {
  ApiProduct,
  ApiProductDetail,
  ApiProductsResponse,
  ApiCategory,
  ApiCompany,
  ApiCompanyDetail,
  ApiReview,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path: string): string {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_URL no está configurada.");
  return new URL(path, API_BASE_URL).toString();
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json() as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch { /* ignore parse error */ }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ─── Productos ────────────────────────────────────────────────────────────────

export async function getProducts(params?: { search?: string; category?: string; pagina?: number }): Promise<ApiProductsResponse> {
  const url = new URL(buildUrl("/api/marketplace/products"));
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.pagina) url.searchParams.set("pagina", String(params.pagina));
  const res = await fetch(url.toString(), { headers: authHeaders() });
  return handleResponse<ApiProductsResponse>(res);
}

export async function getProduct(productId: string): Promise<ApiProductDetail> {
  const res = await fetch(buildUrl(`/api/marketplace/products/${productId}`), { headers: authHeaders() });
  return handleResponse<ApiProductDetail>(res);
}

export async function getProductReviews(productId: string): Promise<ApiReview[]> {
  const res = await fetch(buildUrl(`/api/marketplace/products/${productId}/reviews`), { headers: authHeaders() });
  return handleResponse<ApiReview[]>(res);
}

// ─── Categorías ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<ApiCategory[]> {
  const res = await fetch(buildUrl("/api/marketplace/categories"), { headers: authHeaders() });
  return handleResponse<ApiCategory[]>(res);
}

export async function getCategoryProducts(categoryId: string, params?: { search?: string; pagina?: number }): Promise<ApiProductsResponse> {
  const url = new URL(buildUrl(`/api/marketplace/categories/${categoryId}/products`));
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.pagina) url.searchParams.set("pagina", String(params.pagina));
  const res = await fetch(url.toString(), { headers: authHeaders() });
  return handleResponse<ApiProductsResponse>(res);
}

// ─── Empresas ─────────────────────────────────────────────────────────────────

export async function getCompanies(): Promise<ApiCompany[]> {
  const res = await fetch(buildUrl("/api/marketplace/companies"), { headers: authHeaders() });
  return handleResponse<ApiCompany[]>(res);
}

export async function getCompany(companyId: string): Promise<ApiCompanyDetail> {
  const res = await fetch(buildUrl(`/api/marketplace/companies/${companyId}`), { headers: authHeaders() });
  return handleResponse<ApiCompanyDetail>(res);
}

export async function getCompanyProducts(companyId: string, params?: { pagina?: number }): Promise<ApiProductsResponse> {
  const url = new URL(buildUrl(`/api/marketplace/companies/${companyId}/products`));
  if (params?.pagina) url.searchParams.set("pagina", String(params.pagina));
  const res = await fetch(url.toString(), { headers: authHeaders() });
  return handleResponse<ApiProductsResponse>(res);
}
