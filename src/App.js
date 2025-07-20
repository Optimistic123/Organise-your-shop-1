import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Package2, Wifi, WifiOff } from 'lucide-react';
import './App.css';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import ProductCard from './components/ProductCard';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import SearchAndFilter from './components/SearchAndFilter';
import ViewToggle from './components/ViewToggle';
import { storageService } from './services/storageService';
import { mockProducts } from './services/mockData';

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    brand: '',
    minPrice: '',
    maxPrice: ''
  });
  const [currentView, setCurrentView] = useState('grid');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Initialize PWA features
  useEffect(() => {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load products on app start
  useEffect(() => {
    const loadProducts = () => {
      setIsLoading(true);
      try {
        const storedProducts = storageService.getAllProducts();
        
        // If no products stored, initialize with mock data for demo
        if (storedProducts.length === 0) {
          mockProducts.forEach(product => {
            storageService.saveProduct(product);
          });
          setProducts(mockProducts);
          toast({
            title: "Welcome!",
            description: "Demo products loaded. Start adding your own products!",
          });
        } else {
          setProducts(storedProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    if (filters.color) {
      filtered = filtered.filter(product => product.color === filters.color);
    }
    if (filters.brand) {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.pricePerPiece >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.pricePerPiece <= parseFloat(filters.maxPrice));
    }

    return filtered;
  }, [products, searchQuery, filters]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = storageService.updateProduct(editingProduct.id, productData);
        setProducts(prev => 
          prev.map(p => p.id === editingProduct.id ? updatedProduct : p)
        );
      } else {
        // Add new product
        const newProduct = storageService.saveProduct(productData);
        setProducts(prev => [newProduct, ...prev]);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      storageService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Product</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Online/Offline Status */}
              <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              
              {/* Add Product Button */}
              <Button
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-6">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            totalProducts={filteredProducts.length}
          />
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <ViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
            totalProducts={filteredProducts.length}
          />
        </div>

        {/* Products Content */}
        <div className="space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || Object.values(filters).some(f => f) 
                  ? 'No products found' 
                  : 'No products yet'
                }
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || Object.values(filters).some(f => f)
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first product with the camera'
                }
              </p>
              {!searchQuery && !Object.values(filters).some(f => f) && (
                <Button
                  onClick={handleAddProduct}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {currentView === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}

              {/* Table View */}
              {currentView === 'table' && (
                <ProductTable
                  products={filteredProducts}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              )}
            </>
          )}
        </div>

        {/* Storage Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            {products.length} total products stored locally • 
            Storage size: {storageService.getStorageStats().storageSize}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            📱 100% offline PWA - All data stays on your device
          </p>
        </div>
      </main>

      {/* Product Form Modal */}
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onClose={() => setShowProductForm(false)}
        isOpen={showProductForm}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;