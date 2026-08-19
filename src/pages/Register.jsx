import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(['jobseeker', 'employer']),
});

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'jobseeker'
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authService.register(data);
      
      // Redirect based on role
      toast.success('Account created successfully!');
      if (res.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/jobseeker/dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Create Account</h2>
        <p className="text-sm text-center text-gray-500">Join JobPortal to find your next opportunity</p>
        
        {error && (
          <div className="p-4 text-sm font-medium text-red-800 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-4 py-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">I am a...</label>
            <div className="flex gap-4">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-1/2">
                <input
                  type="radio"
                  value="jobseeker"
                  {...register('role')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Job Seeker</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-1/2">
                <input
                  type="radio"
                  value="employer"
                  {...register('role')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Employer</span>
              </label>
            </div>
            {errors.role && <p className="mt-1.5 text-sm text-red-500">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 text-white font-bold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all shadow-md"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
