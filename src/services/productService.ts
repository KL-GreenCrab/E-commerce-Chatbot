// Sử dụng URL tương đối để tận dụng proxy trong vite.config.ts
const API_URL = '/api/products';

export async function fetchProducts(params = {}) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_URL}?${query}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function fetchProductById(id: string) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}