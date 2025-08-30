"use client"
import { Button } from '@/components/ui/button';
// import { api } from '@/convex/_generated/api';
import { AIModel, ConvertTextToSpeech, getToken } from '@/services/GlobalServices';
import { CoachingExpert } from '@/services/Options';
import { UserButton } from '@/components/UserButton';
// Using browser's Web Speech API instead of AssemblyAI
// import { useMutation, useQuery } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatBox from './_components/ChatBox';
import { toast } from 'sonner';
import { UserContext } from '@/app/_context/UserContext';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/supabase';
// Using browser's Web Speech API for voice recognition

function DiscussionRoom() {
    const { roomid } = useParams();
    const {userData,setUserData} = useContext(UserContext);
    const { t } = useTranslation();
    // Mock discussion room data for local development
    const [DiscussionRoomData, setDiscussionRoomData] = useState(null);
    
    useEffect(() => {
        // Get room data from database
        const fetchRoomData = async () => {
            try {
                const roomData = await db.getDiscussionRoom(roomid);
                if (roomData) {
                    setDiscussionRoomData({
                        _id: roomData.id,
                        topic: roomData.topic,
                        coachingOption: roomData.coaching_option,
                        expertName: roomData.expert_name,
                        _creationTime: new Date(roomData.created_at).getTime()
                    });
                } else {
                    // Fallback data
                    setDiscussionRoomData({
                        _id: roomid,
                        topic: '기본 주제',
                        coachingOption: 'Topic Base Lecture',
                        expertName: 'Joanna',
                        _creationTime: Date.now()
                    });
                }
            } catch (error) {
                console.error('Error fetching room data:', error);
                // Fallback data
                setDiscussionRoomData({
                    _id: roomid,
                    topic: '기본 주제',
                    coachingOption: 'Topic Base Lecture',
                    expertName: 'Joanna',
                    _creationTime: Date.now()
                });
            }
        };

        if (roomid) {
            fetchRoomData();
        }
    }, [roomid]);
    const [expert, setExpert] = useState();
    const [enableMic, setEnableMic] = useState(false);
    const recorder = useRef(null);
    const realtimeTranscriber = useRef(null);
    const stream = useRef(null);
    const [transcribe, setTranscribe] = useState();
    const [conversation, setConversation] = useState([]);
    const [loading,setLoading] = useState(false);
    const [audioUrl,setAudioUrl]=useState();
    const [enableFeedbackNotes,setEnableFeedbackNotes] = useState(false);
    // const UpdateConversation=useMutation(api.DiscussionRoom.UpdateConversation);
    // const updateUserToken=useMutation(api.users.updateUserToken)
    let silenceTimeout;
    let waitForPause;
    let texts = {};
    
    useEffect(() => {
        if(DiscussionRoomData){
            const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
            console.log(Expert);
            setExpert(Expert);
        }
    }, [DiscussionRoomData]);

    const connectToServer = async () => {
        setLoading(true);
        
        try {
            // First request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission check
            
            // Use browser's Web Speech API
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                realtimeTranscriber.current = new SpeechRecognition();
                
                realtimeTranscriber.current.continuous = true;
                realtimeTranscriber.current.interimResults = true;
                realtimeTranscriber.current.lang = 'en-US';
                
                realtimeTranscriber.current.onresult = async (event) => {
                    let finalTranscript = '';
                    let interimTranscript = '';
                    
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                        } else {
                            interimTranscript += transcript;
                        }
                    }
                    
                    if (finalTranscript) {
                        setConversation(prev=>[...prev,{
                            role:'user',
                            content:finalTranscript
                        }]);
                        await updateUserTokenMethod(finalTranscript);// Update user generated TOKEN
                        setTranscribe('');
                    } else {
                        setTranscribe(interimTranscript);
                    }
                };
                
                realtimeTranscriber.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setLoading(false);
                    setEnableMic(false);
                    
                    switch (event.error) {
                        case 'not-allowed':
                            toast.error(t('Microphone access denied. Please allow microphone permission and try again.'));
                            break;
                        case 'no-speech':
                            toast.error(t('No speech detected. Please try speaking again.'));
                            break;
                        case 'audio-capture':
                            toast.error(t('Microphone not available. Please check your microphone connection.'));
                            break;
                        case 'network':
                            toast.error(t('Network error occurred. Please check your internet connection.'));
                            break;
                        default:
                            toast.error(t('Speech recognition error occurred: ') + event.error);
                    }
                };
                
                realtimeTranscriber.current.onend = () => {
                    if (enableMic) {
                        // Restart if mic is still enabled and it ended unexpectedly
                        setTimeout(() => {
                            if (realtimeTranscriber.current && enableMic) {
                                realtimeTranscriber.current.start();
                            }
                        }, 1000);
                    }
                };
                
                realtimeTranscriber.current.start();
                setLoading(false);
                setEnableMic(true);
                toast(t('Connected...'));
            } else {
                setLoading(false);
                toast.error(t('Speech recognition not supported in this browser'));
            }
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setLoading(false);
            
            if (error.name === 'NotAllowedError') {
                toast.error(t('Microphone access denied. Please allow microphone permission in your browser settings.'));
            } else if (error.name === 'NotFoundError') {
                toast.error(t('No microphone found. Please connect a microphone and try again.'));
            } else {
                toast.error(t('Failed to access microphone: ') + error.message);
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (conversation[conversation.length - 1]?.role == 'user'){
                // Calling AI text Model to Get Response
                const lastTwoMsg = conversation.slice(-8);
                const aiResp = await AIModel(
                    DiscussionRoomData.topic,
                    DiscussionRoomData.coachingOption,
                    lastTwoMsg
                    );
                const url=await ConvertTextToSpeech(aiResp.content,DiscussionRoomData.expertName);
                console.log(url);
                setAudioUrl(url);
                setConversation(prev => [...prev, aiResp]);
                await updateUserTokenMethod(aiResp.content); // Update AI generated TOKEN
            }
            
        }
        waitForPause = setTimeout(()=>{
            console.log('Wait...')
            fetchData()
        }, 500)
        console.log(conversation)
    }, [conversation])

    const disconnect = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Stop Web Speech API
            if (realtimeTranscriber.current) {
                try {
                    realtimeTranscriber.current.stop();
                } catch (err) {
                    console.error("Error stopping speech recognition:", err);
                }
            }
            
            cleanupResources();
            setEnableMic(false);
            toast(t('Disconnected!'))
            // Update conversation using Supabase
            await db.updateRoomConversation(DiscussionRoomData._id, conversation);
        } catch (err) {
            console.error("Error updating conversation:", err);
        } finally {
            setLoading(false);
            setEnableFeedbackNotes(true);
        }
    }

    const updateUserTokenMethod=async(text)=>{
        const tokenCount=text.trim()?text.trim().split(/\s+/).length:0
        const newCredits = Number(userData.credits || userData.tokens || 1000) - Number(tokenCount);
        
        // Update user credits using Supabase
        const result = await db.updateUserCredits(userData.id || userData._id, newCredits);
        
        if (result) {
            setUserData(prev=>({
                ...prev,
                credits: newCredits,
                tokens: newCredits // backward compatibility
            }));
        }
    }
    
    // Helper function to clean up resources
    const cleanupResources = () => {
        // Stop all tracks in the stream
        if (stream.current) {
            stream.current.getTracks().forEach(track => track.stop());
            stream.current = null;
        }
        
        recorder.current = null;
        setEnableMic(false);
    }
    
    return (
        <div className='-mt-12'>
            <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
            <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
                <div className='lg:col-span-2 '>
                    <div className='h-[60vh] bg-secondary rounded-4xl
                    flex flex-col justify-center items-center relative
                    '>
                        <Image src={expert?.avatar} alt='Avatar' 
                            width={200}
                            height={200}
                            className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'
                        />
                        <h2 className='text-gray-500'>{expert?.name}</h2>

                        <audio src={audioUrl} type='audio/mp3' autoPlay />
                        <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
                            <UserButton />
                        </div>
                    </div>
                    <div className='mt-5 flex justify-center items-center cursor-pointer'>
                        {!enableMic ?
                            <Button className='cursor-pointer' onClick={connectToServer} disabled={loading}> {loading&&<Loader2Icon className='animate-spin' />} {t('Connect')}</Button>
                            :
                            <Button className='cursor-pointer' variant='destructive' onClick={disconnect} disabled={loading}>
                                {loading&&<Loader2Icon className='animate-spin' />}
                                {t('Disconnect')}</Button>
                        }
                    </div>
                </div>
                <div>
                    <ChatBox conversation={conversation} 
                    enableFeedbackNotes={enableFeedbackNotes} 
                    coachingOption={DiscussionRoomData?.coachingOption}
                    />
                </div>
            </div>

            <div>
                <h2>{transcribe}</h2>
            </div>
        </div>
    )
}

export default DiscussionRoom