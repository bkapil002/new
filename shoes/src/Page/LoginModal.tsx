import React, { useState } from 'react';
import { X, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import toast from 'react-hot-toast';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        login({ ...data.user, token: data.token });
        toast.success('Logged in successfully');
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`${errorData.error}`);
      }
    } catch (error) {
      console.error('Login attempt failed:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    setError('');

    if (signupStep === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Email already registered.');
        }

        setSignupStep(2);
      } catch (error) {
        setError(error.message);
      }
    } else if (signupStep === 2) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/emailverify/${formData.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp: formData.otp }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to verify OTP. Please try again.');
        }

        setSignupStep(3);
      } catch (error) {
        setError(error.message);
      }
    } else if (signupStep === 3) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/register/${formData.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: formData.password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create account.');
        }

        // Instead of logging in, switch to login mode
        toast.success('Account created successfully! Please log in.');
        setIsSignUp(false); // Switch to login form
        setSignupStep(1); // Reset signup step
        setFormData({ email: formData.email, password: '', otp: '' }); // Clear password and OTP, keep email
        setError(''); // Clear any errors
      } catch (error) {
        console.error('Error signing up:', error);
        toast.error(error.message || 'Email is already registered');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderSignupStep = () => {
    switch (signupStep) {
      case 1:
        return (
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="your@email.com"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center space-x-1 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className=" cursor-pointer h-4 w-4" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter the OTP sent to {formData.email}
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="OTP"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center space-x-1 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className=" cursor-pointer h-4 w-4" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="••••••••"
            />
            <div className="mt-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{isSignUp ? 'Create Account' : 'Login'}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isSignUp ? (
            renderSignupStep()
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="w-5 h-5 " />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </>
          )}

          {!isSignUp || signupStep === 1 ? (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setSignupStep(1);
                  setError('');
                }}
                className=" cursor-pointer text-gray-600 hover:text-gray-800"
              >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default LoginModal;