import axios from 'axios'
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const Security = () => {

  const {token , backendUrl}= useContext(AppContext);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

  const newPassword = watch("newPassword");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try{
      const response= await axios.post(backendUrl + '/api/auth/update-password', data, {headers: {Authorization: `Bearer ${token}`}});
      if(response.data.success){
          toast.success(response.data.message);
          reset();
      }else{
          toast.error(response.data.message);
      }
    }catch(error){
        toast.error(error.response?.data?.message || 'Failed to update password');
    }
    setLoading(false);
  }
  
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
      </div>

      {/* Password Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
            <Lock size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Change Password</h3>
            <p className="text-xs text-gray-400">Choose a strong password with at least 8 characters.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrent ? 'text' : 'password'}
                {...register("currentPassword", { required: "Current password is required" })}
                className={`w-full h-11 px-4 pr-11 border rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all ${errors.currentPassword ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="Enter your current password"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
          </div>
          
          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <input 
                type={showNew ? 'text' : 'password'}
                {...register("newPassword", { 
                  required: "New password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" }
                })}
                className={`w-full h-11 px-4 pr-11 border rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all ${errors.newPassword ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="Enter your new password"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConfirm ? 'text' : 'password'}
                {...register("confirmPassword", { 
                  required: "Please confirm your password", 
                  validate: value => value === newPassword || "Passwords do not match"
                })}
                className={`w-full h-11 px-4 pr-11 border rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="Confirm your new password"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Info Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={18} className="text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-1">Security Tips</h4>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Use a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Avoid reusing passwords across multiple sites</li>
            <li>• Change your password regularly for better security</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Security