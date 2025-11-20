'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { logger } from '@/lib/logger';
import { useLocaleFile } from '@/lib/locales/client';

interface DiscordStatus {
  connected: boolean;
  username?: string;
  expired?: boolean;
  error?: string;
}

export function DiscordConnection() {
  const [status, setStatus] = useState<DiscordStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const locale = useLocaleFile('components/discord-connection');

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/auth/discord/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      logger.error('Failed to check Discord status', error instanceof Error ? error : new Error(String(error)));
      setStatus({ connected: false, error: 'Failed to check connection status' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleConnect = () => {
    // Redirect to Discord OAuth authorization
    window.location.href = '/api/auth/discord/authorize?returnTo=' +
      encodeURIComponent(window.location.pathname + window.location.search);
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const response = await fetch('/api/auth/discord/disconnect', {
        method: 'POST',
      });

      if (response.ok) {
        setStatus({ connected: false });
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      logger.error('Failed to disconnect Discord', error instanceof Error ? error : new Error(String(error)));
      alert('Failed to disconnect. Please try again.');
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <Card variant="surface">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
            <span className="text-gray-400">{locale.loading?.message || 'Checking Discord connection...'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status?.connected) {
    return (
      <Card variant="surface" className="border-green-600/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-600/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127a12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">{locale.connected?.title || 'Discord Connected'}</p>
                <p className="text-xs text-gray-400">
                  {(locale.connected?.username || '{username}').replace('{username}', status.username || '')}
                  {status.expired && <span className="text-yellow-400 ml-2">{locale.connected?.session_expired || '(Session expired)'}</span>}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
            >
              {disconnecting ? (locale.connected?.button?.loading || 'Disconnecting...') : (locale.connected?.button?.default || 'Disconnect')}
            </Button>
          </div>
          {status.expired && (
            <div className="mt-3 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
              <p className="text-xs text-yellow-400">
                {locale.connected?.expiration_warning?.title || 'Your Discord session has expired. Reconnect to continue receiving notifications.'}
              </p>
            </div>
          )}
          <div className="mt-3 p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg">
            <p className="text-xs text-purple-300">
              {locale.connected?.success_message || '✅ You\'re in the coaching server! My bot will DM you with session details and when your review is ready.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="surface">
      <CardContent className="py-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127a12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              {locale.disconnected?.title || 'Connect Your Discord Account'} <span className="text-red-400">{locale.disconnected?.required_indicator || '*'}</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              {locale.disconnected?.description || 'By connecting, you\'ll automatically join our coaching server. This is where all sessions take place and where my bot will DM you with updates about your reviews.'}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnect}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127a12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              {locale.disconnected?.button || 'Connect Discord'}
            </Button>
          </div>
        </div>
        <div className="p-3 mt-3 bg-purple-600/10 border border-purple-600/30 rounded-lg">
          <p className="text-xs text-purple-300">
            <strong>{locale.disconnected?.info?.title || 'What happens next:'}</strong> {locale.disconnected?.info?.description || 'You\'ll authorize our app, automatically join the coaching server, and then continue with your booking.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
