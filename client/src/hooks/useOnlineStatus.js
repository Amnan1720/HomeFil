// ✅ IMPROVEMENT 5: Detects if user is online or offline
// Usage: const isOnline = useOnlineStatus();

import { useState, useEffect } from 'react';

export default function useOnlineStatus() {
  // Start with current browser online status
  var [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(function() {

    // Called when internet comes back
    function handleOnline() {
      setIsOnline(true);
    }

    // Called when internet disconnects
    function handleOffline() {
      setIsOnline(false);
    }

    // Listen for browser online/offline events
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup when component unmounts
    return function() {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };

  }, []);

  return isOnline;
}