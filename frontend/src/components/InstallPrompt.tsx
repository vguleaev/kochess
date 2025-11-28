import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';

const getInitialDismissed = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DISMISSED_KEY) === 'true';
};

const getInitialInstalled = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(getInitialDismissed);
  const [isInstalled, setIsInstalled] = useState(getInitialInstalled);

  useEffect(() => {
    if (isDismissed || isInstalled) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.removeItem(DISMISSED_KEY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isDismissed, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    } else {
      setDeferredPrompt(null);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDeferredPrompt(null);
  };

  if (isInstalled || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background border border-border rounded-lg shadow-lg p-4 z-50">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-sm">Install Kochess</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Install our app for a better experience with offline support.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInstallClick} size="sm" className="flex-1">
            Install
          </Button>
          <Button onClick={handleDismiss} variant="outline" size="sm">
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
