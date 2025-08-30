import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Credits from './Credits'
import { useTranslation } from '@/hooks/useTranslation'
  

function ProfileDailog({children}) {
    const { t } = useTranslation();
    
    return (
        <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>{t('User Profile')}</DialogTitle>
            <DialogDescription asChild>
                <Credits />
            </DialogDescription>
        </DialogHeader>
    </DialogContent>
</Dialog>
  )
}

export default ProfileDailog