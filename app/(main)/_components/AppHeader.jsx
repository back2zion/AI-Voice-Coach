import { UserButton } from '@/components/UserButton'
import Image from 'next/image'
import React from 'react'
import LanguageSelector from '@/components/LanguageSelector'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { Home, Mic, Target, Settings } from 'lucide-react'

function AppHeader() {
    const pathname = usePathname()
    const { t } = useTranslation()
    
    const navigationItems = [
        {
            href: '/dashboard',
            label: t('Dashboard'),
            icon: <Home className="w-4 h-4" />
        },
        {
            href: '/practice',
            label: t('Practice'),
            icon: <Mic className="w-4 h-4" />
        },
        {
            href: '/pitches',
            label: t('Pitches'),
            icon: <Target className="w-4 h-4" />
        },
        {
            href: '/settings',
            label: t('Settings'),
            icon: <Settings className="w-4 h-4" />
        }
    ]

    return (
        <div className='p-3 shadow-sm'>
            <div className='flex justify-between items-center mb-3'>
                <Link href='/dashboard' className='hover:opacity-75 transition-opacity'>
                    <Image src = {'/logo.svg'} alt='logo' 
                    width={60}
                    height={60}
                    />
                </Link>

                <div className='flex items-center gap-4'>
                    <ThemeToggle />
                    <LanguageSelector />
                    <UserButton />
                </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className='flex justify-center'>
                <div className='flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1'>
                    {navigationItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                pathname === item.href
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    )
}

export default AppHeader