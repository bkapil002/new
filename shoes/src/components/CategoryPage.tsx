import { useParams, Link } from 'react-router-dom';
import {  ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from "../Context/CartContext";

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
  categoryId: string;
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

const categoryProducts: Product[] = [
  { id: 1, name: "Nike Air Zoom Wildflow", price: 125, image: featured1, categoryId: "Sneakers", isNew: true, discount: 10 },
  { id: 2, name: "Nike Revolution 2", price: 135, image: featured2, categoryId: "Sneakers", isNew: false, discount: 0 },
  { id: 3, name: "Nike Air Max 270", price: 150, image: featured3, categoryId: "Running", isNew: true, discount: 0 },
  { id: 4, name: "Nike Free Run", price: 110, image: featured4, categoryId: "Running", isNew: false, discount: 5 },
  { id: 5, name: "Nike Air Force 1", price: 140, image: newArrivals1, categoryId: "Air Max", isNew: true, discount: 10 },
  { id: 6, name: "Nike Zoom Pegasus", price: 160, image: newArrivals2, categoryId: "Air Max", isNew: true, discount: 10 },
  { id: 7, name: "Nike Metcon", price: 130, image: newArrivals3, categoryId: "Lifestyle", isNew: false, discount: 0 },
  { id: 8, name: "Nike SB Dunk", price: 170, image: newArrivals4, categoryId: "Sneakers", isNew: true, discount: 20 },
  { id: 9, name: "Nike Blazer Mid", price: 120, image: newArrivals5, categoryId: "Lifestyle", isNew: false, discount: 0 },
  { id: 10, name: "Nike React Vision", price: 145, image: newArrivals6, categoryId: "Lifestyle", isNew: true, discount: 5 },
];

const CategoryPage = () => {
  const { id } = useParams();

  const { addToCart } = useCart();

 
  // Filter products based on the category ID
  const filteredProducts = categoryProducts.filter(product => product.categoryId === id);

  const handleAddToCart = (item: CartItem) => {
    addToCart(item);
  };

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 justify-center text-center mb-6"> {id}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative h-[300px] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading='lazy'
                  />
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      New Arrival
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.categoryId}</p>
                  </div>
                  <div className="text-right">
                    {product.discount > 0 ? (
                      <>
                        <p className="text-lg font-bold text-red-500">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ${product.price}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold">${product.price}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  
                  <button
                    onClick={() => handleAddToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 })}
                    className="  cursor-pointer w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
