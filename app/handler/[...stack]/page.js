"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Handler(props) {
  const router = useRouter();
  const { t } = useTranslation();
  
  useEffect(() => {
    // 로컬 개발 환경에서는 바로 대시보드로 리다이렉트
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl">{t("Redirecting to dashboard...")}</h1>
      </div>
    </div>
  );
}
