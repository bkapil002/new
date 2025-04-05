
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Footer from './side/Flooter'; 
import Navbar from './side/Navebar'; 
import ProductPage from './components/ProductPage';
import CartPage from './side/Cart';
import CategoryPage from './components/CategoryPage';
import { AuthProvider } from './Context/AuthContext';
import AddressForm from './Page/AddressForm';
import UserAddressDetails from './Page/UserAddressDetails';
import Checkout from './Page/Checkout';
import Profile from './side/Profile';
import Orders from './side/Order';

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
        <Route path='/address'  element={<AddressForm/>} />
        <Route path='/AddressDetails' element={<UserAddressDetails/>} />
        <Route path='/Checkout' element={<Checkout/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/orders' element={<Orders/>}/>
      </Routes>
      <Footer />
      <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
