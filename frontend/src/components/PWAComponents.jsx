import React from 'react';
import { Download, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall, useSWUpdate, useOnlineStatus } from '@/hooks/usePWA';

/**
 * Install App Button - Shows when the app can be installed
 */
export function PWAInstallButton({ variant = "outline", size = "sm", className = "" }) {
  const { canInstall, promptInstall } = usePWAInstall();

  if (!canInstall) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={promptInstall}
      className={`gap-2 ${className}`}
      data-testid="pwa-install-button"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Install App</span>
    </Button>
  );
}

/**
 * Update Available Banner - Shows when a new version is available
 */
export function PWAUpdateBanner() {
  const { updateAvailable, applyUpdate } = useSWUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 
                 bg-[#00d9c5] text-slate-900 rounded-lg shadow-lg p-4 
                 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4"
      data-testid="pwa-update-banner"
    >
      <div className="flex items-center gap-3">
        <RefreshCw className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-sm">Update Available</p>
          <p className="text-xs opacity-80">Click to refresh and get the latest version</p>
        </div>
      </div>
      <Button
        size="sm"
        variant="secondary"
        onClick={applyUpdate}
        className="flex-shrink-0 bg-slate-900 text-white hover:bg-slate-800"
      >
        Update
      </Button>
    </div>
  );
}

/**
 * Offline Indicator - Shows when the app is offline
 */
export function OfflineIndicator({ className = "" }) {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-600 
                  rounded-full text-xs font-medium ${className}`}
      data-testid="offline-indicator"
    >
      <WifiOff className="h-3.5 w-3.5" />
      <span>Offline</span>
    </div>
  );
}

/**
 * Combined PWA Status component for use in headers/navbars
 */
export function PWAStatus({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <OfflineIndicator />
      <PWAInstallButton />
    </div>
  );
}
