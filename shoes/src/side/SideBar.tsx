import { X, CircleUser, ShoppingBag, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: React.FC<UserSidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users/logOut", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        logout();
        onClose();
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(`Logout failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Account</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {user ? (
            <div className="mb-6 pb-6 border-b">
              <p className="text-gray-600">Welcome,</p>
              <p className="font-medium">{user.email}</p>
            </div>
          ) : (
            <div className="mb-6 pb-6 border-b">
              <p className="text-gray-600">Please log in to access your account.</p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              to="/profile"
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 py-2"
              onClick={onClose}
            >
              <CircleUser className="h-5 w-5" />
              <span>Personal Details</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 py-2"
              onClick={onClose}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>My Orders</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-gray-700 hover:text-red-600 py-2 w-full"
            >
              {loading ? 'Wait...' : <><LogOut className="h-5 w-5" /><span>Log Out</span></>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
