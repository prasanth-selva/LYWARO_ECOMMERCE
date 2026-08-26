import api from "./api";

const orderService = {
  createOrder: (data) => api.post("/orders", data),
  getUserOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`),
  trackOrder: (id) => api.get(`/orders/track/${id}`),

  // Admin
  getAllOrders: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });
    const query = searchParams.toString();
    return api.get(`/orders/admin/all${query ? `?${query}` : ""}`);
  },
  updateOrderStatus: (id, status) =>
    api.put(`/orders/admin/${id}/status`, { status }),
};

export default orderService;
