import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Share2, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import lowerPrice from '../image/saving-money.png';
import returnProduct from '../image/return.png';
import cashOnDelivery from '../image/cash-on-delivery.png';
import freeDelivery from '../image/free-shipping.png';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  sellingPrice?: number;
  imageUrls?: string[];
  details?: string;
  category?: string;
  size: { [key: string]: boolean };
  features?: {
    freeDelivery?: boolean;
    cashOnDelivery?: boolean;
    fiveDayReturns?: boolean;
    lowestPrice?: boolean;
  };
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { user, updateCart } = useAuth();

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product', error);
    }
  }, [id]);

  const fetchRelated = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/related-products/${id}`);
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch related products', error);
    } finally {
      setRelatedProductsLoading(false);
    }
  }, [id]);

  const addToCart = async (product: Product) => {
    try {
      const token = user ? user.token : null;

      if (!token) {
        toast('Please login to add items to the cart');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId: product._id, quantity: 1, size: selectedSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast('Product added to cart');
      updateCart(response.data.products);
    } catch (error) {
      console.error('Failed to add to cart', error);
      toast.error('Add the Size');
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchRelated();
  }, [fetchProduct, fetchRelated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const availableSizes = Object.keys(product.size).filter(size => product.size[size]);

  const calculateDiscount = (price: number, sellingPrice: number) => {
    if (price && sellingPrice && sellingPrice < price) {
      const discountPercentage = ((price - sellingPrice) / price) * 100;
      return Math.round(discountPercentage);
    }
    return 0;
  };

  const nextImage = () => {
    if (product.imageUrls) {
      setSelectedImage((prev) => (prev + 1) % product.imageUrls!.length);
    }
  };

  const previousImage = () => {
    if (product.imageUrls) {
      setSelectedImage((prev) => (prev - 1 + product.imageUrls!.length) % product.imageUrls!.length);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb - Mobile */}
        <div className="mb-4 sm:hidden">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to products
          </Link>
        </div>

        {/* Breadcrumb - Desktop */}
        <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={product.imageUrls?.[selectedImage] || ''}
                alt={product.name}
                className="w-full h-full object-cover"
                onClick={() => setIsImageModalOpen(true)}
              />
              {product.imageUrls && product.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              {product.sellingPrice && product.sellingPrice < product.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {calculateDiscount(product.price, product.sellingPrice)}% OFF
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.imageUrls?.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-75 transition-opacity"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-4">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{product.sellingPrice?.toFixed(2) || product.price.toFixed(2)}
                </span>
                {product.sellingPrice && product.sellingPrice < product.price && (
                  <div className="space-x-2">
                    <span className="text-lg text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                    <span className="text-sm font-medium text-green-600">
                      {calculateDiscount(product.price, product.sellingPrice)}% off
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div className="border-t border-b border-gray-200 py-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Select Size</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
              {product.features?.freeDelivery && (
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl space-y-2 hover:bg-gray-100 transition-colors">
                  <img
                    src={freeDelivery}
                    alt="Free Delivery"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    Free Delivery
                  </span>
                </div>
              )}
              {product.features?.cashOnDelivery && (
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl space-y-2 hover:bg-gray-100 transition-colors">
                  <img
                    src={cashOnDelivery}
                    alt="Cash On Delivery"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    Cash On Delivery
                  </span>
                </div>
              )}
              {product.features?.fiveDayReturns && (
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl space-y-2 hover:bg-gray-100 transition-colors">
                  <img
                    src={returnProduct}
                    alt="5-Day Returns"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    5-Day Returns
                  </span>
                </div>
              )}
              {product.features?.lowestPrice && (
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl space-y-2 hover:bg-gray-100 transition-colors">
                  <img
                    src={lowerPrice}
                    alt="Low Price"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    Low Price
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <div className="flex gap-4">
                <button
                  className="p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <div className="text-base text-gray-600 space-y-3">
                {product.details && product.details.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 sm:mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          {relatedProductsLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading related products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((relatedProduct) => {
                const discountPercentage = calculateDiscount(
                  relatedProduct.price,
                  relatedProduct.sellingPrice || relatedProduct.price
                );

                return (
                  <Link
                    to={`/product/${relatedProduct._id}`}
                    key={relatedProduct._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={relatedProduct.imageUrls?.[0] || ''}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {discountPercentage > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                          {discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{relatedProduct.category}</p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{relatedProduct.sellingPrice?.toFixed(2) || relatedProduct.price.toFixed(2)}
                        </span>
                        {relatedProduct.sellingPrice && relatedProduct.sellingPrice < relatedProduct.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{relatedProduct.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={product.imageUrls?.[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setIsImageModalOpen(false)}
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
