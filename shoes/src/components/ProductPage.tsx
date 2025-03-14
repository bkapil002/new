import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, Share2, ShoppingCart } from 'lucide-react';
import lowerPrice from '../image/saving-money.png';
import returnProduct from '../image/return.png';
import cashOnDelivery from '../image/cash-on-delivery.png';
import freeDelivery from '../image/free-shipping.png';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  sellingPrice?: number;
  imageUrls?: string[];
  details?: string;
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
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(fId => fId !== productId) : [...prev, productId]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Product not found.</p>
      </div>
    );
  }

  const availableSizes = Object.keys(product.size).filter(size => product.size[size]);

  const calculateDiscount = (price: number, sellingPrice: number) => {
    if (price && sellingPrice) {
      const discountPercentage = ((price - sellingPrice) / price) * 100;
      return discountPercentage.toFixed(2);
    }
    return '0';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.imageUrls?.[0] || ''}
              alt={product.name}
              className="w-full h-full object-cover"
              loading='lazy'
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.imageUrls?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${product.name} - View ${index + 1}`}
                className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-75 transition"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <span className="text-xl text-gray-900 mt-2">₹{product.sellingPrice?.toFixed(2) || product.price.toFixed(2)}</span>
            {product.sellingPrice && (
              <>
                <span className="block text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">
                  {calculateDiscount(product.price, product.sellingPrice)}% off
                </span>
              </>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-sm font-medium rounded-md ${
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

          <div className="grid grid-cols-4 gap-3 py-4">
            {product.features?.freeDelivery && (
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-xl space-y-2">
                <img
                  src={freeDelivery}
                  alt="Free Delivery"
                  className="w-8 h-8 lg:w-12 lg:h-12"
                />
                <span className="text-xs lg:text-sm font-medium text-gray-800">
                  Free Delivery
                </span>
              </div>
            )}
            {product.features?.cashOnDelivery && (
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-xl space-y-2">
                <img
                  src={cashOnDelivery}
                  alt="Cash On Delivery"
                  className="w-8 h-8 lg:w-12 lg:h-12"
                />
                <span className="text-xs lg:text-sm font-medium text-gray-800">
                  Cash On Delivery
                </span>
              </div>
            )}
            {product.features?.fiveDayReturns && (
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-xl space-y-2">
                <img
                  src={returnProduct}
                  alt="5-Day Returns"
                  className="w-8 h-8 lg:w-12 lg:h-12"
                  loading='lazy'
                />
                <span className="text-xs lg:text-sm font-medium text-gray-800">
                  5-Day Returns
                </span>
              </div>
            )}
            {product.features?.lowestPrice && (
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-xl space-y-2">
                <img
                  src={lowerPrice}
                  alt="Low Price"
                  className="w-8 h-8 lg:w-12 lg:h-12"
                />
                <span className="text-xs lg:text-sm font-medium text-gray-800">
                  Low Price
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleFavorite(product._id)}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
              aria-label="Add to favorites"
            >
              <Heart
                className={`w-6 h-6 ${
                  favorites.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
            <button className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200" aria-label="Share">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="prose prose-sm">
            <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
            <div className="text-base text-gray-600 space-y-3">
              {product.details && product.details.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      \ <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link
              to={`/product/${relatedProduct.id}`}
              key={relatedProduct.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover"
                  loading='lazy'
                />
                {relatedProduct.isNew && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    New Arrival
                  </span>
                )}
                {relatedProduct.discount && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {relatedProduct.discount}% OFF
                  </span>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); toggleFavorite(relatedProduct.id); }}
                  className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                  aria-label={`${favorites.includes(relatedProduct.id) ? 'Remove from' : 'Add to'} favorites`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(relatedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{relatedProduct.name}</h3>
                    <p className="text-sm text-gray-600">{relatedProduct.category}</p>
                  </div>
                  <div className="text-right">
                    {relatedProduct.discount ? (
                      <>
                        <p className="text-lg font-bold text-red-500">
                          ${(relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ${relatedProduct.price}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold">${relatedProduct.price}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); handleAddToCart({ id: relatedProduct.id, name: relatedProduct.name, price: relatedProduct.price, image: relatedProduct.image, quantity: 1 }); }}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
