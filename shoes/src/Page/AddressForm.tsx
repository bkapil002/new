import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { MapPin } from 'lucide-react';

interface AddressData {
  type: string;
  name: string;
  houseNo: string;
  landmark: string;
  area: string;
  areaPin: string;
  state: string;
  phone: string;
}

interface User {
  token: string;
}

export default function AddressForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<AddressData>({
    name: '',
    type: 'home',
    houseNo: '',
    landmark: '',
    area: '',
    areaPin: '',
    state: '',
    phone: '+91',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const houseNoWords = formData.houseNo.trim().split(/\s+/);
    if (houseNoWords.length < 3) {
      toast.error('House No. /Details must be at least 3 words long');
      return;
    }

    const landmarkWords = formData.landmark.trim().split(/\s+/);
    if (landmarkWords.length < 4) {
      toast.error('Landmark must be at least 4 words long');
      return;
    }

    const areaPinRegex = /^\d{6}$/;
    if (!areaPinRegex.test(formData.areaPin)) {
      toast.error('Area PIN must be a 6-digit number');
      return;
    }

    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Invalid phone number. It must start with +91 followed by 10 digits.');
      return;
    }

    setLoading(true);
    try {
      await saveAddress(formData, (user as User).token);
      toast.success('Address saved successfully');
      navigate('/cart'); 
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (data: AddressData, token: string) => {
    const response = await fetch('http://localhost:5000/api/address/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save address. Please try again.');
    }

    return await response.json();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFormData((prevData) => ({
        ...prevData,
        phone: `+91${value}`,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md transform transition-all duration-300">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Delivery Address
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Please provide your delivery details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['home', 'work', 'other'].map((types) => (
                  <button
                    key={types}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: types }))}
                    className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-200 capitalize
                      ${formData.type === types
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-200 text-gray-600'
                      }`}
                  >
                    {types}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors duration-200 focus:border-blue-500 focus:outline-none"
                placeholder="Enter Full Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-blue-500 transition-colors duration-200">
                <span className="px-4 py-3 bg-gray-50 text-gray-500 border-r-2 border-gray-200">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone.replace('+91', '')}
                  onChange={handlePhoneChange}
                  className="flex-1 px-4 py-3 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                House No. / Details
              </label>
              <input
                type="text"
                name="houseNo"
                value={formData.houseNo}
                onChange={handleChange}
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors duration-200 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Flat 101, Building Name"
                required
              />
              <p className="text-xs text-gray-500">
                Please provide at least 3 words for accurate delivery
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Landmark
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors duration-200 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Near City Mall, Opposite Park"
                required
              />
              <p className="text-xs text-gray-500">
                Please provide at least 4 words for better location identification
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Area PIN Code
              </label>
              <input
                type="text"
                name="areaPin"
                value={formData.areaPin}
                onChange={handleChange}
                pattern="[0-9]{6}"
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors duration-200 focus:border-blue-500 focus:outline-none"
                placeholder="Enter 6-digit PIN code"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors duration-200 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter state name"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 px-4 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Address...
                </span>
              ) : (
                'Save Address'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
