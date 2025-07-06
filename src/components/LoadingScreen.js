import React from 'react';
import { Heart } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-bounce mb-4">
          <Heart className="w-16 h-16 text-white mx-auto" fill="currentColor" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Wedding Bells</h1>
        <p className="text-white/80">Loading your perfect planning experience...</p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
