import React from 'react';
import { Wifi, RefreshCw } from 'lucide-react';

export const OfflineFallback = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="text-center space-y-4 py-12">
        <div className="flex justify-center">
          <Wifi size={48} className="text-white/40" strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-bold text-white">You're Offline</h2>
        <p className="text-white/60 max-w-sm">
          You appear to be offline. Some features may not work until you reconnect to the internet.
        </p>
        <p className="text-white/40 text-sm">
          Cached content will continue to load normally.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-islamic-green-950 rounded-lg font-semibold transition-colors"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default OfflineFallback;
