import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(['jobseeker', 'employer']),
});

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'jobseeker'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    const res = await signup(data);
    
    if (res.success) {
      toast.success('Account created successfully!');
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
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] animate-fade-in relative py-10">
      <div className="absolute inset-0 bg-gradient-to-tl from-primary-50/50 via-slate-900 to-primary-100/30 -z-10" />
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 glass rounded-3xl animate-slide-up mx-4">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Create Account</h2>
          <p className="text-slate-400 font-medium">Join JobPortal to find your next opportunity</p>
        </div>
        
        {error && (
          <div className="p-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-300 ml-1">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="John Doe"
            />
            {errors.name && <p className="ml-1 text-sm text-red-500 font-medium">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-300 ml-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="ml-1 text-sm text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-300 ml-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className={`input-field ${errors.password ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="ml-1 text-sm text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-sm font-semibold text-slate-300 ml-1">I am a...</label>
            <div className="flex gap-4">
              <label className="flex items-center p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors w-1/2">
                <input
                  type="radio"
                  value="jobseeker"
                  {...register('role')}
                  className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-semibold text-slate-300">Job Seeker</span>
              </label>
              <label className="flex items-center p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors w-1/2">
                <input
                  type="radio"
                  value="employer"
                  {...register('role')}
                  className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-semibold text-slate-300">Employer</span>
              </label>
            </div>
            {errors.role && <p className="ml-1 text-sm text-red-500 font-medium">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-70 disabled:pointer-events-none mt-4"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-400 font-medium">
          Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
