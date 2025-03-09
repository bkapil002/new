import { useState, useEffect } from 'react';
import { Product, Order } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import { Package, ShoppingBag, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
    setShowProductForm(false);
  };

  const handleOrderProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleSubmitOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Toaster position="bottom-right" />
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-center">Product Management System</h1>
          </div>
        </div>
      </header>

      {/* Navigation and Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex space-x-8 border-b border-gray-200 w-full">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center cursor-pointer py-4 px-1 ${
              activeTab === 'products'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="w-5 h-5 mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center py-4 px-1 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={() => setShowProductForm(true)}
            className="flex cursor-pointer items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-4 whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Product
          </button>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === 'products' ? (
          <div className="bg-white rounded-lg shadow p-6">
            {products.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No products available. Add a product to get started.</p>
            ) : (
              <ProductList products={products} onOrderProduct={handleOrderProduct} />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <OrderList orders={orders} products={products} />
          </div>
        )}
      </main>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <ProductForm
              onAddProduct={handleAddProduct}
              onCancel={() => setShowProductForm(false)}
            />
          </div>
        </div>
      )}

      {/* Order Modal */}
      {selectedProduct && (
        <OrderForm
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubmitOrder={handleSubmitOrder}
        />
      )}
    </div>
  );
}

export default App;
