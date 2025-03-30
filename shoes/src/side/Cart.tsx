import { HelpCircle, X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrls: string[];
  category: string;
  brand: string;
  description: string;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size: string;
}

const CartPage = () => {
  const { user, updateCart } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateCartTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => {
      const price = item.product.price || 0;
      return sum + price * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  const fetchCartItems = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const token = user.token;
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCartItems(response.data.products);
      calculateCartTotal(response.data.products);
    } catch (error) {
      console.error('Failed to fetch cart items', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (id: string, quantity: number) => {
    if (!user) {
      alert('Please log in to update your cart');
      return;
    }

    if (quantity < 1) return; // Prevent quantity from going below 1
    if (quantity > 2) {
      alert('Maximum quantity allowed is 2 items per product');
      return;
    }

    try {
      const token = user.token;
      await axios.post(
        `http://localhost:5000/api/cart/update/${id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.product._id === id ? { ...item, quantity } : item
        )
      );

      calculateCartTotal(
        cartItems.map((item) =>
          item._id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Failed to update item quantity', error);
      alert('Failed to update the quantity. Please try again.');
    }
  };

  const removeItemFromCart = async (id: string) => {
    if (!user) {
      alert('Please log in to remove items from your cart');
      return;
    }

    try {
      const token = user.token;
      await axios.delete(`http://localhost:5000/api/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      updateCart(cartItems.filter((item) => item.product._id !== id));
      setCartItems((prevCart) => prevCart.filter((item) => item.product._id !== id));
      calculateCartTotal(cartItems.filter((item) => item.product._id !== id));
    } catch (error) {
      console.error('Failed to remove item from cart', error);
      alert('Failed to remove item from the cart. Please try again.');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  useEffect(() => {
    calculateCartTotal(cartItems);
  }, [cartItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600">Your cart is empty</p>
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => window.history.back()}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0 w-full sm:w-32 h-32 rounded-lg overflow-hidden">
                          {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
                            <img
                              src={item.product.imageUrls[0]}
                              alt={item.product.name}
                              className="w-full h-full object-center object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No Image</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                              <p className="text-sm text-gray-500">{item.product.brand}</p>
                              {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                            </div>
                            <p className="text-lg font-medium text-gray-900">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-auto flex items-center justify-between">
                            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateItemQuantity(item.product._id, item.quantity - 1)}
                                className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateItemQuantity(item.product._id, item.quantity + 1)}
                                className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                                disabled={item.quantity >= 2}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItemFromCart(item.product._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-5">
              <div className="bg-white rounded-lg shadow-sm sticky top-4">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-600">Subtotal</span>
                      </div>
                      <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-600">Shipping</span>
                        <HelpCircle className="ml-1.5 h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-medium text-green-600">Free</span>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-600">Tax</span>
                        <HelpCircle className="ml-1.5 h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-medium">₹0.00</span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-medium text-gray-900">₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Proceed to Checkout
                  </button>

                
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;