import { Button } from '@/components/ui/button'
// import { api } from '@/convex/_generated/api';
import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices'
// import { useMutation } from 'convex/react';
import { db } from '@/lib/supabase';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

function ChatBox({conversation,enableFeedbackNotes, coachingOption}) {

    const [loading,setLoading]=useState(false);
    // const updateSummary = useMutation(api.DiscussionRoom.UpdateSummery)
    const {roomid}=useParams();
    const { t } = useTranslation();
    
    const GenerateFeedbackNotes=async()=>{
        setLoading(true);
        try{
            const result = await AIModelToGenerateFeedbackAndNotes(coachingOption,conversation);
            console.log(result.content);
            
            // Update summary using Supabase
            await db.updateRoomSummary(roomid, result.content);
            
            setLoading(false);
            toast(t('Feedback/Notes Saved!'))
        }
        catch(e)
        {
            setLoading(false);
            toast(t('Internal server error, Try again!'))
        }
    }

    return (
        <div>
            <div className='h-[60vh] bg-secondary rounded-xl
            flex flex-col relative p-4 overflow-auto
            '>
                {/* <div> */}
                    {conversation.map((item, index)=>(
                        <div key={index} className={`flex ${item?.role == 'user' && 'justify-end'}`}>
                            {item?.role == 'assistant' ?
                                <h2 className='p-1 px-2 bg-primary mt-2 text-white inline-block rounded-md'>{item.content}</h2>
                                :
                                <h2 className='p-1 px-2 bg-gray-200 mt-2 inline-block rounded-md justify-end'>{item.content}</h2>
                            }
                        </div>
                    ))}
                {/* </div> */}
            </div>
            {!enableFeedbackNotes? <h2 className='mt-4 text-gray-500 text-sm'></h2>
            :<Button onClick={GenerateFeedbackNotes} disabled={loading} className='mt-7 w-full'>
                {loading&&<LoaderCircle className='animate-spin' />}
                {t('Generate Feedback/Notes')}</Button>}
        </div>
    )
}

export default ChatBox