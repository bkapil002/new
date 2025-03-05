import React, { useState } from 'react';
import { Product } from '../types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Upload } from 'lucide-react';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    details: '',
    currentPrice: '',
    sellingPrice: '',
    category: 'Home',
  });
  const [features, setFeatures] = useState({
    cashOnDelivery: false,
    lowestPrice: false,
    fiveDayReturns: false,
    freeDelivery: false
  });

  const handleFeatureChange = (feature: keyof typeof features) => {
    setFeatures({
      ...features,
      [feature]: !features[feature]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('details', formData.details);
      formDataToSend.append('currentPrice', formData.currentPrice);
      formDataToSend.append('sellingPrice', formData.sellingPrice);
      formDataToSend.append('category', formData.category);

      // Append features to formDataToSend
      Object.entries(features).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });

      const response = await axios.post('http://localhost:5000/api/product/uploadProduct', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success('Product uploaded successfully');
        setFormData({
          name: '',
          brand: '',
          details: '',
          currentPrice: '',
          sellingPrice: '',
          category: 'Home',
        });
        setFeatures({
          cashOnDelivery: false,
          lowestPrice: false,
          fiveDayReturns: false,
          freeDelivery: false
        });
      } else {
        toast.error('Product upload failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upload New Product</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (Max 5)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              <div className="text-gray-400 mb-2">
                <div className="w-10 h-10 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image URL"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Current Price (₹)
              </label>
              <input
                type="number"
                id="currentPrice"
                value={formData.currentPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                Product Details
              </label>
              <textarea
                id="details"
                value={formData.details}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
              />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Features
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cashOnDelivery"
                    checked={features.cashOnDelivery}
                    onChange={() => handleFeatureChange('cashOnDelivery')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cashOnDelivery" className="ml-2 block text-sm text-gray-700">
                    Cash on Delivery
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowestPrice"
                    checked={features.lowestPrice}
                    onChange={() => handleFeatureChange('lowestPrice')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lowestPrice" className="ml-2 block text-sm text-gray-700">
                    Lowest Price
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fiveDayReturns"
                    checked={features.fiveDayReturns}
                    onChange={() => handleFeatureChange('fiveDayReturns')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fiveDayReturns" className="ml-2 block text-sm text-gray-700">
                    5-Day Returns
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="freeDelivery"
                    checked={features.freeDelivery}
                    onChange={() => handleFeatureChange('freeDelivery')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="freeDelivery" className="ml-2 block text-sm text-gray-700">
                    Free Delivery
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                id="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Home">Home</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price (₹)
              </label>
              <input
                type="number"
                id="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex cursor-pointer items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <Upload className="w-5 h-5 mr-2" />
            {loading ? 'Uploading...' : 'Upload Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
