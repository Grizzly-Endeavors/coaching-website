'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { logger } from '@/lib/logger';

interface FriendCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionData: any;
  selectedTimeSlot: string | null;
}

export function FriendCodeDialog({
  open,
  onOpenChange,
  submissionData,
  selectedTimeSlot,
}: FriendCodeDialogProps) {
  const router = useRouter();
  const [friendCode, setFriendCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!friendCode.trim()) {
      setError('Please enter a friend code');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/friend-code/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendCode: friendCode.trim(),
          ...submissionData,
          scheduledAt: selectedTimeSlot || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Invalid friend code');
      }

      // Success! Redirect to success page without going through Stripe
      router.push(`/checkout/success?friend_code=true&submission_id=${data.submissionId}`);
    } catch (error) {
      logger.error('Error validating friend code:', error instanceof Error ? error : new Error(String(error)));
      setError(error instanceof Error ? error.message : 'Failed to validate friend code');
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setError(null);
      setFriendCode('');
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Enter Friend Code</DialogTitle>
          <DialogDescription>
            Have a code from a friend? Enter it below to skip payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Friend Code"
            name="friendCode"
            type="text"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
            error={error || undefined}
            placeholder="Enter your code"
            disabled={isSubmitting}
            autoFocus
            className="font-mono uppercase"
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Validating...' : 'Apply Code'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
