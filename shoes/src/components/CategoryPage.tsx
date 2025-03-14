import { useParams, Link } from 'react-router-dom';
import {  ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Product } from "../type";
import axios from 'axios';




const CategoryPage = () => {
  const { category } = useParams();
  const [data, setData] = useState<Product[]>([])

  useEffect(()=>{
     const fetchProuct = async()=>{
      try{
         const response = await axios.get('http://localhost:5000/api/product')
         const filteredProduct = response.data.filter(products => products.category === category)
         setData(filteredProduct)

      }catch(error){
         console.error('Failed to fetch product', error);

      } 
     }
     fetchProuct()
  },[category])
 
  const calculateDiscountPercentage = (price: number, sellingPrice: number) => {
    if (sellingPrice >= price) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 justify-center text-center mb-6"> {category}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        

          {data.map((product)=>{
             const discountPercentage = calculateDiscountPercentage (product.price, product.sellingPrice)

             return(
              <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative h-[300px] overflow-hidden">
                {product.imageUrls && product.imageUrls[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  
                  {discountPercentage > 0 && (
                      <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        {}% OFF
                      </span>
                    )}
                </div>
              </Link>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.sellingPrice?.toFixed(2) || product.price.toFixed(2)}
                        </span>
                        {discountPercentage > 0 && (
                          <span className="block text-sm text-gray-500 line-through">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  
                  <button
                   
                    className="  cursor-pointer w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
             )
          })}
          
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
