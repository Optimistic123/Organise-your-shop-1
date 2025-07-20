// Local storage service for offline functionality
class StorageService {
  constructor() {
    this.PRODUCTS_KEY = 'inventory_products';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.PRODUCTS_KEY)) {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify([]));
    }
  }

  getAllProducts() {
    try {
      const products = localStorage.getItem(this.PRODUCTS_KEY);
      return products ? JSON.parse(products) : [];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  saveProduct(product) {
    try {
      const products = this.getAllProducts();
      const productWithId = {
        ...product,
        id: product.id || Date.now().toString(),
        createdAt: product.createdAt || new Date().toISOString()
      };
      products.push(productWithId);
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
      return productWithId;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  updateProduct(productId, updatedProduct) {
    try {
      const products = this.getAllProducts();
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        return products[index];
      }
      throw new Error('Product not found');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  deleteProduct(productId) {
    try {
      const products = this.getAllProducts();
      const filteredProducts = products.filter(p => p.id !== productId);
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(filteredProducts));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  searchProducts(query) {
    const products = this.getAllProducts();
    if (!query) return products;
    
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterProducts(filters) {
    const products = this.getAllProducts();
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.color && product.color !== filters.color) return false;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (filters.minPrice && product.pricePerPiece < filters.minPrice) return false;
      if (filters.maxPrice && product.pricePerPiece > filters.maxPrice) return false;
      return true;
    });
  }

  clearAllProducts() {
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify([]));
  }

  getStorageStats() {
    try {
      const products = this.getAllProducts();
      const totalSize = JSON.stringify(products).length;
      return {
        totalProducts: products.length,
        storageSize: `${(totalSize / 1024).toFixed(2)} KB`
      };
    } catch (error) {
      return { totalProducts: 0, storageSize: '0 KB' };
    }
  }
}

export const storageService = new StorageService();