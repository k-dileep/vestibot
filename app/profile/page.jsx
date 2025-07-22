'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';

// ImgBB API key
const IMGBB_API_KEY = "b88dd9410969cb75966c37e0ed8162cb";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUserProfile, logout } = useAuth();
  const router = useRouter();
  const [editForm, setEditForm] = useState({
    displayName: '',
    photoURL: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef(null);

  // Update form when user data is available
  useEffect(() => {
    if (user) {
      setEditForm({
        displayName: user.displayName || '',
        photoURL: user.profile?.photoURL || user.photoURL || ''
      });
      setImageLoadError(false); // Reset error on user change
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect is handled by the ProtectedRoute component
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        // This function updates both Auth (for displayName) and Firestore
        await updateUserProfile({ 
          displayName: editForm.displayName,
        });
        console.log("Profile updated successfully");
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  // Generate a consistent color based on user's email or name
  const generateColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#4F46E5', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', 
      '#EF4444', '#0EA5E9', '#8B5CF6', '#14B8A6', '#F97316',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get initials from name or email
  const getInitials = () => {
    if (user.displayName) {
      const nameParts = user.displayName.split(' ');
      return nameParts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : '';
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File size exceeds 2MB limit");
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadError(null);
      
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', file);
      
      const response = await fetch(`https://api.imgbb.com/1/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        const imageUrl = data.data.url;
        await updateUserProfile({ photoURL: imageUrl });
        setEditForm(prev => ({ ...prev, photoURL: imageUrl }));
        setImageLoadError(false);
      } else {
        setUploadError(data.error?.message || "Failed to upload image.");
      }
    } catch (error) {
      setUploadError(error.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const renderProfileImage = () => {
    const photoURL = editForm.photoURL || user?.profile?.photoURL || user?.photoURL;
    
    if (photoURL && !imageLoadError) {
      // Simple encoding for safety
      const safePhotoURL = photoURL.includes(' ') ? encodeURI(photoURL) : photoURL;
      return (
          <Image
            src={safePhotoURL}
            alt="Profile"
            width={128}
            height={128}
            className="object-cover w-full h-full"
            onError={() => setImageLoadError(true)}
            priority
          />
      );
    }
    
    return (
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: generateColor(user.email || 'user') }}
      >
        <span className="text-4xl font-bold text-white">{getInitials()}</span>
      </div>
    );
  };


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mt-[47px] bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-8">
          
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg group cursor-pointer"
                onClick={triggerFileInput}
              >
                {renderProfileImage()}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{editForm.displayName || user.displayName || 'User'}</h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
              {uploadError && <p className="text-sm text-red-500 mt-2 text-center">{uploadError}</p>}
            </div>

            {/* Edit Form / Profile Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleEdit} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-center">
                   <div className="text-center sm:text-left mb-4 sm:mb-0">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Details</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile information.</p>
                   </div>
                  <button
                    onClick={handleEdit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
               <div className="flex flex-col sm:flex-row justify-between items-center">
                   <div className="text-center sm:text-left mb-4 sm:mb-0">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Logout</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">End your current session.</p>
                   </div>
                  <button
                    onClick={handleLogout}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
              </div>
            </div>
          </div>
        </div>
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>
    </div>
  );
}
