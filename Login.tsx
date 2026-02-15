
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Eye, EyeOff, Loader2, ShieldCheck, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = 'Please enter your email/mobile number';
    } else if (!isOtpMode && !/\S+@\S+\.\S+/.test(email) && isNaN(Number(email))) {
      newErrors.email = 'Please enter a valid email or mobile number';
    }
    
    if (!isOtpMode) {
      if (!password) {
        newErrors.password = 'Please enter your password';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
        const dummyUser: User = {
          name: email.includes('@') ? email.split('@')[0] : 'User',
          email: email.includes('@') ? email : `${email}@example.com`,
          address: 'Default Address',
          orders: []
        };
        onLogin(dummyUser);
        setIsLoading(false);
        navigate(-1);
      }, 1200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-4 sm:my-10 bg-white flex flex-col md:flex-row shadow-2xl rounded-sm overflow-hidden min-h-[550px]">
      <div className="md:w-2/5 bg-gradient-to-br from-[#2874f0] to-[#1e5bbd] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">Login</h2>
          <p className="text-base sm:text-lg opacity-80">Welcome back to ShopSwift! Access your secure profile and saved preferences.</p>
        </div>
        
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="mt-8 flex flex-col items-center justify-center relative z-10 opacity-30">
           <div className="w-32 h-32 border-2 border-white/50 rounded-full flex items-center justify-center relative">
              <Lock size={48} className="text-white" />
              <div className="absolute -top-2 -right-2 bg-white text-[#2874f0] p-2 rounded-full shadow-lg">
                 <ShieldCheck size={20} />
              </div>
           </div>
           <p className="text-[10px] mt-4 font-bold tracking-widest uppercase">Safe & Secure Portal</p>
        </div>
      </div>

      <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: ''});
              }}
              className={`w-full bg-white text-black border-b-2 border-gray-200 py-3 outline-none transition-all focus:border-[#2874f0] text-sm sm:text-base placeholder:text-gray-400 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter Email/Mobile number"
            />
            {errors.email && <p className="text-red-500 text-[11px] font-medium mt-1 absolute">{errors.email}</p>}
          </div>

          {!isOtpMode && (
            <div className="relative pt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({...errors, password: ''});
                }}
                className={`w-full bg-white text-black border-b-2 border-gray-200 py-3 pr-10 outline-none transition-all focus:border-[#2874f0] text-sm sm:text-base placeholder:text-gray-400 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter Password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && <p className="text-red-500 text-[11px] font-medium mt-1 absolute">{errors.password}</p>}
              
              <div className="flex justify-end mt-2">
                <button type="button" className="text-[11px] font-bold text-[#2874f0] hover:underline">Forgot?</button>
              </div>
            </div>
          )}

          <div className="pt-4">
            <p className="text-[11px] text-gray-500 leading-relaxed mb-6">
              By continuing, you agree to ShopSwift's <button type="button" className="text-[#2874f0] hover:underline">Terms of Use</button> and <button type="button" className="text-[#2874f0] hover:underline">Privacy Policy</button>.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#fb641b] text-white py-3.5 rounded-sm font-bold shadow-lg hover:bg-[#ef5d13] active:scale-[0.98] transition-all uppercase text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isOtpMode ? 'Request OTP' : 'Login')}
            </button>
            
            <div className="mt-4">
               <button 
                type="button" 
                onClick={() => {
                  setIsOtpMode(!isOtpMode);
                  setErrors({});
                }}
                className="w-full bg-white text-[#2874f0] py-3 rounded-sm font-bold shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors uppercase text-sm"
              >
                {isOtpMode ? 'Use Password' : 'Login with OTP'}
              </button>
            </div>
          </div>

          <div className="pt-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <button type="button" className="flex items-center gap-3 px-6 py-2 border rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white font-bold">G</span>
              Sign in with Google
            </button>
            
            <Link to="/signup" className="text-[#2874f0] font-bold text-sm hover:underline mt-2">
              New to ShopSwift? Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
