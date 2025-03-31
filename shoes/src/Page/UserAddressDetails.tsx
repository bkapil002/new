import { useState, ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pencil, CircleArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';

interface UserDetails {
  _id: string;
  houseNo: string;
  phone: string;
  landmark: string;
  areaPin: string;
  city: string;
  state: string;
}

interface User {
  token: string;
}
export default function UserAddressDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails } = location.state || {};
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserDetails>(userDetails);
  const { user } = useAuth();

  const handleNext = () => {
    navigate('/CashOnDelivery');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        
      const response = await fetch(`http://localhost:5000/api/address/check-user-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update details. Please try again.');
      }

      toast.success('Details updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\+91[0-9]*$/.test(value) && value.length <= 13) {
      setFormData(prevData => ({
        ...prevData,
        phone: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white md:rounded-lg md:shadow-md">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 md:px-6 md:py-6 md:border-none">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Personal Details</h1>
              {!isEditing && (
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm md:text-base"
                  >
                    <Pencil className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm md:text-base"
                  >
                    <CircleArrowRight className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.houseNo}
                      onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base">{formData.houseNo || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number (double click to edit)
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-3 py-2 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base">{formData.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Landmark
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    required
                  />
                ) : (
                  <p className="text-gray-900 text-base">{formData.landmark || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Area PIN
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.areaPin}
                      onChange={(e) => setFormData({ ...formData, areaPin: e.target.value })}
                      pattern="[0-9]{6}"
                      className="w-full px-3 py-2 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base">{formData.areaPin || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base">{formData.city || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-base">{formData.state || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:relative md:border-none md:p-0 md:mt-6">
                <div className="flex gap-3 md:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
