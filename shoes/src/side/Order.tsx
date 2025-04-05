import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Truck, CircleCheckBig, Package, ShoppingBag } from 'lucide-react';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    sellingPrice: number;
    imageUrls: string[];
    features: {
      sevenDayReturns: boolean;
    };
  };
  quantity: number;
  returnRequested: boolean;
  size:string
}

interface UserOrder {
  _id: string;
  products: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: Date;
  deliveryDate: string;
}

type OrderStatus =
  | 'Ordered'
  | 'Shipping'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Return Processed';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = user ? user.token : null;
      if (!token) {
        toast.error('Please log in to view your orders');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/order/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const cancelOrder = async (orderId: string) => {
    try {
      const token = user ? user.token : null;
      if (!token) {
        toast.error('Please log in to cancel the order');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/order/cancel/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      toast.error('Failed to cancel the order');
    }
  };

  const requestReturn = async (orderId: string, productId: string) => {
    try {
      const token = user ? user.token : null;
      if (!token) {
        toast.error('Please log in to request a return');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/order/return/${orderId}`, { productId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);

      // Update the local state to reflect the return request
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? {
            ...order,
            products: order.products.map(item =>
              item.product._id === productId ? { ...item, returnRequested: true } : item
            )
          } : order
        )
      );
    } catch (error) {
      toast.error('Failed to request a return');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Ordered':
        return (
          <span className="flex items-center text-yellow-600">
            <Package className="h-5 w-5 mr-1" />
            Ordered
          </span>
        );
      case 'Shipping':
        return (
          <span className="flex items-center text-yellow-600">
            <Truck className="h-5 w-5 mr-1" />
            Shipping
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="flex items-center text-yellow-600">
            <Truck className="h-5 w-5 mr-1" />
            Out for Delivery
          </span>
        );
      case 'Delivered':
        return (
          <span className="flex items-center text-green-600">
            <CircleCheckBig className="h-5 w-5 mr-1" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="flex items-center text-red-600">
            <X className="h-5 w-5 mr-1" />
            Cancelled
          </span>
        );
      case 'Return Requested':
        return (
          <span className="flex items-center text-blue-600">
            <CircleCheckBig className="h-5 w-5 mr-1" />
            Return Requested
          </span>
        );
      case 'Return Processed':
        return (
          <span className="flex items-center text-purple-600">
            <CircleCheckBig className="h-5 w-5 mr-1" />
            Return Processed
          </span>
        );
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isWithinReturnWindow = (deliveryDate: Date) => {
    const fiveDaysAfterDelivery = new Date(deliveryDate);
    fiveDaysAfterDelivery.setDate(fiveDaysAfterDelivery.getDate() + 5);
    return new Date() <= fiveDaysAfterDelivery;
  };

  // Loading skeleton for orders
  const OrdersSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="p-4 md:p-6">
            {/* Order Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-full w-32"></div>
                <div className="h-3 bg-gray-200 rounded-full w-24"></div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>

            {/* Product Skeleton */}
            <div className="space-y-4">
              {[1, 2].map((j) => (
                <div key={j} className="flex flex-col md:flex-row items-start gap-4 py-4">
                  <div className="w-full md:w-24 h-32 md:h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded-full w-40 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          </div>
          <OrdersSkeleton />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600">
            When you place orders, they will appear here for you to track and manage.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      Ordered: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Shipping: 'bg-blue-50 text-blue-700 border-blue-200',
      'Out for Delivery': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Delivered: 'bg-green-50 text-green-700 border-green-200',
      Cancelled: 'bg-red-50 text-red-700 border-red-200',
      'Return Requested': 'bg-purple-50 text-purple-700 border-purple-200',
      'Return Processed': 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <span className="text-sm text-gray-500">{orders.length} orders</span>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                    <p className="text-xs font-mono text-gray-400">#{order._id}</p>
                    {order.deliveryDate && (
                      <p className="text-lg antialiased font-semibold text-gray-900">
                        Delivery by {formatDate(order.deliveryDate)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-lg font-semibold">₹{order.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Products List */}
                <div className="divide-y divide-gray-100">
                  {order.products.map((item) => (
                    <div key={item.product._id} className="py-4 flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.imageUrls?.[0] || 'https://via.placeholder.com/150'}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 line-clamp-3">{item.product.name}</h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Quantity: {item.quantity}</p>
                          <p>Size: {item.size}</p>
                          <p>₹{item.product.sellingPrice?.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(item.quantity * item.product.sellingPrice)?.toFixed(2)}
                        </p>
                        {/* Request Return Button */}
                        {order.status === 'Delivered' &&
                          item.product.features?.sevenDayReturns &&
                          !item.returnRequested &&
                          isWithinReturnWindow(order.deliveryDate!) && (
                            <button
                              onClick={() => requestReturn(order._id, item.product._id)}
                              className="inline-flex items-center px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200 ml-4"
                            >
                              <CircleCheckBig className="h-5 w-5 mr-2" />
                              Request Return
                            </button>
                          )}
                        {item.returnRequested && (
                          <span className="text-blue-600 ml-4">
                            <CircleCheckBig className="h-5 w-5 mr-2" />
                            Return Requested
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cancel Order Button */}
                {order.status === 'Ordered' && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
