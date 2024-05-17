import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_DB_URL,
    timeout: 10000,
    headers: {
        "Access-Control-Allow-Origin": '*',
    },
    // withCredentials: true, // Include cookies in requests and responses
});

const getAllProduct = async () => {
    try {
        const resp = await instance.get('/product/');
        return resp.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { error: 'Server error' };
    }
}

const createProduct = async (data: FormData) => {
    try {
        const resp = await instance.post('/product/', data);
        return resp.data;
    } catch (error) {
        console.error('Error creating product:', error);
        return { error: 'Server error' };
    }
}

const updateProduct = async (id: string, data: FormData) => {
    try {
        const resp = await instance.put(`/product/${id}`, data);
        return resp.data;
    } catch (error) {
        console.error('Error updating product:', error);
        return { error: 'Server error' };
    }
}

const deleteProduct = async (id: string) => {
    try {
        const resp = await instance.delete(`/product/${id}`);
        return resp.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        return { error: 'Server error' };
    }
}

export {
    getAllProduct,
    createProduct,
    updateProduct,
    deleteProduct
}
