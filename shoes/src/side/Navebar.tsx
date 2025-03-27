import React, { useState, useEffect } from 'react';
import { Search, User, Menu, X, ShoppingCart, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginModal from '../Page/LoginModal';
import { useAuth } from '../Context/AuthContext'; // Ensure correct import path
import SideBar from './SideBar';

interface Product {
  id: string;
  name: string;
  price: number;
  sellingPrice: number;
  imageUrls: string[];
  category: string;
  brand: string;
}

const Navbar: React.FC = () => {
  const { isAuthenticated, cart } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const calculateDiscountPercentage = (price: number, sellingPrice: number) => {
    if (sellingPrice >= price) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

  const searchProducts = async (q: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/search?q=${encodeURIComponent(q)}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => {
        searchProducts(searchQuery);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setProducts([]);
    }
  }, [searchQuery]);



  return (
    <>
      <nav className="bg-white shadow-md top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={'/'} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                STORE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Men</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Women</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Kids</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Sale</a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              {!isAuthenticated ? (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogIn className="h-5 w-5 text-gray-600" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </button>
                  <Link to={'/cart'} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                    {cart && cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              {!isAuthenticated ? (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogIn className="h-5 w-5 text-gray-600" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </button>
                  <Link to={'/cart'} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                    {cart?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button> 
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200">Men</a>
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200">Women</a>
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200">Kids</a>
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200">Sale</a>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl mx-auto rounded-2xl shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Search Products
                </h2>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search by name, brand, or category"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {searchQuery && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Search Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                      {products.map((product) => {
                        const discountPercentage = calculateDiscountPercentage(product.price, product.sellingPrice);
                        return (
                          <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                            onClick={() => setIsSearchOpen(false)}
                          >
                            <div className="relative aspect-square">
                              <img
                                src={product.imageUrls[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {discountPercentage > 0 && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                  {discountPercentage}% OFF
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                              <div className="flex items-baseline space-x-2">
                                <span className="text-sm font-bold text-gray-900">
                                  ₹{product.sellingPrice.toLocaleString()}
                                </span>
                                {discountPercentage > 0 && (
                                  <span className="text-xs text-gray-500 line-through">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
