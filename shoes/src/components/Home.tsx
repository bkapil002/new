import { useEffect, useState } from "react";
import { ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
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
        const response = await fetch('http://localhost:5000/api/product');
        if (response.ok) {
          const data = await response.json();
          const desiredCategories = ["Lifestyle", "Airmax", "Running", "Sneakers"];
          const filteredProductsMap = new Map();
          data.forEach(product => {
            if (desiredCategories.includes(product.category) && !filteredProductsMap.has(product.category)) {
              filteredProductsMap.set(product.category, product);
            }
          });
          const filteredProducts = Array.from(filteredProductsMap.values());
          setProducts(filteredProducts);
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
      const rotationAngle = Math.min(50, scrollPosition / 2);
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
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
              Discover the greatest shoe collection at the{" "}
              <span className="text-blue-600">most affordable prices !!</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-[600px] mx-auto lg:mx-0">
              Browse from the biggest shoe collection this summer and avail greatest discounts on every product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 w-full sm:w-auto">
                Become member
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 w-full sm:w-auto">
                Browse the collection
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              *some terms get extra 10% discount
            </p>
          </div>
          <div className="relative h-[300px] sm:h-[400px] lg:h-[600px] w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-3xl" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={top}
                alt="Featured Shoe"
                className="object-contain w-full h-full transform transition-transform duration-500 hover:scale-105"
                style={{ transform: `rotate(${rotation}deg)` }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>





      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">Discover our most popular styles</p>
          </div>
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => {
            const discountPercentage = calculateDiscountPercentage(product.price, product.sellingPrice);
            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-[240px] sm:h-[280px] bg-gray-100 overflow-hidden group">
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
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
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
                  <button
                   
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </section>









      {/* Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Popular Categories</h2>
          <p className="text-gray-600">
            Explore our most sought-after collections, carefully curated for every style and need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((category) => (
            <Link
              to={`/category/${category.category}`}
              key={category.category}
              className="group cursor-pointer relative overflow-hidden rounded-2xl"
            >
              <div className="relative h-[240px] sm:h-[300px]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    {category.description}
                  </p>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">New Arrivals</h2>
            <p className="text-gray-600">Fresh styles added weekly</p>
          </div>



          {/* Mobile Category Selector */}
          <div className="sm:hidden w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
            >
              <span>{activeCategory}</span>
              {isDropdownOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {isDropdownOpen && (
              <div className="mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {["All", "Running", "Lifestyle", "Training"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full px-4 py-3 text-left transition-colors ${
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
          <div className="hidden sm:flex space-x-3">
            {["All", "Running", "Lifestyle", "Training"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              const discountPercentage = calculateDiscountPercentage(shoe.price, shoe.sellingPrice);
              return (
                <Link
                  to={`/product/${shoe.id}`}
                  key={shoe.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-[300px] sm:h-[350px] overflow-hidden">
                    {shoe.imageUrls && shoe.imageUrls[0] ? (
                      <img
                        src={shoe.imageUrls[0]}
                        alt={shoe.name}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    {discountPercentage > 0 && (
                      <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2">{shoe.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{shoe.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{shoe.sellingPrice?.toFixed(2) || shoe.price.toFixed(2)}
                        </span>
                        {discountPercentage > 0 && (
                          <span className="block text-sm text-gray-500 line-through">
                            ₹{shoe.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </main>
  );
}