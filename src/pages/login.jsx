import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    const res = await login(data.email, data.password);
    
    if (res.success) {
      toast.success('Successfully logged in!');
      if (res.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/jobseeker/dashboard');
      }
    } else {
      setError(res.message);
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] animate-fade-in relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-50/50 via-white to-primary-100/30 -z-10" />
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 glass rounded-3xl animate-slide-up mt-8 mb-8 mx-4">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Sign in to your JobPortal account</p>
        </div>
        
        {error && (
          <div className="p-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="ml-1 text-sm text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className={`input-field ${errors.password ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="ml-1 text-sm text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-70 disabled:pointer-events-none mt-4"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-600 font-medium">
          Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;