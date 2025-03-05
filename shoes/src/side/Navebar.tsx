import React, { useState } from 'react';
import { Search, User, Menu, X, ShoppingCart, LogIn } from 'lucide-react';
import { useCart } from '../Context/CartContext'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';
import LoginModal from '../Page/LoginModal';
import { useAuth } from '../Context/AuthContext';
import SideBar from './SideBar';

// Import images
import newArrivals1 from '../image/newArrival (1).png';
import newArrivals2 from '../image/newArrival (2).png';
import newArrivals3 from '../image/newArrival (3).png';
import newArrivals4 from '../image/newArrival (4).png';
import newArrivals5 from '../image/newArrival (5).png';
import newArrivals6 from '../image/newArrival (6).png';
import featured1 from '../image/featured (1).png';
import featured2 from '../image/featured (2).png';
import featured3 from '../image/featured (3).png';
import featured4 from '../image/featured (4).png';


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew: boolean;
  discount: number;
}

const products: Product[] = [
  { id: 1, name: "Nike Air Zoom Wildflow", price: 125, image: featured1, category: "Lifestyle", isNew: true, discount: 10 },
  { id: 2, name: "Nike Revolution 2", price: 135, image: featured2, category: "Running", isNew: false, discount: 0 },
  { id: 3, name: "Nike Air Max 270", price: 150, image: featured3, category: "Skateboarding", isNew: true, discount: 0 },
  { id: 4, name: "Nike Free Run", price: 110, image: featured4, category: "Lifestyle", isNew: false, discount: 5 },
  { id: 5, name: "Nike Air Force 1", price: 140, image: newArrivals1, category: "Lifestyle", isNew: true, discount: 10 },
  { id: 6, name: "Nike Zoom Pegasus", price: 160, image: newArrivals2, category: "Running", isNew: true, discount: 10 },
  { id: 7, name: "Nike Metcon", price: 130, image: newArrivals3, category: "Training", isNew: false, discount: 0 },
  { id: 8, name: "Nike SB Dunk", price: 170, image: newArrivals4, category: "Skateboarding", isNew: true, discount: 20 },
  { id: 9, name: "Nike Blazer Mid", price: 120, image: newArrivals5, category: "Lifestyle", isNew: false, discount: 0 },
  { id: 10, name: "Nike React Vision", price: 145, image: newArrivals6, category: "Lifestyle", isNew: true, discount: 5 },
];

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems } = useCart();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={'/'} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-800">STORE</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Men</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Women</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Kids</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Sale</a>
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Search className="h-6 w-6 text-gray-600" />
              </button>

              {!isAuthenticated ? (
                <button onClick={() => setIsLoginModalOpen(true)} className="p-1 rounded-full hover:bg-gray-100 relative">
                  <LogIn className="h-6 w-6 text-gray-600" />
                </button>
              ) : (
                <>
                  <button onClick={() => setIsSidebarOpen(true)} className="p-1 rounded-full hover:bg-gray-100">
                    <User className="h-6 w-6 cursor-pointer text-gray-600" />
                  </button>
                  <Link to={'/cart'} className="p-1 rounded-full hover:bg-gray-100 relative">
                    <ShoppingCart className="h-6 w-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Search className="h-6 w-6" />
              </button>
              {!isAuthenticated ? (
                <button onClick={() => setIsLoginModalOpen(true)} className="p-1 rounded-full hover:bg-gray-100 relative">
                  <LogIn className="h-6 w-6 text-gray-600" />
                </button>
              ) : (
                <>
                  <button onClick={() => setIsSidebarOpen(true)}  className="p-1 rounded-full hover:bg-gray-100">
                    <User className="h-6 w-6  cursor-pointer text-gray-600" />
                  </button>
                  <Link to={'/cart'} className="p-1 rounded-full hover:bg-gray-100 relative">
                    <ShoppingCart className="h-6 w-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  </Link>
                </>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">Men</a>
              <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">Women</a>
              <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">Kids</a>
              <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">Sale</a>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-start justify-center pt-16">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Search Products</h2>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search for your favorite shoes by name, category, or style"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {searchQuery && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Search Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded-lg shadow-md">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-gray-600">{product.category}</p>
                            <p className="text-lg font-bold">${product.price}</p>
                          </div>
                        </Link>
                      ))}
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
    </>
  );
};

export default Navbar;
