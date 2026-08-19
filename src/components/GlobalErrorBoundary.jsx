import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-red-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-6 bg-red-50 p-4 rounded-lg font-mono text-sm text-left overflow-auto">
          {error.message}
        </p>
        <button 
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export const GlobalErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};
