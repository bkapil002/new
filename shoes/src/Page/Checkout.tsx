import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingBagIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserCart {
  _id: string;
  product: {
    _id: string;
    name: string;
    sellingPrice: number;
    imageUrls: string[];
  };
  quantity: number;
  size: string;
}

interface UserDetails {
  _id: string;
  email: string;
}

interface UserAddress {
  _id: string;
  houseNo: string;
  phone: string;
  landmark: string;
  areaPin: string;
  name: string;
  state: string;
}

export default function Checkout() {
  const { user } = useAuth();
  const [cart, setCart] = useState<UserCart[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [addressDetails, setAddressDetails] = useState<UserAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = user ? user.token : null;
      if (!token) {
        toast.error('Please log in to view your cart');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data.products);
    } catch (error) {
      toast.error('Failed to fetch cart');
      setCart([]);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUserDetails(response.data);
    } catch (error) {
      toast.error('Failed to fetch user details');
      setUserDetails(null);
    }
  };

  const fetchAddressDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/address/check-user-details', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAddressDetails(response.data);
    } catch (error) {
      toast.error('Failed to fetch address details');
      setAddressDetails(null);
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderDetails = {
        products: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          sellingPrice: item.product.sellingPrice,
          size: item.size,
        })),
        totalAmount: calculateTotalAmount(),
        shippingAddress: addressDetails,
        paymentMethod: paymentMethod,
      };

      const response = await axios.post('http://localhost:5000/api/order', orderDetails, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      toast.success('Order placed successfully');
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.product.sellingPrice * item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
    fetchUserDetails();
    fetchAddressDetails();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-4 lg:py-12">
        <div className="flex items-center justify-between mb-4 lg:mb-12">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <ShoppingBagIcon className="h-6 w-6 lg:h-8 lg:w-8 text-indigo-600" />
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
          <div className="space-y-4 lg:space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-3 lg:p-6 border border-gray-200">
              <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Order Summary</h2>
              <div className="divide-y divide-gray-200">
                {Array.isArray(cart) && cart.length > 0 ? (
                  cart.map(item => (
                    <div key={item.product._id} className="py-4 lg:py-6 first:pt-0 last:pb-0">
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <img
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          className="w-16 h-16 lg:w-24 lg:h-24 object-cover rounded-lg border border-gray-200"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="mt-1 text-xs lg:text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="mt-1 text-xs lg:text-sm text-gray-500">Size: {item.size}</p>
                          <p className="mt-1 text-sm lg:text-base font-medium text-gray-900">
                            ₹{item.product.sellingPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-4 lg:py-6 text-gray-500 text-center text-sm lg:text-base">No items in cart</p>
                )}
              </div>
              <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm lg:text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>₹{calculateTotalAmount().toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-3 lg:p-6 border border-gray-200">
              <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">User Details</h2>
              {userDetails ? (
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm lg:text-base text-gray-600">Email</span>
                    <span className="text-sm lg:text-base font-medium">{userDetails.email}</span>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-3 lg:space-y-4">
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 lg:space-y-8">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-3 lg:p-6 border border-gray-200">
              <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Delivery Address</h2>
              {addressDetails ? (
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm lg:text-base text-gray-600">Name</span>
                    <span className="text-sm lg:text-base font-medium">{addressDetails.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm lg:text-base text-gray-600">Phone</span>
                    <span className="text-sm lg:text-base font-medium">{addressDetails.phone}</span>
                  </div>
                  <div>
                    <span className="text-sm lg:text-base text-gray-600">Address</span>
                    <p className="mt-1 text-sm lg:text-base font-medium">
                      {addressDetails.houseNo}, {addressDetails.landmark},
                      <br />
                      {addressDetails.areaPin}, {addressDetails.state}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-3 lg:space-y-4">
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-3 lg:p-6 border border-gray-200">
              <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Payment Method</h2>
              <div className="space-y-3 lg:space-y-4">
                <label className="flex items-center p-3 lg:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash On Delivery"
                    checked={paymentMethod === 'Cash On Delivery'}
                    onChange={() => setPaymentMethod('Cash On Delivery')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm lg:text-base font-medium text-gray-900">Cash On Delivery</span>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={loading || !userDetails || !addressDetails || cart.length === 0}
              className="w-full bg-indigo-600 text-white py-3 lg:py-4 px-4 lg:px-6 rounded-xl font-medium text-sm lg:text-base
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600
                transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
