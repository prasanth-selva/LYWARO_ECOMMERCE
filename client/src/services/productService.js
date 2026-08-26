import api from "./api";

const productService = {
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.set(key, value);
        }
      }
    });
    const query = searchParams.toString();
    return api.get(`/products${query ? `?${query}` : ""}`);
  },

  getProductById: (id) => api.get(`/products/${id}`),
  getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFeaturedProducts: () => api.get("/products/featured"),
  getBestsellers: () => api.get("/products/bestsellers"),
  getNewArrivals: () => api.get("/products/new-arrivals"),
  searchProducts: (q) => api.get(`/products/search?q=${encodeURIComponent(q)}`),

  // Admin
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productService;
