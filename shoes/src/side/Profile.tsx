import  { useState, useEffect ,FormEvent} from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

interface UserDetails {
    _id: string;
    houseNo: string;
    phone: string;
    landmark: string;
    areaPin: string;
    name: string;
    state: string;
  }
export default function Profile() {
  const location = useLocation();
  const { userDetails } = location.state || {};
  const [isEditing, setIsEditing] = useState<boolean>(false);
   const [formData, setFormData] = useState<UserDetails>({
      _id: '',
      houseNo: '',
      phone: '',
      landmark: '',
      areaPin: '',
      name: '',
      state: '',
      ...userDetails,
    });
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.token) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/address/check-user-details', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setFormData(response.data);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user && user.token) {
      try {
        const response = await axios.put(`http://localhost:5000/api/address/${formData._id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status !== 200) {
          const errorData = response.data;
          throw new Error(errorData.message || 'Failed to update details. Please try again.');
        }

        toast.success('Details updated successfully');
        setIsEditing(false);
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error('Please log in to update your details.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Personal Details</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-900">{formData.name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House No.
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.houseNo || ''}
                  onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-900">{formData.houseNo || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <div className="flex items-center">
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled
                    required
                  />
                  
                </div>
              ) : (
                <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Landmark
              </label>
              {isEditing ? (
                <textarea
                  value={formData.landmark || ''}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-900">{formData.landmark || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area PIN
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.areaPin || ''}
                  onChange={(e) => setFormData({ ...formData, areaPin: e.target.value })}
                  pattern="[0-9]{6}"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-900">{formData.areaPin || 'Not provided'}</p>
              )}
            </div>

            

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-900">{formData.state || 'Not provided'}</p>
              )}
            </div>
          </div>

         
        </form>
      </div>
    </div>
  );
}
