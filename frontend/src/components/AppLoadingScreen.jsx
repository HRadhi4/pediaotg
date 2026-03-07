import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Full-screen loading component shown during initial auth check/auto-login
 */
export const AppLoadingScreen = () => {
  return (
    <div className="min-h-screen gradient-bg-light dark:gradient-bg-dark flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden animate-pulse">
          <img src="/icon.svg" alt="PediaOTG" className="w-full h-full object-contain" />
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-[#00d9c5] mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-medium">Loading PediaOTG...</p>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
