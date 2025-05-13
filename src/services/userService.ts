const API_URL = 'http://localhost:5000/api/users';

export async function getUser(id: string) {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const res = await fetch(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (res.status === 401) {
        throw new Error('Unauthorized: Please login again');
    }
    if (res.status === 404) {
        throw new Error('User not found');
    }
    if (!res.ok) {
        throw new Error('Failed to fetch user data');
    }

    return res.json();
}

export async function updateUser(id: string, data: { name: string; phone: string; address: string }) {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (res.status === 401) {
        throw new Error('Unauthorized: Please login again');
    }
    if (!res.ok) {
        throw new Error('Failed to update user data');
    }

    return res.json();
} 