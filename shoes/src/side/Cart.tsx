import { HelpCircle, X } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrls: string[];
  category: string;
  brand: string;
  description: string;
}

const CartPage = () => {
  const { user } = useAuth();
  const [carts, setCart] = useState<Product[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateCartTotal = (products: Product[]) => {
    const total = products.reduce((sum, item) => {
      const price = item.price || 0;
      return sum + price * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  const fetchCart = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const token = user.token;
      const response = await axios.get(`http://localhost:5000/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCart(response.data.products);
      calculateCartTotal(response.data.products);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) {
      alert('Please log in to update your cart');
      return;
    }

    try {
      const token = user.token;
      await axios.post(
        'http://localhost:5000/api/cart/update',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );

      calculateCartTotal(
        carts.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      alert('Please log in to remove items from the cart');
      return;
    }

    try {
      const token = user.token;
      await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prevCart) =>
        prevCart.filter((item) => item._id !== productId)
      );

      calculateCartTotal(
        carts.filter((item) => item._id !== productId)
      );
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);
  useEffect(() => {
    console.log('Cart Products:', carts); // Inspect the cart products
  }, [carts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>
        {carts.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="border-t border-gray-200 divide-y divide-gray-200">
                {carts.map((item) => (
                  <div key={item._id} className="py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-shrink-0 w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrls?.[0] || ''}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                          loading='lazy'
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base sm:text-sm font-medium text-gray-900">{item.name}</h3>
                          </div>
                          <p className="text-base sm:text-sm font-medium text-gray-900">
                            {item.price != null ? `$${item.price.toFixed(2)}` : 'N/A'}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0">
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                            <select
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                              className="w-24 rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item._id)}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              <X className="w-6 h-6 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-5">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-4">
                <h2 className="sr-only">Order summary</h2>

                <div className="text-gray-500 text-sm border-b border-gray-200 p-4 sm:p-6">
                  <div className="flow-root">
                    <div className="flex justify-between mb-4">
                      <dt>Subtotal</dt>
                      <dd className="text-gray-900 font-medium">${cartTotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between mb-4">
                      <dt className="flex items-center">
                        Shipping estimate
                        <HelpCircle className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </dt>
                      <dd className="text-gray-900 font-medium">$0.00</dd>
                    </div>
                    <div className="flex justify-between mb-4">
                      <dt className="flex items-center">
                        Tax estimate
                        <HelpCircle className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </dt>
                      <dd className="text-gray-900 font-medium">$0.00</dd>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <dt className="text-base font-medium text-gray-900">Order total</dt>
                      <dd className="text-base font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <button
                    type="button"
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    Checkout
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
