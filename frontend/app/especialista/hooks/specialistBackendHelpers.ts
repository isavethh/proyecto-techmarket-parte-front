type BackendListContainer<T> = {
  value?: T[];
  data?: T[] | BackendListContainer<T>;
  items?: T[];
  results?: T[];
  records?: T[];
  content?: T[];
};

export type DatasetSource = "backend" | "empty" | "fallback";

export function normalizeBackendList<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const container = response as BackendListContainer<T>;
  const directList = container.value ?? container.items ?? container.results ?? container.records ?? container.content;

  if (Array.isArray(directList)) {
    return directList;
  }

  if (Array.isArray(container.data)) {
    return container.data;
  }

  if (container.data && typeof container.data === "object") {
    return normalizeBackendList<T>(container.data);
  }

  return [];
}

export function getDatasetSource<T>(items: T[], fallback = false): DatasetSource {
  if (fallback) {
    return "fallback";
  }

  return items.length > 0 ? "backend" : "empty";
}

export function debugSpecialistResult(label: string, result: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.debug(label, result);
  }
}
