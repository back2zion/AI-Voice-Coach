"use client"
import React from 'react'
import AppHeader from './_components/AppHeader'
import { useTranslation } from '@/hooks/useTranslation'

function DashboardLayout({children}) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className='flex-1 p-10 mt-14 md:px-20 lg:px-32 xl:px-56 2xl:px-72'>
            {children}
        </div>
        <footer className="text-center py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Voice Coach. All rights reserved.
            <br />
            Made by Kwak Dooil
        </footer>
    </div>
  )
}

export default DashboardLayout