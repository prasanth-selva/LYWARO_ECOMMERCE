import { User } from '../types';
import { mockUser } from '../data/products';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(email: string, password: string): Promise<User> {
  await delay(500);
  // Mock: always succeeds
  return mockUser;
}

export async function register(name: string, email: string, password: string): Promise<User> {
  await delay(500);
  return { ...mockUser, name, email };
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(200);
  return mockUser;
}

export async function logout(): Promise<void> {
  await delay(200);
}
