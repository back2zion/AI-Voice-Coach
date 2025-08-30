'use client'
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
// import { api } from '@/convex/_generated/api';
import { CoachingOptions } from '@/services/Options';
// import { useConvex } from 'convex/react'
import { db } from '@/lib/supabase';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

function History() {

  const {userData}=useContext(UserContext);
  const { t } = useTranslation();
  const [discussionRoomList,setDiscussionRoomList]=useState([]);

  useEffect(()=>{
    userData&&GetDiscussionRooms();
  },[userData])
  
  const GetDiscussionRooms=async()=>{
    try {
      const result = await db.getUserDiscussionRooms(userData?.id || userData?._id);
      console.log('History rooms:', result);
      
      // Transform data to match expected format
      const transformedRooms = result.map(room => ({
        _id: room.id,
        topic: room.topic,
        coachingOption: room.coaching_option,
        expertName: room.expert_name,
        _creationTime: new Date(room.created_at).getTime()
      }));
      
      setDiscussionRoomList(transformedRooms);
    } catch (error) {
      console.error('Error fetching discussion rooms:', error);
      setDiscussionRoomList([]);
    }
  }

  const GetAbstractImages = (option)=>{
    const coachingOption=CoachingOptions.find((item)=>item.name==option)

    return coachingOption?.abstract??'/ab1.png';
  }

  return (
    <div>
      <h2 className='font-bold text-xl'>{t('Your Previous Lectures')}</h2>
      {discussionRoomList?.length==0&&<h2 className='text-gray-400'>{t("You don't have any previous lectures")}</h2>}
      <div className='mt-5'>
        {discussionRoomList.map((item, index)=> (item.coachingOption=='Topic Base Lecture'||item.coachingOption=='Learn Language'||item.coachingOption=='Meditation')&&
        (
          <div key={index} className='border-b-[1px] pb-3 mb-4 group flex justify-between items-center cursor-pointer'>
            <div className='flex gap-7 items-center'>
              <Image src={GetAbstractImages(item.coachingOption)} alt='abstract'
              width={70}
              height={70}
              className='rounded-full h-[50px] w-[50px]'
              />
              <div>
                <h2 className='font-bold'>{item.topic}</h2>
                <h2 className='text-gray-400'>{t(item.coachingOption)}</h2>
                <h2 className='text-gray-400 text-sm'>{moment(item._creationTime).fromNow()}</h2>
              </div>
            </div>
            <Link href={'/view-summery/'+item._id}>
              <Button variant='outline' className='invisible group-hover:visible cursor-pointer flex items-center gap-2'>
                <Image src='/file.svg' alt='file' width={16} height={16} />
                {t('View Notes')}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History