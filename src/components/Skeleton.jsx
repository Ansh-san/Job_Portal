import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 animate-pulse">
    <div className="h-6 bg-slate-800 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-slate-800 rounded w-1/2 mb-6"></div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-slate-800 rounded w-16"></div>
      <div className="h-6 bg-slate-800 rounded w-24"></div>
    </div>
    <div className="h-10 bg-slate-800 rounded w-full mt-4"></div>
  </div>
);

export const ListSkeleton = () => (
  <div className="p-4 border rounded-lg animate-pulse mb-4">
    <div className="h-5 bg-slate-800 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-slate-800 rounded w-1/4 mb-2"></div>
    <div className="h-3 bg-slate-800 rounded w-1/5"></div>
  </div>
);

export const TableSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-slate-800 rounded w-full"></div>
    <div className="h-10 bg-slate-800 rounded w-full"></div>
    <div className="h-10 bg-slate-800 rounded w-full"></div>
  </div>
);

export const JobDetailsSkeleton = () => (
  <div className="animate-pulse max-w-4xl mx-auto bg-slate-900 rounded-3xl shadow-xl overflow-hidden mt-10">
    <div className="bg-gray-300 p-8 sm:p-12 h-48"></div>
    <div className="p-8 sm:p-12 space-y-4">
      <div className="h-8 bg-slate-800 rounded w-1/3 mb-6"></div>
      <div className="h-4 bg-slate-800 rounded w-full"></div>
      <div className="h-4 bg-slate-800 rounded w-full"></div>
      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
      <div className="h-12 bg-slate-800 rounded w-32 mt-8"></div>
    </div>
  </div>
);
