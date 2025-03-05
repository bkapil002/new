import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, Share2, ShoppingCart } from 'lucide-react';
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
import { useCart } from "../Context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew: boolean;
  discount: number;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const relatedProducts: Product[] = [
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

const ProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const product = relatedProducts.find((p) => p.id === parseInt(id || ''));
  const [selectedSize, setSelectedSize] = useState('');
  const sizes = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'];
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(fId => fId !== productId) : [...prev, productId]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (item: CartItem) => {
    addToCart(item);
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading='lazy'
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <img
                key={index}
                src={product.image}
                alt={`${product.name} - View ${index + 1}`}
                className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-75 transition"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl text-gray-900 mt-2">${product.price.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">Color</h3>
            <div className="flex space-x-2 mt-2">
              <button className="w-8 h-8 rounded-full bg-black border-2 border-white ring-2 ring-black"></button>
              <button className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white hover:ring-2 hover:ring-blue-600"></button>
              <button className="w-8 h-8 rounded-full bg-red-600 border-2 border-white hover:ring-2 hover:ring-red-600"></button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {sizes.map((size) => (
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

          <div>
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => handleAddToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity })}
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
              aria-label="Add to favorites"
            >
              <Heart
                className={`w-6 h-6 ${
                  favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
            <button className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200" aria-label="Share">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="prose prose-sm">
            <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
            <p className="text-gray-600">
              The Nike Air Max 270 combines the exaggerated tongue from the Air Max 180 and classic elements from the Air Max 93. It features Nike's biggest heel Air unit yet, offering a super-soft ride that feels as impossible as it looks.
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Shown: Black/White/Solar Red/Anthracite</li>
              <li>Style: AH8050-002</li>
              <li>Cushioned heel Air unit</li>
              <li>Breathable mesh upper</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
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
