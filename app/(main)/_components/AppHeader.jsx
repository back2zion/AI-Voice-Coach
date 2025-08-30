import { UserButton } from '@/components/UserButton'
import Image from 'next/image'
import React from 'react'
import LanguageSelector from '@/components/LanguageSelector'
import ThemeToggle from '@/components/ThemeToggle'

function AppHeader() {
    return (
        <div className='p-3 shadow-sm flex justify-between items-center'>
            <Image src = {'/logo.svg'} alt='logo' 
            width={60}
            height={60}
            />

            <div className='flex items-center gap-4'>
                <ThemeToggle />
                <LanguageSelector />
                <UserButton />
            </div>
        </div>
    )
}

export default AppHeader