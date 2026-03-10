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
        <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">

            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your personal information and account settings.</p>
            </div>

            <form onSubmit={handleSubmit(showPasswordPopUp ? handleConfirmChanges : onSubmit)} className="space-y-6">

                {/* Profile Picture Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-gray-800">Profile Picture</h3>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Member Since</p>
                            <p className="text-xs font-semibold text-gray-700 mt-0.5">
                                {createdAt ? createdAt.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                }) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <img
                                src={previewImage || user?.profilePicture || assets.user_icon}
                                alt="User Icon"
                                className="w-20 h-20 rounded-2xl border-2 border-gray-100 object-cover ring-2 ring-white shadow-sm"
                            />
                            {previewImage && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-xs shadow-sm cursor-pointer"
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
                                className="inline-block px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                            >
                                Upload Image
                            </label>
                            <p className="text-[11px] text-gray-400">JPG, PNG or GIF. Max size 2MB.</p>
                        </div>
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-5">Personal Information</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                                <input
                                    type="text"
                                    {...register("firstName", { required: "First name is required" })}
                                    className={`w-full h-11 px-4 border rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all ${errors.firstName ? 'border-red-300' : 'border-gray-200'}`}
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                                <input
                                    type="text"
                                    {...register("lastName", { required: "Last name is required" })}
                                    className={`w-full h-11 px-4 border rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all ${errors.lastName ? 'border-red-300' : 'border-gray-200'}`}
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                            <textarea
                                {...register("bio")}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Changes Password Popup */}
                {showPasswordPopUp && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={handleClosePopup}>
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-7 w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-5">
                                <h4 className="text-lg font-bold text-gray-900">Confirm Changes</h4>
                                <button
                                    type="button"
                                    onClick={handleClosePopup}
                                    className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                    disabled={loading}
                                >
                                    <span className="text-gray-400 text-lg">✕</span>
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-5">Enter your password to confirm the profile changes.</p>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password", { required: "Password is required" })}
                                    className={`w-full h-11 px-4 border rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                                    disabled={loading}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClosePopup}
                                        className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 cursor-pointer"
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
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-red-600 mb-1.5">Delete Account</h3>
                <p className="text-xs text-gray-500 mb-4">Once you delete your account, all your data will be permanently removed. This action cannot be undone.</p>
                <button
                    type="button"
                    onClick={() => setShowDeletePopUp(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-all cursor-pointer"
                    disabled={loading}
                >
                    <img src={assets.delete_icon} alt="delete icon" className="w-4 h-4" />
                    Delete Account
                </button>
            </div>

            {/* Delete Account Password Popup */}
            {showDeletePopUp && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={handleCloseDeletePopup}>
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-7 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h4 className="text-lg font-bold text-red-600">Delete Account</h4>
                            <button
                                type="button"
                                onClick={handleCloseDeletePopup}
                                className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                disabled={loading}
                            >
                                <span className="text-gray-400 text-lg">✕</span>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            This action is permanent and cannot be undone. Enter your password to confirm.
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
                                className={`w-full h-11 px-4 border rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:bg-white transition-all ${deletePasswordError ? 'border-red-300' : 'border-gray-200'}`}
                                disabled={loading}
                            />
                            {deletePasswordError && (
                                <p className="text-xs text-red-500">{deletePasswordError}</p>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseDeletePopup}
                                    className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 transition-all disabled:opacity-50 cursor-pointer"
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