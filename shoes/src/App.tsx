
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Footer from './side/Flooter'; 
import Navbar from './side/Navebar'; 
import ProductPage from './components/ProductPage';
import CartPage from './side/Cart';
import { CartProvider } from './Context/CartContext';
import CategoryPage from './components/CategoryPage';
import { AuthProvider } from './Context/AuthContext';

function App() {
  return (
    <AuthProvider>
    <CartProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/product/:id' element={<ProductPage/>}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/category/:category' element={<CategoryPage/>}/>
      </Routes>
      <Footer />
    </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
