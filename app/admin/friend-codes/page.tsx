'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { AdminTable, AdminTableRow, AdminTableCell } from '@/components/admin';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { logger } from '@/lib/logger';

interface FriendCode {
  id: string;
  code: string;
  description: string | null;
  maxUses: number | null;
  usesCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    submissions: number;
  };
}

export default function FriendCodesPage() {
  const [friendCodes, setFriendCodes] = useState<FriendCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<FriendCode | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    maxUses: '',
    expiresAt: '',
    isActive: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFriendCodes();
  }, []);

  const fetchFriendCodes = async () => {
    try {
      const response = await fetch('/api/admin/friend-codes');
      const data = await response.json();
      setFriendCodes(data.friendCodes || []);
    } catch (error) {
      logger.error('Error fetching friend codes:', error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      maxUses: '',
      expiresAt: '',
      isActive: true,
    });
    setFormError(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/friend-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.trim(),
          description: formData.description.trim() || null,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
          expiresAt: formData.expiresAt || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create friend code');
      }

      await fetchFriendCodes();
      setCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create friend code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCode) return;

    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/friend-codes/${selectedCode.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description.trim() || null,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
          expiresAt: formData.expiresAt || null,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update friend code');
      }

      await fetchFriendCodes();
      setEditDialogOpen(false);
      setSelectedCode(null);
      resetForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to update friend code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this friend code?')) return;

    try {
      const response = await fetch(`/api/admin/friend-codes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete friend code');
      }

      await fetchFriendCodes();
    } catch (error) {
      logger.error('Error deleting friend code:', error instanceof Error ? error : new Error(String(error)));
      alert('Failed to delete friend code');
    }
  };

  const openEditDialog = (code: FriendCode) => {
    setSelectedCode(code);
    setFormData({
      code: code.code,
      description: code.description || '',
      maxUses: code.maxUses?.toString() || '',
      expiresAt: code.expiresAt ? new Date(code.expiresAt).toISOString().slice(0, 16) : '',
      isActive: code.isActive,
    });
    setEditDialogOpen(true);
  };

  const getStatusBadge = (code: FriendCode) => {
    if (!code.isActive) {
      return <Badge variant="outline">Inactive</Badge>;
    }

    const now = new Date();
    const expiresAt = code.expiresAt ? new Date(code.expiresAt) : null;

    if (expiresAt && expiresAt < now) {
      return <Badge variant="error">Expired</Badge>;
    }

    if (code.maxUses && code.usesCount >= code.maxUses) {
      return <Badge variant="error">Max Uses Reached</Badge>;
    }

    return <Badge variant="success">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Friend Codes</h1>
          <p className="text-gray-400">Manage codes that allow friends to skip payment</p>
        </div>
        <Button variant="primary" onClick={() => setCreateDialogOpen(true)}>
          Create Friend Code
        </Button>
      </div>

      {friendCodes.length === 0 ? (
        <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No friend codes created yet</p>
          <Button variant="primary" onClick={() => setCreateDialogOpen(true)}>
            Create Your First Code
          </Button>
        </div>
      ) : (
        <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
          <AdminTable headers={['Code', 'Description', 'Uses', 'Expires', 'Status', 'Actions']}>
            {friendCodes.map((code) => (
              <AdminTableRow key={code.id}>
                <AdminTableCell>
                  <span className="font-mono font-semibold text-purple-400">{code.code}</span>
                </AdminTableCell>
                <AdminTableCell>
                  {code.description || <span className="text-gray-600">-</span>}
                </AdminTableCell>
                <AdminTableCell>
                  <span className="font-mono">
                    {code.usesCount}
                    {code.maxUses ? ` / ${code.maxUses}` : ' / ∞'}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  {code.expiresAt ? (
                    new Date(code.expiresAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  ) : (
                    <span className="text-gray-600">Never</span>
                  )}
                </AdminTableCell>
                <AdminTableCell>{getStatusBadge(code)}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditDialog(code)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(code.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-100">Create Friend Code</DialogTitle>
            <DialogDescription>
              Create a new code that allows friends to skip payment
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Code"
              name="code"
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="FRIEND2024"
              required
              className="font-mono uppercase"
            />

            <Input
              label="Description (optional)"
              name="description"
              inputType="textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Who is this code for?"
            />

            <Input
              label="Max Uses (optional, leave empty for unlimited)"
              name="maxUses"
              type="number"
              min="1"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
              placeholder="Leave empty for unlimited"
              helperText="How many times can this code be used?"
            />

            <Input
              label="Expires At (optional)"
              name="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              helperText="Leave empty for no expiration"
            />

            {formError && (
              <div className="text-red-400 text-sm">{formError}</div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setCreateDialogOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Code'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-100">Edit Friend Code</DialogTitle>
            <DialogDescription>
              Update the friend code settings
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
              <div className="font-mono font-bold text-purple-400 bg-[#1a1a2e] px-4 py-2 rounded border border-[#2a2a40]">
                {formData.code}
              </div>
            </div>

            <Input
              label="Description (optional)"
              name="description"
              inputType="textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Who is this code for?"
            />

            <Input
              label="Max Uses (optional, leave empty for unlimited)"
              name="maxUses"
              type="number"
              min="1"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
              placeholder="Leave empty for unlimited"
              helperText="How many times can this code be used?"
            />

            <Input
              label="Expires At (optional)"
              name="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              helperText="Leave empty for no expiration"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-[#1a1a2e] border-[#2a2a40] rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                Active (uncheck to disable this code)
              </label>
            </div>

            {formError && (
              <div className="text-red-400 text-sm">{formError}</div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedCode(null);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Code'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
