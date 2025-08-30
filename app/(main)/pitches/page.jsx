"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Timer, Play, Square, RotateCcw, Trophy, Target } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { toast } from 'sonner'

function PitchesPage() {
    const { t } = useTranslation()
    const [selectedPitchType, setSelectedPitchType] = useState('elevator')
    const [customTopic, setCustomTopic] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60)
    const [timer, setTimer] = useState(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const pitchTypes = [
        {
            id: 'elevator',
            name: t('Elevator Pitch'),
            duration: 60,
            description: t('30-60 second introduction about yourself or your business'),
            prompt: t('Introduce yourself, your background, and what makes you unique. Keep it conversational and memorable.')
        },
        {
            id: 'product',
            name: t('Product Pitch'),
            duration: 120,
            description: t('2-minute pitch about a product or service'),
            prompt: t('Present a product/service: problem it solves, unique features, benefits, and call-to-action.')
        },
        {
            id: 'investor',
            name: t('Investor Pitch'),
            duration: 300,
            description: t('5-minute pitch to potential investors'),
            prompt: t('Cover: problem, solution, market opportunity, business model, traction, team, and funding needs.')
        },
        {
            id: 'sales',
            name: t('Sales Pitch'),
            duration: 180,
            description: t('3-minute sales presentation'),
            prompt: t('Focus on customer pain points, your solution\'s value proposition, and closing techniques.')
        },
        {
            id: 'custom',
            name: t('Custom Topic'),
            duration: 120,
            description: t('Practice pitching any topic of your choice'),
            prompt: t('Choose your own topic and practice delivering a compelling presentation.')
        }
    ]

    const selectedPitch = pitchTypes.find(p => p.id === selectedPitchType)

    const startPractice = async () => {
        if (selectedPitchType === 'custom' && !customTopic.trim()) {
            toast.error(t('Please enter a custom topic'))
            return
        }

        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true })
            
            setIsRecording(true)
            setIsCompleted(false)
            setTimeLeft(selectedPitch.duration)
            
            // Start countdown timer
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        setIsRecording(false)
                        setIsCompleted(true)
                        toast.success(t('Time\'s up! Great job!'))
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            
            setTimer(interval)
            toast.success(t('Practice started! Begin your pitch now.'))
            
        } catch (error) {
            toast.error(t('Could not access microphone'))
            console.error('Error accessing microphone:', error)
        }
    }

    const stopPractice = () => {
        if (timer) {
            clearInterval(timer)
            setTimer(null)
        }
        setIsRecording(false)
        setIsCompleted(true)
        toast.success(t('Practice completed!'))
    }

    const resetPractice = () => {
        if (timer) {
            clearInterval(timer)
            setTimer(null)
        }
        setIsRecording(false)
        setIsCompleted(false)
        setTimeLeft(selectedPitch?.duration || 60)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getTimeColor = () => {
        if (timeLeft > 30) return 'text-green-500'
        if (timeLeft > 10) return 'text-yellow-500'
        return 'text-red-500'
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{t('Pitch Practice')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('Perfect your pitch with timed practice sessions and structured feedback')}
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Pitch Selection */}
                <div className="lg:col-span-1">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">{t('Choose Pitch Type')}</h2>
                        
                        <div className="space-y-3">
                            {pitchTypes.map((pitch) => (
                                <button
                                    key={pitch.id}
                                    onClick={() => {
                                        setSelectedPitchType(pitch.id)
                                        resetPractice()
                                    }}
                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                        selectedPitchType === pitch.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="font-medium">{pitch.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                        <Timer className="w-4 h-4 mr-1" />
                                        {formatTime(pitch.duration)}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {pitch.description}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedPitchType === 'custom' && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">
                                    {t('Your Topic')}
                                </label>
                                <Textarea
                                    value={customTopic}
                                    onChange={(e) => setCustomTopic(e.target.value)}
                                    placeholder={t('Enter the topic you want to pitch about...')}
                                    className="h-20"
                                />
                            </div>
                        )}
                    </Card>
                </div>

                {/* Practice Area */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">{selectedPitch?.name}</h2>
                        
                        {/* Timer Display */}
                        <div className="text-center mb-6">
                            <div className={`text-6xl font-mono font-bold ${getTimeColor()}`}>
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                                {isRecording ? t('Time Remaining') : t('Practice Duration')}
                            </div>
                        </div>

                        {/* Practice Prompt */}
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h3 className="font-semibold mb-2">{t('Practice Prompt:')}</h3>
                            <p className="text-sm">
                                {selectedPitchType === 'custom' && customTopic 
                                    ? t('Practice your pitch about: ') + customTopic
                                    : selectedPitch?.prompt
                                }
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center space-x-4 mb-6">
                            {!isRecording ? (
                                <Button 
                                    onClick={startPractice}
                                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    {t('Start Practice')}
                                </Button>
                            ) : (
                                <Button 
                                    onClick={stopPractice}
                                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
                                >
                                    <Square className="w-5 h-5 mr-2" />
                                    {t('Stop Practice')}
                                </Button>
                            )}
                            
                            <Button 
                                onClick={resetPractice}
                                variant="outline"
                                className="px-6 py-3"
                            >
                                <RotateCcw className="w-5 h-5 mr-2" />
                                {t('Reset')}
                            </Button>
                        </div>

                        {/* Status */}
                        {isRecording && (
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-4">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-red-500 font-medium">{t('Recording in progress...')}</span>
                                </div>
                            </div>
                        )}

                        {isCompleted && (
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <h3 className="font-semibold text-green-700 dark:text-green-400">
                                    {t('Practice Completed!')}
                                </h3>
                                <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                                    {t('Great job! Consider practicing again to improve further.')}
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* Tips */}
                    <Card className="p-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4">{t('Pitch Tips')}</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            {[
                                {
                                    icon: <Target className="w-5 h-5 text-blue-500" />,
                                    tip: t('Start with a strong hook to grab attention')
                                },
                                {
                                    icon: <Timer className="w-5 h-5 text-green-500" />,
                                    tip: t('Practice within the time limit regularly')
                                },
                                {
                                    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
                                    tip: t('End with a clear call-to-action')
                                },
                                {
                                    icon: <Target className="w-5 h-5 text-purple-500" />,
                                    tip: t('Use concrete examples and numbers')
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    {item.icon}
                                    <span className="text-sm">{item.tip}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PitchesPage