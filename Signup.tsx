
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Eye, EyeOff, Loader2, ShieldCheck, UserPlus } from 'lucide-react';

interface SignupProps {
  onSignup: (user: User) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email/Mobile is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && isNaN(Number(formData.email))) {
      newErrors.email = 'Invalid email or mobile format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 characters required';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length > 7) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
        const newUser: User = {
          name: formData.name,
          email: formData.email,
          address: 'Default Address',
          orders: []
        };
        onSignup(newUser);
        setIsLoading(false);
        navigate('/');
      }, 1500);
    }
  };

  const strength = getPasswordStrength();
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  return (
    <div className="max-w-4xl mx-auto my-4 sm:my-10 bg-white flex flex-col md:flex-row shadow-2xl rounded-sm overflow-hidden min-h-[600px]">
      <div className="md:w-2/5 bg-gradient-to-br from-[#2874f0] to-[#1e5bbd] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">Looks like you're new here!</h2>
          <p className="text-base sm:text-lg opacity-80">Sign up with your details to join India's fastest shopping community.</p>
        </div>

        <div className="absolute top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="mt-8 flex flex-col items-center justify-center relative z-10 opacity-30">
           <div className="w-32 h-32 border-2 border-white/50 rounded-full flex items-center justify-center relative">
              <UserPlus size={48} className="text-white" />
              <div className="absolute -top-2 -right-2 bg-white text-[#2874f0] p-2 rounded-full shadow-lg">
                 <ShieldCheck size={20} />
              </div>
           </div>
           <p className="text-[10px] mt-4 font-bold tracking-widest uppercase">Start Your Journey</p>
        </div>
      </div>

      <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (errors.name) setErrors({...errors, name: ''});
              }}
              className={`w-full bg-white text-black border-b-2 border-gray-200 py-3 outline-none transition-all focus:border-[#2874f0] text-sm sm:text-base placeholder:text-gray-400 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter Full Name"
            />
            {errors.name && <p className="text-red-500 text-[11px] font-medium mt-1 absolute">{errors.name}</p>}
          </div>

          <div className="relative pt-2">
            <input
              type="text"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if (errors.email) setErrors({...errors, email: ''});
              }}
              className={`w-full bg-white text-black border-b-2 border-gray-200 py-3 outline-none transition-all focus:border-[#2874f0] text-sm sm:text-base placeholder:text-gray-400 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter Email/Mobile number"
            />
            {errors.email && <p className="text-red-500 text-[11px] font-medium mt-1 absolute">{errors.email}</p>}
          </div>

          <div className="relative pt-2">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                if (errors.password) setErrors({...errors, password: ''});
              }}
              className={`w-full bg-white text-black border-b-2 border-gray-200 py-3 pr-10 outline-none transition-all focus:border-[#2874f0] text-sm sm:text-base placeholder:text-gray-400 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Set Password"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-5 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-[11px] font-medium mt-1 absolute">{errors.password}</p>}
            
            {formData.password && (
              <div className="mt-2 flex gap-1 h-1">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step} 
                    className={`flex-1 rounded-full transition-colors ${strength >= step ? strengthColors[strength] : 'bg-gray-100'}`}
                  ></div>
                ))}
              </div>
            )}
          </div>

          <div className="relative pt-2">
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({...formData, confirmPassword: e.target.value});
                if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
              }}
              className={`w-full bg-white text-black border-b-2 border-gray-200 py-3 outline-none transition-all focus:border-[#2874f0] text-sm sm:text-base placeholder:text-gray-400 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-[11px] font-medium mt-1 absolute">{errors.confirmPassword}</p>}
          </div>

          <div className="pt-4">
             <div className="bg-gray-50 p-3 rounded-sm flex items-start gap-3 mb-6">
                <ShieldCheck className="text-green-600 shrink-0" size={18} />
                <p className="text-[10px] text-gray-500">Your information is protected with ShopSwift's industry-standard encryption protocols.</p>
             </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#fb641b] text-white py-3.5 rounded-sm font-bold shadow-lg hover:bg-[#ef5d13] active:scale-[0.98] transition-all uppercase text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Continue'}
            </button>
            
            <Link to="/login" className="w-full bg-white text-[#2874f0] block py-3 rounded-sm font-bold shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors uppercase text-sm text-center mt-4">
              Existing User? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
