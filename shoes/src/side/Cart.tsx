import { HelpCircle, X } from 'lucide-react';
import { useCart } from '../Context/CartContext'; // Adjust the import path as necessary

const CartPage = () => {
  const { cartItems, removeFromCart, setCartItems } = useCart();

  const orderSummary = {
    subtotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    shipping: 5.00,
    tax: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.08,
    total: 0,
  };
  orderSummary.total = orderSummary.subtotal + orderSummary.shipping + orderSummary.tax;

  const updateQuantity = (id:number, quantity:number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="border-t border-gray-200 divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-shrink-0 w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
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
                          <p className="text-base sm:text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="mt-4 sm:mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0">
                         
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                            <select
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
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
                              onClick={() => removeFromCart(item.id)}
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
                      <dd className="text-gray-900 font-medium">${orderSummary.subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between mb-4">
                      <dt className="flex items-center">
                        Shipping estimate
                        <HelpCircle className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </dt>
                      <dd className="text-gray-900 font-medium">${orderSummary.shipping.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between mb-4">
                      <dt className="flex items-center">
                        Tax estimate
                        <HelpCircle className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </dt>
                      <dd className="text-gray-900 font-medium">${orderSummary.tax.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <dt className="text-base font-medium text-gray-900">Order total</dt>
                      <dd className="text-base font-medium text-gray-900">${orderSummary.total.toFixed(2)}</dd>
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
