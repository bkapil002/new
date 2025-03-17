import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import top from '../image/top.png';
import { Product, Category, NewArrival } from "../type";
import categories1 from '../image/categories (1).png';
import categories2 from '../image/categories (2).png';
import categories3 from '../image/categories (3).png';
import categories4 from '../image/categories (4).png';
import { Link } from "react-router-dom";

const categories: Category[] = [
  { id: 1, name: "Sneakers", image: categories1, category: "Sneakers", description: "Street style sneakers", count: 50 },
  { id: 2, name: "Running", image: categories2, category: "Running", description: "Professional running shoes", count: 30 },
  { id: 3, name: "Air Max", image: categories3, category: "Airmax ", description: "Air Max collection", count: 40 },
  { id: 4, name: "Lifestyle", image: categories4, category: "Lifestyle", description: "Casual comfort shoes", count: 60 },
];

export default function Home() {
  const [rotation, setRotation] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newArrival, setNewArrival] = useState<NewArrival[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product/category/lifestyle-group');
        if(response.ok){
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product');
        if (response.ok) {
          const data = await response.json();
          setNewArrival(data);
        }
      } catch (error) {
        console.error('Error fetching new arrival products:', error);
      }
    };
    fetchNewArrival();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const rotationAngle = Math.min(50, scrollPosition / 6);
      setRotation(rotationAngle);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateDiscountPercentage = (price: number, sellingPrice: number) => {
    if (sellingPrice >= price) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover the greatest shoe collection
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl max-w-[600px] mx-auto lg:mx-0 leading-relaxed">
              Browse from the biggest shoe collection this summer and avail greatest discounts on every product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto">
                Become member
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                Browse collection
              </button>
            </div>
            <p className="text-sm text-gray-500 italic">
              *Get an extra 10% discount on selected items
            </p>
          </div>
          <div className="relative h-[400px] sm:h-[500px] lg:h-[700px] w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-2xl" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <img
                src={top}
                alt="Featured Shoe"
                className="object-contain w-full h-full transform transition-all duration-500 hover:scale-110 filter drop-shadow-2xl"
                style={{ transform: `rotate(${rotation}deg)` }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">Discover our most popular styles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const discountPercentage = calculateDiscountPercentage(product.price, product.sellingPrice || 0);
            return (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative h-[280px] sm:h-[320px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  {product.imageUrls && product.imageUrls[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  {discountPercentage > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {discountPercentage}% OFF
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.sellingPrice?.toFixed(2) || product.price.toFixed(2)}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Popular Categories
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our most sought-after collections, carefully curated for every style and need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              to={`/category/${category.category}`}
              key={category.category}
              className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative h-[300px] sm:h-[350px]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-2 transform group-hover:translate-x-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-200 mb-3 transform group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    {category.description}
                  </p>
                  <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm transform group-hover:translate-x-2 transition-transform duration-300 delay-150">
                    {category.count} Products
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div className="mb-6 sm:mb-0">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              New Arrivals
            </h2>
            <p className="text-gray-600 text-lg">Fresh styles added weekly</p>
          </div>

          {/* Mobile Category Selector */}
          <div className="sm:hidden w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-6 py-3 rounded-xl bg-white shadow-md text-gray-700"
            >
              <span className="font-medium">{activeCategory}</span>
              {isDropdownOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {isDropdownOpen && (
              <div className="mt-2 w-full bg-white rounded-xl shadow-xl z-20 overflow-hidden">
                {["All", "Running", "Lifestyle", "Training"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full px-6 py-3 text-left transition-colors ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Category Selector */}
          <div className="hidden sm:flex space-x-4">
            {["All", "Running", "Lifestyle", "Training"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrival
            .filter((shoe) => activeCategory === "All" || shoe.category === activeCategory)
            .map((shoe) => {
              const discountPercentage = calculateDiscountPercentage(shoe.price, shoe.sellingPrice || 0);
              return (
                <Link
                  to={`/product/${shoe._id}`}
                  key={shoe._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative h-[350px] sm:h-[400px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {shoe.imageUrls && shoe.imageUrls[0] ? (
                      <img
                        src={shoe.imageUrls[0]}
                        alt={shoe.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                    {discountPercentage > 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        {discountPercentage}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                      {shoe.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{shoe.category}</p>
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{shoe.sellingPrice?.toFixed(2) || shoe.price.toFixed(2)}
                      </span>
                      {discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{shoe.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </main>
  );
}