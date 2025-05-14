const API_URL = 'http://localhost:5000/api/products/metadata/categories';

export async function fetchCategories() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}