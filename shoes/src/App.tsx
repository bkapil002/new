
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Footer from './side/Flooter'; 
import Navbar from './side/Navebar'; 
import ProductPage from './components/ProductPage';
import CartPage from './side/Cart';
import CategoryPage from './components/CategoryPage';
import { AuthProvider } from './Context/AuthContext';

function App() {
  return (
    
    <Router>
      <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/product/:id' element={<ProductPage/>}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/category/:category' element={<CategoryPage/>}/>
      </Routes>
      <Footer />
      <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
