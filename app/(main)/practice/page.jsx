"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Mic, Square, Volume2, Download } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { toast } from 'sonner'

function PracticePage() {
    const { t } = useTranslation()
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [recordingTime, setRecordingTime] = useState(0)
    const [timerInterval, setTimerInterval] = useState(null)

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const recorder = new MediaRecorder(stream)
            const audioChunks = []

            recorder.ondataavailable = (event) => {
                audioChunks.push(event.data)
            }

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
                setAudioBlob(audioBlob)
                stream.getTracks().forEach(track => track.stop())
            }

            recorder.start()
            setMediaRecorder(recorder)
            setIsRecording(true)
            setRecordingTime(0)

            // Start timer
            const interval = setInterval(() => {
                setRecordingTime(prev => prev + 1)
            }, 1000)
            setTimerInterval(interval)

            toast.success(t('Recording started'))
        } catch (error) {
            toast.error(t('Could not access microphone'))
            console.error('Error accessing microphone:', error)
        }
    }

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop()
            setIsRecording(false)
            
            if (timerInterval) {
                clearInterval(timerInterval)
                setTimerInterval(null)
            }
            
            toast.success(t('Recording stopped'))
        }
    }

    const playRecording = () => {
        if (audioBlob) {
            const audio = new Audio(URL.createObjectURL(audioBlob))
            
            audio.onended = () => {
                setIsPlaying(false)
            }
            
            audio.play()
            setIsPlaying(true)
            toast.success(t('Playing recording'))
        }
    }

    const downloadRecording = () => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob)
            const a = document.createElement('a')
            a.href = url
            a.download = `voice-practice-${new Date().getTime()}.wav`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast.success(t('Recording downloaded'))
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{t('Voice Practice Session')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('Record your voice, listen back, and improve your speaking skills')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recording Section */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{t('Voice Recording')}</h2>
                    
                    <div className="flex flex-col items-center space-y-4">
                        {/* Recording Status */}
                        <div className="text-center">
                            {isRecording && (
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-red-500 font-medium">{t('Recording...')}</span>
                                </div>
                            )}
                            
                            {isRecording && (
                                <div className="text-2xl font-mono mt-2">
                                    {formatTime(recordingTime)}
                                </div>
                            )}
                        </div>

                        {/* Recording Controls */}
                        <div className="flex space-x-4">
                            {!isRecording ? (
                                <Button 
                                    onClick={startRecording}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full"
                                >
                                    <Mic className="w-5 h-5 mr-2" />
                                    {t('Start Recording')}
                                </Button>
                            ) : (
                                <Button 
                                    onClick={stopRecording}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full"
                                >
                                    <Square className="w-5 h-5 mr-2" />
                                    {t('Stop Recording')}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Playback Section */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{t('Playback & Analysis')}</h2>
                    
                    {audioBlob ? (
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-green-600 dark:text-green-400 mb-4">
                                    {t('Recording ready for playback')}
                                </p>
                            </div>

                            <div className="flex justify-center space-x-3">
                                <Button 
                                    onClick={playRecording}
                                    disabled={isPlaying}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    {isPlaying ? t('Playing...') : t('Play')}
                                </Button>

                                <Button 
                                    onClick={downloadRecording}
                                    variant="outline"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {t('Download')}
                                </Button>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h3 className="font-semibold mb-2">{t('Practice Tips:')}</h3>
                                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                    <li>• {t('Listen for clarity and pace')}</li>
                                    <li>• {t('Check your pronunciation')}</li>
                                    <li>• {t('Notice any filler words')}</li>
                                    <li>• {t('Practice until you feel confident')}</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>{t('No recording yet. Start recording to begin practice!')}</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Practice Exercises */}
            <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">{t('Practice Exercises')}</h2>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            title: t('Tongue Twisters'),
                            description: t('Practice difficult pronunciation patterns')
                        },
                        {
                            title: t('Reading Aloud'),
                            description: t('Improve fluency and expression')
                        },
                        {
                            title: t('Impromptu Speaking'),
                            description: t('Build confidence in spontaneous speech')
                        },
                        {
                            title: t('Pronunciation Drills'),
                            description: t('Focus on specific sounds and accents')
                        },
                        {
                            title: t('Storytelling'),
                            description: t('Develop narrative and engaging delivery')
                        },
                        {
                            title: t('Presentation Practice'),
                            description: t('Perfect your public speaking skills')
                        }
                    ].map((exercise, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <h3 className="font-medium mb-2">{exercise.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.description}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default PracticePage