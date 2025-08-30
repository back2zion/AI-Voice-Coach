"use client"

import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

export function UserButton() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  if (!user?.isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <User className="w-4 h-4" />
        {user?.displayName || 'User'}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={signOut}
        className="flex items-center gap-2 text-red-600 hover:text-red-700"
      >
        <LogOut className="w-4 h-4" />
        {t('Sign Out') || '로그아웃'}
      </Button>
    </div>
  );
}