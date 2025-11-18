'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface DiscordConnectProps {
  returnTo?: string; // URL to return to after OAuth (default: current page)
  className?: string;
  onConnect?: (username: string) => void;
  onDisconnect?: () => void;
}

interface DiscordStatus {
  connected: boolean;
  username?: string;
  expired?: boolean;
}

export default function DiscordConnect({
  returnTo,
  className = '',
  onConnect,
  onDisconnect,
}: DiscordConnectProps) {
  const [discordStatus, setDiscordStatus] = useState<DiscordStatus>({ connected: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Check Discord connection status on mount
  useEffect(() => {
    checkDiscordStatus();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const discordConnected = searchParams.get('discord_connected');
    const discordError = searchParams.get('discord_error');

    if (discordConnected === 'true') {
      // Refresh status after successful OAuth
      checkDiscordStatus();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (discordError) {
      if (discordError === 'denied') {
        setError('You denied Discord authorization. Please try again if you want to receive notifications.');
      } else {
        setError('Failed to connect Discord. Please try again.');
      }
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  async function checkDiscordStatus() {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/discord/status');
      const data = await response.json();

      setDiscordStatus(data);

      if (data.connected && onConnect) {
        onConnect(data.username);
      }
    } catch (error) {
      console.error('Error checking Discord status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    setError(null);
    const currentPath = returnTo || window.location.pathname;
    window.location.href = `/api/auth/discord/authorize?returnTo=${encodeURIComponent(currentPath)}`;
  }

  async function handleDisconnect() {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/discord/disconnect', {
        method: 'POST',
      });

      if (response.ok) {
        setDiscordStatus({ connected: false });
        if (onDisconnect) {
          onDisconnect();
        }
      } else {
        setError('Failed to disconnect Discord');
      }
    } catch (error) {
      console.error('Error disconnecting Discord:', error);
      setError('Failed to disconnect Discord');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-400">Checking Discord connection...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-3 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {discordStatus.connected ? (
        <div className="flex items-center justify-between p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm font-medium">✓ Discord Connected</span>
                {discordStatus.expired && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-900/30 text-yellow-400 rounded border border-yellow-500/30">
                    Token expired
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{discordStatus.username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDisconnect}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white mb-1">
                Discord Notifications (Optional)
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Get notified on Discord when your review is ready. No need to share servers!
              </p>
              <button
                type="button"
                onClick={handleConnect}
                className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Connect Discord
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        By connecting Discord, you'll receive a DM when your replay review is complete.
      </p>
    </div>
  );
}
