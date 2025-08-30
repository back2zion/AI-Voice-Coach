import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { CoachingExpert } from '@/services/Options'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
// import { useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/app/_context/UserContext'
import { useTranslation } from '@/hooks/useTranslation'
import { db } from '@/lib/supabase'
  

function UserInputDialog({children, coachingOption}) {
    const [selectedExpert, setSelectedExpert] = useState();
    const [topic, setTopic] = useState();
    // const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
    const [loading,setLoading]=useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const router=useRouter();
    const {userData}=useContext(UserContext);
    const { t } = useTranslation();

    const OnClickNext = async()=>{
        setLoading(true);
        
        try {
            // Create discussion room using database abstraction layer
            const roomData = {
                topic: topic,
                coaching_option: coachingOption?.name,
                expert_name: selectedExpert,
                user_id: userData?._id || userData?.id || 'local-user'
            };
            
            const roomId = await db.createDiscussionRoom(roomData);
            console.log('Created discussion room:', roomId, roomData);
            
            setLoading(false);
            setOpenDialog(false);
            router.push('/discussion-room/' + roomId);
        } catch (error) {
            console.error('Error creating room:', error);
            setLoading(false);
        }
    }

    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(coachingOption.name)}</DialogTitle>
            <DialogDescription asChild>
              <div className='mt-3'>
                  <h2 className='text-black'>{t('Enter a topic to master your skills in')} {t(coachingOption.name)}</h2>
                  <Textarea placeholder={t('Enter your topic here...')} className='mt-2' 
                    onChange={(e)=>setTopic(e.target.value)}
                  />
                  
                  {/* Show Advanced Recorder for Voice Recording option */}
                  {coachingOption.name === 'Voice Recording' && (
                    <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
                      <p className='text-sm text-blue-700'>
                        {t('고급 음성 녹음 기능이 곧 제공됩니다!') || 'Advanced voice recording feature coming soon!'}
                      </p>
                    </div>
                  )}
                  <h2 className='text-black mt-5'>{t('Select your coaching expert')}</h2>
                  <div className='grid grid-cols-3 md:grid-cols-5 gap-6 mt-3'>
                      {CoachingExpert.map((expert,index)=>(
                          <div key={index} onClick={()=>setSelectedExpert(expert.name)}>
                              <Image src={expert.avatar} alt={expert.name} 
                                  width={100}
                                  height={100}
                                  className={`${expert.avatarType === 'icon' 
                                    ? 'rounded-2xl h-[80px] w-[80px] p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700' 
                                    : 'rounded-2xl h-[80px] w-[80px] object-cover'
                                  } hover:scale-105 transition-all cursor-pointer border-2 
                                  ${selectedExpert==expert.name ? 'border-primary border-blue-500' : 'border-transparent'}
                                  `}
                              />
                              <h2 className='text-center'>{expert.name}</h2>
                          </div>
                      ))}
                  </div>
                  <div className='flex gap-5 justify-end mt-5'>
                    <DialogClose asChild>
                        <Button variant={'ghost'} className='cursor-pointer'>{t('Cancel')}</Button>
                    </DialogClose>
                    <Button disabled={(!topic || !selectedExpert || loading)} onClick={OnClickNext} className='cursor-pointer'>
                        {loading&&<LoaderCircle className='animate-spin' />}
                        {t('Next')}
                    </Button>
                  </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
}

export default UserInputDialog