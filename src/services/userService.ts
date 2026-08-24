import { User, Address } from '../types';
import { mockUser } from '../data/products';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getUser(): Promise<User> {
  await delay(200);
  return { ...mockUser };
}

export async function updateProfile(updates: Partial<User>): Promise<User> {
  await delay(300);
  return { ...mockUser, ...updates };
}

export async function addAddress(address: Omit<Address, 'id'>): Promise<Address> {
  await delay(300);
  return { ...address, id: `addr-${Date.now()}` };
}

export async function updateAddress(id: string, updates: Partial<Address>): Promise<Address> {
  await delay(300);
  const existing = mockUser.addresses.find(a => a.id === id);
  return { ...existing!, ...updates };
}

export async function deleteAddress(id: string): Promise<void> {
  await delay(200);
}
