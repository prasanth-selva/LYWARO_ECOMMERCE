import api from "./api";

const paymentService = {
  createOrder: (orderId) => api.post("/payment/create-order", { orderId }),
  verifyPayment: (data) => api.post("/payment/verify", data),
};

export default paymentService;
