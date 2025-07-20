// Mock data for frontend demonstration
export const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    color: 'Black',
    weight: '250g',
    size: 'Medium',
    brand: 'TechBrand',
    category: 'Electronics',
    pricePerPiece: 99.99,
    pricePerWeight: 399.96,
    image: 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" fill="%23374151" viewBox="0 0 24 24"%3e%3cpath d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3e%3c/svg%3e',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Organic Coffee Beans',
    color: 'Brown',
    weight: '500g',
    size: 'Large',
    brand: 'BrewMaster',
    category: 'Food & Beverage',
    pricePerPiece: 24.99,
    pricePerWeight: 49.98,
    image: 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" fill="%236b7280" viewBox="0 0 24 24"%3e%3cpath d="M18.5 3H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12.5c1.38 0 2.5-1.12 2.5-2.5v-13C21 4.12 19.88 3 18.5 3zM16 19H6V5h10v14z"/%3e%3c/svg%3e',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    color: 'White',
    weight: '180g',
    size: 'Large',
    brand: 'ComfortWear',
    category: 'Clothing',
    pricePerPiece: 19.99,
    pricePerWeight: 111.06,
    image: 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" fill="%239ca3af" viewBox="0 0 24 24"%3e%3cpath d="M16 4l1.94 2.06 2.06-2.06L16 4zm-8 0L4 8l4 4 8-8-8-8zm8 8l4 4v8H4v-8l4-4 8 8z"/%3e%3c/svg%3e',
    createdAt: new Date().toISOString(),
  }
];

export const categories = [
  'Electronics',
  'Clothing',
  'Food & Beverage',
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Others'
];

export const colors = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',
  'Brown',
  'Gray',
  'Others'
];