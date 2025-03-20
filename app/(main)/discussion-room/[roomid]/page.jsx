"use client"
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import { UserButton } from '@stackframe/stack';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

function DiscussionRoom() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    const [expert, setExpert] = useState();
    const [enableMic, setEnableMic] = useState(false);
    const recorder = useRef(null);
    const stream = useRef(null);
    let silenceTimeout;
    
    useEffect(() => {
        if(DiscussionRoomData){
            const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
            console.log(Expert);
            setExpert(Expert);
        }
    }, [DiscussionRoomData]);

    const connectToServer = async () => {
        setEnableMic(true);
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
                        // Reset the silence detection timer on audio input
                        clearTimeout(silenceTimeout);
                        const buffer = await blob.arrayBuffer();
                        console.log(buffer);
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

    const disconnect = (e) => {
        e.preventDefault();
        
        if (recorder.current) {
            try {
                recorder.current.stopRecording(() => {
                    console.log("Recording stopped");
                    
                    // Optional: get the recording blob
                    // const blob = recorder.current.getBlob();
                    // console.log("Recording blob:", blob);
                    
                    // Clean up
                    cleanupResources();
                });
            } catch (err) {
                console.error("Error stopping recording:", err);
                cleanupResources();
            }
        } else {
            cleanupResources();
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
                        <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
                            <UserButton />
                        </div>
                    </div>
                    <div className='mt-5 flex justify-center items-center cursor-pointer'>
                        {!enableMic ?
                            <Button onClick={connectToServer}>Connect</Button>
                            :
                            <Button variant='destructive' onClick={disconnect}>Disconnect</Button>
                        }
                    </div>
                </div>
                <div>
                    <div>
                        <div className='h-[60vh] bg-secondary rounded-4xl
                        flex flex-col justify-center items-center relative
                        '>
                            <h2>Chat Section</h2>
                        </div>
                        <h2 className='mt-4 text-gray-500 text-sm'>At the end of your conversation we will automatically generate feedback/notes from your conversation</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiscussionRoom