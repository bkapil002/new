import { useEffect, useState } from "react";
import { ShoppingCart, Star, ChevronRight, Heart , ChevronDown, ChevronUp  } from "lucide-react";
import top from '../image/top.png';
import featured1 from '../image/featured (1).png';
import featured2 from '../image/featured (2).png';
import featured3 from '../image/featured (3).png';
import featured4 from '../image/featured (4).png';
import categories1 from '../image/categories (1).png';
import categories2 from '../image/categories (2).png';
import categories3 from '../image/categories (3).png';
import categories4 from '../image/categories (4).png';
import newArrivals1 from '../image/newArrival (1).png';
import newArrivals2 from '../image/newArrival (2).png';
import newArrivals3 from '../image/newArrival (3).png';
import newArrivals4 from '../image/newArrival (4).png';
import newArrivals5 from '../image/newArrival (5).png';
import newArrivals6 from '../image/newArrival (6).png';
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

interface Shoe {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  count: number;
  category: string;
}

interface NewArrival {
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


const featuredShoes: Shoe[] = [
  { id: 1, name: "Nike Air Zoom Wildflow", price: 125, image: featured1, rating: 4.5, reviews: 120 },
  { id: 2, name: "Nike Revolution 2", price: 135, image: featured2, rating: 4.2, reviews: 95 },
  { id: 3, name: "Nike Air Max 270", price: 150, image: featured3, rating: 4.7, reviews: 150 },
  { id: 4, name: "Nike Free Run", price: 110, image: featured4, rating: 4.0, reviews: 80 },
];

const categories: Category[] = [
  { id: 1, name: "Sneakers", image: categories1, category: "Sneakers", description: "Street style sneakers", count: 50 },
  { id: 2, name: "Running", image: categories2,category: "Running", description: "Professional running shoes", count: 30 },
  { id: 3, name: "Air Max", image: categories3, category: "Air Max", description: "Air Max collection", count: 40 },
  { id: 4, name: "Lifestyle", image: categories4, category: "Lifestyle", description: "Casual comfort shoes", count: 60 },
];

const newArrivals: NewArrival[] = [
  { id: 5, name: "Nike Air Force 1", price: 140, image: newArrivals1, category: "Lifestyle", isNew: true, discount: 10 },
  { id: 6, name: "Nike Zoom Pegasus", price: 160, image: newArrivals2, category: "Running", isNew: true, discount: 15 },
  { id: 7, name: "Nike Metcon", price: 130, image: newArrivals3, category: "Training", isNew: false, discount: 0 },
  { id: 8, name: "Nike SB Dunk", price: 170, image: newArrivals4, category: "Skateboarding", isNew: true, discount: 20 },
  { id: 9, name: "Nike Blazer Mid", price: 120, image: newArrivals5, category: "Lifestyle", isNew: false, discount: 0 },
  { id: 10, name: "Nike React Vision", price: 145, image: newArrivals6, category: "Lifestyle", isNew: true, discount: 5 },
];

export default function Home() {
  const [rotation, setRotation] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const { addToCart } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const rotationAngle = Math.min(50, scrollPosition / 2);
      setRotation(rotationAngle);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };
  const handleAddToCart = (item: CartItem) => {
    addToCart(item);
  };

  

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
              Discover the greatest shoe collection at the{" "}
              <span className="text-blue-600">most affordable prices !!</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-[600px]">
              Browse from the biggest shoe collection this summer and avail greatest discounts on every product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto">
                Become member
              </button>
              <button className="border-blue-600 text-blue-600 hover:bg-blue-50 border px-4 py-2 rounded w-full sm:w-auto">
                Browse the collection
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              *some terms get extra 10% discount
            </p>
          </div>
          <div className="relative h-[400px] md:h-[600px] w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[90%] h-[90%]">
                <img
                  src={top}
                  alt="Featured Shoe"
                  className="object-contain transform transition-transform duration-500"
                  style={{ transform: `rotate(${rotation}deg)` }}
                  loading='lazy'
                />
              </div>
            </div>
           
          </div>
        </div>

        {/* Featured Products */}
        <section className="mt-24">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover our most popular styles</p>
            </div>
            <button className="hidden md:flex items-center text-blue-600 hover:text-blue-700">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredShoes.map((shoe) => (
              <Link to={`/product/${shoe.id}`}
                key={shoe.id}
                className="bg-white cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-[200px] bg-gray-100 overflow-hidden group">
                  <img
                    src={shoe.image}
                    alt={shoe.name}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                    loading='lazy'
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(shoe.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(shoe.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{shoe.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(shoe.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({shoe.reviews})</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold">${shoe.price}</p>
                  </div>
                  <button onClick={(e) => { e.preventDefault(); handleAddToCart({ id: shoe.id, name: shoe.name, price: shoe.price, image: shoe.image, quantity: 1 }); }}                                                    
                      className=" cursor-pointer w-full mt-3 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
            <p className="text-gray-600">
              Explore our most sought-after collections, carefully curated for every style and need
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((categorys) => (
              <Link 
              to={`/category/${categorys.category}`}
                key={categorys.id}
                className="group cursor-pointer relative overflow-hidden rounded-2xl"
              >
                <div className="relative h-[300px]">
                  <img
                    src={categorys.image}
                    alt={categorys.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading='lazy'
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{categorys.name}</h3>
                    <p className="text-sm text-gray-200 mb-2">
                      {categorys.description}
                    </p>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {categorys.count} Products
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="mt-24 mb-24">
  <div className="flex justify-between items-center mb-8">
    <div>
      <h2 className="text-2xl font-bold mb-2">New Arrivals</h2>
      <p className="text-gray-600">Fresh styles added weekly</p>
    </div>
    <div className="md:hidden relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
      >
        {activeCategory} {isDropdownOpen ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {["All", "Running", "Lifestyle", "Training"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setIsDropdownOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
    <div className="hidden md:flex space-x-2">
      {["All", "Running", "Lifestyle", "Training"].map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
    {newArrivals
      .filter((shoe) => activeCategory === "All" || shoe.category === activeCategory)
      .map((shoe) => (
        <Link to={`/product/${shoe.id}`}
          key={shoe.id}
          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="relative h-[300px] overflow-hidden">
            <img
              src={shoe.image}
              alt={shoe.name}
              className="w-full h-full object-cover"
              loading='lazy'
            />
            {shoe.isNew && (
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                New Arrival
              </span>
            )}
            {shoe.discount && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                {shoe.discount}% OFF
              </span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(shoe.id);
              }}
              className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  favorites.includes(shoe.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{shoe.name}</h3>
                <p className="text-sm text-gray-600">{shoe.category}</p>
              </div>
              <div className="text-right">
                {shoe.discount ? (
                  <>
                    <p className="text-lg font-bold text-red-500">
                      ${(shoe.price * (1 - shoe.discount / 100)).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      ${shoe.price}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold">${shoe.price}</p>
                )}
              </div>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); handleAddToCart({ id: shoe.id, name: shoe.name, price: shoe.price, image: shoe.image, quantity: 1 }); }} 
              className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </Link>
      ))}
  </div>
</section>
      </div>
    </main>
  );
}
