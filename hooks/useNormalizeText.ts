//sales_router_frontend/hooks/useNormalizeText.ts

export function useNormalizeText() {
  function normalize(value?: string) {
    if (!value) return value;

    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();
  }

  return { normalize };
}
