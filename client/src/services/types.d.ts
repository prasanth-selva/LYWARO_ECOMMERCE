declare module "@/services/api" {
  const api: {
    get: (endpoint: string, options?: any) => Promise<any>;
    post: (endpoint: string, body?: any, options?: any) => Promise<any>;
    put: (endpoint: string, body?: any, options?: any) => Promise<any>;
    delete: (endpoint: string, options?: any) => Promise<any>;
  };
  export default api;
}

declare module "@/services/authService" {
  const authService: {
    register: (data: any) => Promise<any>;
    login: (data: any) => Promise<any>;
    logout: () => Promise<any>;
    getMe: () => Promise<any>;
    updateProfile: (data: any) => Promise<any>;
    changePassword: (data: any) => Promise<any>;
  };
  export default authService;
}

declare module "@/services/productService" {
  const productService: {
    getProducts: (params?: any) => Promise<any>;
    getProductById: (id: string) => Promise<any>;
    getProductBySlug: (slug: string) => Promise<any>;
    getFeaturedProducts: () => Promise<any>;
    getBestsellers: () => Promise<any>;
    getNewArrivals: () => Promise<any>;
    searchProducts: (q: string) => Promise<any>;
    createProduct: (data: any) => Promise<any>;
    updateProduct: (id: string, data: any) => Promise<any>;
    deleteProduct: (id: string) => Promise<any>;
  };
  export default productService;
}

declare module "@/services/cartService" {
  const cartService: {
    getCart: () => Promise<any>;
    addToCart: (data: any) => Promise<any>;
    updateItem: (itemId: string, quantity: number) => Promise<any>;
    removeItem: (itemId: string) => Promise<any>;
    clearCart: () => Promise<any>;
  };
  export default cartService;
}

declare module "@/services/wishlistService" {
  const wishlistService: {
    getWishlist: () => Promise<any>;
    addToWishlist: (productId: string) => Promise<any>;
    removeFromWishlist: (productId: string) => Promise<any>;
  };
  export default wishlistService;
}

declare module "@/services/orderService" {
  const orderService: {
    createOrder: (data: any) => Promise<any>;
    getUserOrders: () => Promise<any>;
    getOrderById: (id: string) => Promise<any>;
    trackOrder: (id: string) => Promise<any>;
    getAllOrders: (params?: any) => Promise<any>;
    updateOrderStatus: (id: string, status: string) => Promise<any>;
  };
  export default orderService;
}

declare module "@/services/paymentService" {
  const paymentService: {
    createOrder: (orderId: string) => Promise<any>;
    verifyPayment: (data: any) => Promise<any>;
  };
  export default paymentService;
}

declare module "@/services/userService" {
  const userService: {
    getAddresses: () => Promise<any>;
    addAddress: (data: any) => Promise<any>;
    updateAddress: (id: string, data: any) => Promise<any>;
    deleteAddress: (id: string) => Promise<any>;
  };
  export default userService;
}
