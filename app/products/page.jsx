'use client';

import { useState } from 'react';
import Link from 'next/link';
import productsData from '../../app/data/products.json';
import Footer from '../components/Footer';

export default function ProductPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Extract unique categories for the filter dropdown
  const categories = [...new Set(productsData.map(product => product.category))];

  // Filter products based on search term and category
  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Open modal with selected product
  const openModal = (product) => {
    setSelectedProduct(product);
  };

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col">
      {/* Responsive Header (Fixed) */}
      <div className="fixed top-[60px] md:top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Vestige Products</h1>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white w-full sm:w-auto"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Product Grid */}
      <div className="flex-1 mt-[124px] md:mt-[72px] bg-gray-50 dark:bg-gray-900 pt-[124px] md:pt-[72px] pb-[70px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 py-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                onClick={() => openModal(product)}
              >
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 h-14">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full truncate">
                      {product.category}
                    </span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">₹{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal (Fixed) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProduct.name}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Category</p>
                  <p className="text-gray-900 dark:text-white">{selectedProduct.category}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white">{selectedProduct.description}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Benefits</p>
                  <ul className="list-disc pl-5 text-gray-900 dark:text-white">
                    {selectedProduct.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Usage</p>
                  <p className="text-gray-900 dark:text-white">{selectedProduct.usage}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Recommended for</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProduct.symptoms.map((symptom, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedProduct.price}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Contact for Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>
    </div>
  );
} 