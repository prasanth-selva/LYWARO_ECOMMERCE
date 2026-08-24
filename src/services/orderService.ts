import { Order, OrderStatus } from '../types';
import { mockOrders } from '../data/products';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getOrders(): Promise<Order[]> {
  await delay(300);
  return [...mockOrders];
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await delay(200);
  return mockOrders.find(o => o.id === id);
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  await delay(200);
  return mockOrders.find(o => o.orderNumber === orderNumber);
}

export async function getOrderTracking(orderId: string): Promise<{ status: OrderStatus; timeline: { status: OrderStatus; date: Date; location?: string }[] } | undefined> {
  await delay(200);
  const order = mockOrders.find(o => o.id === orderId);
  return order?.tracking;
}
