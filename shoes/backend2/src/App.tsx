import  { useState } from 'react';
import { Product, Order } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import { Package, ShoppingBag, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Sample products for demonstration
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Brother Handicraft Intersecting Wall Shelves',
    price: 999.00,
    sellingPrice: 510.00,
    imageUrl: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Home',
    features: {
      cashOnDelivery: true,
      lowestPrice: true,
      fiveDayReturns: true,
      freeDelivery: true
    }
  },
  {
    id: '2',
    name: 'ZIYDECO Unique Design Boho Wall Hanging Shelf',
    price: 499.00,
    sellingPrice: 320.00,
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    category: 'Home',
    features: {
      cashOnDelivery: true,
      lowestPrice: false,
      fiveDayReturns: true,
      freeDelivery: false
    }
  },
  {
    id: '3',
    name: 'Urhan Hanging Shelf | Macrame Wall Hanging',
    price: 350.00,
    sellingPrice: 190.00,
    imageUrl: 'https://images.unsplash.com/photo-1614630982169-e89202c5e045?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    category: 'Home',
    features: {
      cashOnDelivery: true,
      lowestPrice: true,
      fiveDayReturns: false,
      freeDelivery: true
    }
  },
  {
    id: '4',
    name: 'Macrame Wall Hanging Decor Plant Hanger',
    price: 250.00,
    sellingPrice: 150.00,
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    category: 'Home',
    features: {
      cashOnDelivery: true,
      lowestPrice: false,
      fiveDayReturns: true,
      freeDelivery: true
    }
  },
  {
    id: '5',
    name: 'Macrame Wall Hanging Decor Plant Hanger',
    price: 250.00,
    sellingPrice: 150.00,
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    category: 'Home',
    features: {
      cashOnDelivery: true,
      lowestPrice: false,
      fiveDayReturns: true,
      freeDelivery: true
    }
  },
  {
    id: '6',
    name: 'Macrame Wall Hanging Decor Plant Hanger',
    price: 250.00,
    sellingPrice: 150.00,
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    category: 'Home',
    features: {
      cashOnDelivery: true,
      lowestPrice: false,
      fiveDayReturns: true,
      freeDelivery: true
    }
  }
];

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

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
            <Package className="w-5 h-5 mr-2  " />
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
            <ShoppingBag className="  w-5 h-5 mr-2" />
            Orders
          </button>
        </div>
        
        {activeTab === 'products' && (
          <button
            onClick={() => setShowProductForm(true)}
            className=" flex cursor-pointer items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-4 whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2 " />
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