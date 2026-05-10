import { apiFetch } from "./index";
import type {
  ApiCategory,
  ApiCompany,
  ApiCompanyDetail,
  ApiProduct,
  ApiProductDetail,
  ApiProductsResponse,
  ApiReview,
} from "./types";

export async function getProducts(
  params?: Record<string, string>,
): Promise<ApiProductsResponse | null> {
  const query = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  return apiFetch<ApiProductsResponse>(`/api/marketplace/products${query}`);
}

export async function getProductById(
  productId: string,
): Promise<ApiProductDetail | null> {
  return apiFetch<ApiProductDetail>(
    `/api/marketplace/products/${productId}`,
  );
}

export async function getProductReviews(
  productId: string,
): Promise<ApiReview[] | null> {
  return apiFetch<ApiReview[]>(
    `/api/marketplace/products/${productId}/reviews`,
  );
}

export async function getCategories(): Promise<ApiCategory[] | null> {
  return apiFetch<ApiCategory[]>("/api/marketplace/categories");
}

export async function getCategoryProducts(
  categoryId: string,
): Promise<ApiProductsResponse | null> {
  return apiFetch<ApiProductsResponse>(
    `/api/marketplace/categories/${categoryId}/products`,
  );
}

export async function getCompanies(): Promise<ApiCompany[] | null> {
  return apiFetch<ApiCompany[]>("/api/marketplace/companies");
}

export async function getCompanyById(
  companyId: string,
): Promise<ApiCompanyDetail | null> {
  return apiFetch<ApiCompanyDetail>(
    `/api/marketplace/companies/${companyId}`,
  );
}

export async function getCompanyProducts(
  companyId: string,
): Promise<ApiProductsResponse | null> {
  return apiFetch<ApiProductsResponse>(
    `/api/marketplace/companies/${companyId}/products`,
  );
}

export { type ApiProduct };
