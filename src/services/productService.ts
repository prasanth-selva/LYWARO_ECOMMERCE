import { Product, FilterState, SortOption } from '../types';
import { products } from '../data/products';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(filters?: Partial<FilterState>): Promise<Product[]> {
  await delay(300);
  let result = [...products];
  
  if (filters) {
    if (filters.category?.length) {
      result = result.filter(p => filters.category!.includes(p.category));
    }
    if (filters.gender?.length) {
      result = result.filter(p => filters.gender!.includes(p.gender));
    }
    if (filters.size?.length) {
      result = result.filter(p => p.sizes.some(s => filters.size!.includes(s)));
    }
    if (filters.color?.length) {
      result = result.filter(p => p.colors.some(c => filters.color!.includes(c.name)));
    }
    if (filters.priceRange) {
      result = result.filter(p => 
        p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }
    if (filters.availability === 'in-stock') {
      result = result.filter(p => p.stock > 0);
    }
    if (filters.availability === 'out-of-stock') {
      result = result.filter(p => p.stock === 0);
    }
    if (filters.sortBy) {
      result = sortProducts(result, filters.sortBy);
    }
  }
  
  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await delay(200);
  return products.find(p => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay(200);
  return products.find(p => p.id === id);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(300);
  return products.filter(p => p.badge);
}

export async function getNewArrivals(): Promise<Product[]> {
  await delay(300);
  return products.slice(0, 3);
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(200);
  const q = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

function sortProducts(items: Product[], sortBy: SortOption): Product[] {
  switch (sortBy) {
    case 'newest':
      return items.reverse();
    case 'best-selling':
      return [...items].sort((a, b) => b.reviewCount - a.reviewCount);
    case 'price-low':
      return [...items].sort((a, b) => a.price - b.price);
    case 'price-high':
      return [...items].sort((a, b) => b.price - a.price);
    case 'featured':
    default:
      return items;
  }
}
