import { UserContext } from '@/app/_context/UserContext'
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import { useUser } from '@/hooks/useAuth';
import { Wallet2 } from 'lucide-react';
// import Image from 'next/image';
import React, { useContext } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

function Credits() {
    const {userData}=useContext(UserContext);
    const user=useUser();
    const { t } = useTranslation();

    const CalculateProgress=()=>{
        const credits = userData?.credits || 1000;
        if (userData?.subscriptionId){
            return (Number(credits/50000))*100
        } else {
            return (Number(credits/5000))*100
        }
    }

    return (
        <div>
            <div className='flex gap-5 items-center'>
                <div className="w-15 h-15 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">{user?.displayName?.charAt(0) || 'U'}</span>
                </div>
                <div>
                    <h2 className='text-lg font-bold'>{user?.displayName}</h2>
                    <h2 className='text-gray-500'>{user?.primaryEmail}</h2>
                </div>
            </div>
            <hr className='my-3' />
            <div>
                <h2 className='font-bold'>{t('Token Usage')}</h2>
                <h2>{userData?.credits || 1000}/{userData?.subscriptionId?'50,000':'5000'}</h2>
                <div className="w-full bg-gray-200 rounded-full h-2 my-3">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${CalculateProgress()}%`}}></div>
                </div>

                <div className='flex justify-between items-center mt-3'>
                    <h2 className='font-bold'>{t('Current Plan')}</h2>
                    <h2 className='p-1 bg-secondary rounded-lg px-2'>
                        
                    {userData?.subscriptionId ? t('Pro Plan') : t('Free Plan')}</h2>
                </div>

                <div className='mt-5 p-5 border rounded-2xl'>
                    <div className='flex justify-between'>
                        <div>
                            <h2 className='font-bold'>{t('Pro Plan')}</h2>
                            <h2>50,000 {t('Tokens')}</h2>
                        </div>
                        <h2 className='font-bold'>{t('$10/Month')}</h2>
                    </div>
                    <hr className='my-3'/>
                    <Button className='w-ful cursor-pointer'> <Wallet2/> {t('Upgrade $10')}</Button>
                </div>
            </div>
        </div>
    )
}

export default Credits