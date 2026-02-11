import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets.js'
import { useForm } from 'react-hook-form'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, navigate, backendUrl, token, setUser } = useContext(AppContext);

    const { register, reset, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
        mode: 'onChange'
    })
    const [previewImage, setPreviewImage] = useState(null);
    const [showPasswordPopUp, setShowPasswordPopUp] = useState(false);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deletePasswordError, setDeletePasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const createdAt = user?.createdAt ? new Date(user.createdAt) : null;

    // Fix: Only reset form once when user data is first loaded
    useEffect(() => {
        if (user && !isInitialized) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                bio: user.bio || '',
                profilePicture: null
            })
            setIsInitialized(true);
        }
    }, [user, reset, isInitialized])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size must be less than 2MB');
                return;
            }
            setPreviewImage(URL.createObjectURL(file));
            setValue("profilePicture", file);
        }
    }

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setValue("profilePicture", null);
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
    }

    // Step 1: Show password popup
    const onSubmit = (data) => {
        setShowPasswordPopUp(true);
    }

    // Step 2: Send data to backend
    const handleConfirmChanges = async (data) => {
        try {
            setLoading(true);

            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append('password', data.password);
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            if (data.bio) {
                formData.append('bio', data.bio);
            }
            
            // Only append image if user selected a new one
            if (data.profilePicture && data.profilePicture instanceof File) {
                formData.append('profilePicture', data.profilePicture);
            }

            const response = await axios.put(
                `${backendUrl}/api/auth/update-profile`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                // Update user context with new data
                setUser(response.data.updatedUser);
                
                // Clear preview image
                setPreviewImage(null);
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.value = '';

                toast.success('Profile updated successfully!');
            } else {
                toast.error(response.data.message || 'Failed to update profile');
            }

            setShowPasswordPopUp(false);

        } catch (error) {
            console.error('Update profile error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        if (user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                bio: user.bio || '',
                password: '',
                profilePicture: null
            })
            setPreviewImage(null);
            const fileInput = document.getElementById('fileInput');
            if (fileInput) fileInput.value = '';
        }
    }

    const handleClosePopup = () => {
        setShowPasswordPopUp(false);
        setValue("password", "");
    }

    // Delete account with password verification
    const handleConfirmDelete = async () => {
        if (!deletePassword) {
            setDeletePasswordError('Please enter your password');
            return;
        }

        try {
            setLoading(true);

            const response = await axios.delete(`${backendUrl}/api/auth/delete-account`, {
                data: { password: deletePassword },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Account deleted successfully');
                
                // Reset and close
                setShowDeletePopUp(false);
                setDeletePassword('');
                setDeletePasswordError('');
                
                // Navigate to login
                navigate('/login');
            } else {
                toast.error(response.data.message || 'Failed to delete account');  
                setShowDeletePopUp(false);
                setDeletePassword('');
                setDeletePasswordError('');             
            }
            
        } catch (error) {
            console.error('Delete account error:', error);
            const errorMessage = error.response?.data?.message || 'Invalid password';
            setDeletePasswordError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleCloseDeletePopup = () => {
        setShowDeletePopUp(false);
        setDeletePassword('');
        setDeletePasswordError('');
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">

            <form onSubmit={handleSubmit(showPasswordPopUp ? handleConfirmChanges : onSubmit)} className="space-y-8">

                {/* Profile Picture Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Profile Picture</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                            <p className="text-sm font-medium text-gray-800 mt-0.5">
                                {createdAt ? createdAt.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                }) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img
                                src={previewImage || user?.profilePicture || assets.user_icon}
                                alt="User Icon"
                                className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
                            />
                            {previewImage && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center text-xs"
                                    title="Remove image"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <div className="space-y-2">
                            <input
                                type="file"
                                id="fileInput"
                                onChange={handleImageChange}
                                hidden
                                accept="image/*"
                            />
                            <label
                                htmlFor="fileInput"
                                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                                Upload Image
                            </label>
                            <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                        </div>
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    {...register("firstName", { required: "First name is required" })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    {...register("lastName", { required: "Last name is required" })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                {...register("bio")}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Changes Password Popup */}
                {showPasswordPopUp && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Confirm Changes</h4>
                                <button
                                    type="button"
                                    onClick={handleClosePopup}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-5">Please enter your password to confirm changes to your profile.</p>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password", { required: "Password is required" })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={loading}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password.message}</p>
                                )}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClosePopup}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                        disabled={loading}
                                    >
                                        {loading ? 'Confirming...' : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* Delete Account Section */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
                <p className="text-sm text-gray-600 mb-4">Once you delete your account, all your data will be permanently removed. This action cannot be undone.</p>
                <button
                    type="button"
                    onClick={() => setShowDeletePopUp(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-100 transition-colors"
                    disabled={loading}
                >
                    <img src={assets.delete_icon} alt="delete icon" className="w-4 h-4" />
                    Delete Account
                </button>
            </div>

            {/* Delete Account Password Popup */}
            {showDeletePopUp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-red-600">Delete Account</h4>
                            <button
                                type="button"
                                onClick={handleCloseDeletePopup}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={loading}
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-5">
                            Are you sure you want to delete your account? This action is permanent and cannot be undone. Please enter your password to confirm.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={deletePassword}
                                onChange={(e) => {
                                    setDeletePassword(e.target.value);
                                    setDeletePasswordError('');
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${deletePasswordError ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={loading}
                            />
                            {deletePasswordError && (
                                <p className="text-sm text-red-600">{deletePasswordError}</p>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseDeletePopup}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors disabled:bg-red-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile