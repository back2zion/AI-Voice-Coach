"use client"
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { AIModel, getToken } from '@/services/GlobalServices';
import { CoachingExpert } from '@/services/Options';
import { UserButton } from '@stackframe/stack';
import { RealtimeTranscriber } from 'assemblyai';
import { useQuery } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import ChatBox from './_components/ChatBox';
const RecordRTC = dynamic(() => import('recordrtc'), { ssr: false})
// import RecordRTC from 'recordrtc';

function DiscussionRoom() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    const [expert, setExpert] = useState();
    const [enableMic, setEnableMic] = useState(false);
    const recorder = useRef(null);
    const realtimeTranscriber = useRef(null);
    const stream = useRef(null);
    const [transcribe, setTranscribe] = useState('');
    const [conversation, setConversation] = useState([{
        role:'assistant',
        content:'Hi'
    },
    {
        role:'user',
        content:'Hello'
    }]);
    const [loading,setLoading] = useState(false);
    let silenceTimeout;
    let texts = {};
    
    useEffect(() => {
        if(DiscussionRoomData){
            const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
            console.log(Expert);
            setExpert(Expert);
        }
    }, [DiscussionRoomData]);

    const connectToServer = async () => {
        setEnableMic(true);
        setLoading(true);
        // Init Assembly AI
        realtimeTranscriber.current = new RealtimeTranscriber({
            token: await getToken(),
            sample_rate:16_000
        })

        realtimeTranscriber.current.on('transcript',async(transcript)=>{
            console.log(transcript);
            let msg = '';

            if (transcript.message_type=='FinalTranscript')
            {
                setConversation(prev=>[...prev,{
                    role:'user',
                    content:transcript.text
                }]);

                // Calling AI text Model to Get Response
                const lastTwoMsg=conversation.slice(-2);
                const aiResp=await AIModel(DiscussionRoomData.topic,
                    DiscussionRoomData.coachingOption,
                    lastTwoMsg
                );
                console.log(aiResp);
                setConversation(prev=>[...prev,aiResp])
            }

            texts[transcript.audio_start] = transcript.text;
            const keys=Object.keys(texts);
            keys.sort((a,b)=>a-b);

            for (const key of keys){
                if (texts[key]){
                    msg+=`${texts[key]}`
                }
            }

            setTranscribe(msg);
        })

        await realtimeTranscriber.current.connect();
        setLoading(false);
        if (typeof window !== "undefined" && typeof navigator !== "undefined") {
            try {
                // First, get the media stream
                const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.current = mediaStream;
                
                // Dynamically import RecordRTC
                const RecordRTCModule = await import('recordrtc');
                const RecordRTC = RecordRTCModule.default;
                
                if (!RecordRTC) {
                    throw new Error("Failed to load RecordRTC");
                }
                
                // Create the recorder instance
                recorder.current = new RecordRTC(mediaStream, {
                    type: 'audio',
                    mimeType: 'audio/webm;codecs=pcm',
                    recorderType: RecordRTC.StereoAudioRecorder,
                    timeSlice: 250,
                    desiredSampRate: 16000,
                    numberOfAudioChannels: 1,
                    bufferSize: 4096,
                    audioBitsPerSecond: 128000,
                    ondataavailable: async (blob) => {
                        if (!realtimeTranscriber.current) return;                        // Reset the silence detection timer on audio input
                        clearTimeout(silenceTimeout);
                        const buffer = await blob.arrayBuffer();
                        console.log(buffer);
                        realtimeTranscriber.current.sendAudio(buffer);
                        // Restart the silence detection timer
                        silenceTimeout = setTimeout(() => {
                            console.log("User stopped talking");
                            // Handle user stopped talking(eg., send the final transcript)
                        }, 2000);
                    },
                });
                
                // Start recording
                recorder.current.startRecording();
                
            } catch (err) {
                console.error("Error setting up recording:", err);
                setEnableMic(false);
                
                // Clean up any partial setup
                if (stream.current) {
                    stream.current.getTracks().forEach(track => track.stop());
                    stream.current = null;
                }
                recorder.current = null;
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (conversation[conversation.length - 1].role == 'user'){
                // Calling AI text Model to Get Response
                const lastTwoMsg = conversation.slice(-2);
                const aiResp = await AIModel(
                    DiscussionRoomData.topic,
                    DiscussionRoomData.coachingOption,
                    lastTwoMsg
                );
                console.log(aiResp);
                setConversation(prev => [...prev, aiResp])
            }
            
        }
        fetchData()
    }, [conversation])

    const disconnect = async(e) => {
        e.preventDefault();
        setLoading(true);
        // Fix: Check if realtimeTranscriber exists and properly close it
        if (realtimeTranscriber.current) {
            try {
                // https://www.assemblyai.com/docs/getting-started/real-time-transcription
                await realtimeTranscriber.current.close();
            } catch (err) {
                console.error("Error disconnecting from AssemblyAI:", err);
            }
        }
        
        if (recorder.current) {
            try {
                recorder.current.stopRecording(() => {
                    console.log("Recording stopped");
                    cleanupResources();
                });
            } catch (err) {
                console.error("Error stopping recording:", err);
                cleanupResources();
            }
        } else {
            cleanupResources();
        }
        setLoading(false);
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
                        <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
                            <UserButton />
                        </div>
                    </div>
                    <div className='mt-5 flex justify-center items-center cursor-pointer'>
                        {!enableMic ?
                            <Button className='cursor-pointer' onClick={connectToServer} disabled={loading}> {loading&&<Loader2Icon className='animate-spin' />} Connect</Button>
                            :
                            <Button className='cursor-pointer' variant='destructive' onClick={disconnect} disabled={loading}>
                                {loading&&<Loader2Icon className='animate-spin' />}
                                Disconnect</Button>
                        }
                    </div>
                </div>
                <div>
                    <ChatBox conversation={conversation} />
                </div>
            </div>

            <div>
                <h2>{transcribe}</h2>
            </div>
        </div>
    )
}

export default DiscussionRoom