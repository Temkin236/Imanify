import { useEffect, useState } from 'react';
import { Download, X, Chrome, Globe, Share2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Load dismissed state from localStorage
    const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      console.log('✅ PWA already installed');
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      console.log('🎉 beforeinstallprompt event fired!');
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully!');
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show button after 8 seconds on development (localhost)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost && !isDismissed) {
      const timer = setTimeout(() => {
        console.log('⏰ Dev mode: showing install button for testing');
        if (!deferredPrompt) {
          setShowButton(true);
        }
      }, 8000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        console.log('📱 Triggering install prompt...');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('User choice:', outcome);

        if (outcome === 'accepted') {
          console.log('✅ Installation accepted');
          handleDismiss();
        } else {
          console.log('❌ Installation dismissed');
        }
      } catch (error) {
        console.error('Error during install:', error);
      }
    } else {
      // Show installation guide instead of alert
      console.log('💡 Showing installation guide...');
      setShowGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowButton(false);
    setShowGuide(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if installed or dismissed
  if (isInstalled || !showButton || dismissed) {
    return null;
  }

  // Show installation guide card
  if (showGuide) {
    return (
      <div className="fixed bottom-28 right-4 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-2xl shadow-2xl p-5 sm:p-6 max-w-sm border border-emerald-400/30 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <h3 className="font-bold text-lg mb-4 pr-8 flex items-center gap-2">
            <Download size={22} />
            Install Imanify
          </h3>

          {/* Instructions by Browser */}
          <div className="space-y-3">
            {/* Chrome/Edge */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <Chrome size={18} className="text-blue-300" />
                Chrome / Edge
              </div>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Look for the <strong>install icon</strong> in the address bar (top right). Click it and confirm.
              </p>
            </div>

            {/* Firefox */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <Globe size={18} className="text-orange-300" />
                Firefox
              </div>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Tap the <strong>menu (⋮)</strong> → scroll down → tap <strong>Install</strong>
              </p>
            </div>

            {/* iOS */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <Share2 size={18} className="text-gray-200" />
                iOS (Safari)
              </div>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Tap <strong>Share (↗)</strong> → <strong>Add to Home Screen</strong> → tap <strong>Add</strong>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs text-emerald-100 flex items-center gap-2">
              ✓ Works offline • ✓ Instant access • ✓ No extra storage
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    );
  }

  // Show install button card
  return (
    <div className="fixed bottom-28 right-4 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl shadow-2xl p-4 sm:p-5 max-w-xs border border-emerald-400/30 backdrop-blur-sm">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-3 pr-8">
          <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
            <Download size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">Install Imanify</h3>
            <p className="text-emerald-100 text-xs mt-1">
              Quick access to prayer times & Quran on your home screen
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleInstallClick}
          className="w-full bg-white hover:bg-emerald-50 text-emerald-700 font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
        >
          <Download size={18} />
          <span>Install Now</span>
        </button>

        {/* Footer Text */}
        <p className="text-emerald-100 text-xs mt-3 text-center">
          💡 Works offline • No extra storage • Home screen shortcut
        </p>
      </div>
    </div>
  );
};

export default PWAInstallButton;
