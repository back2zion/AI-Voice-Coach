"use client"

import React, { useState, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { UserContext } from '@/app/_context/UserContext'
import { useTranslation } from '@/hooks/useTranslation'
import { toast } from 'sonner'
import { 
    User, 
    Volume2, 
    Globe, 
    Shield, 
    Bell, 
    Palette,
    Mic,
    Save,
    Trash2
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSelector from '@/components/LanguageSelector'

function SettingsPage() {
    const { userData, setUserData } = useContext(UserContext)
    const { t } = useTranslation()
    
    // Settings state
    const [settings, setSettings] = useState({
        notifications: true,
        autoRecord: false,
        voiceFeedback: true,
        saveRecordings: true,
        highQualityAudio: false,
        showTranscripts: true,
        autoSave: true,
        privacyMode: false
    })

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
        toast.success(t('Setting updated'))
    }

    const saveSettings = () => {
        // Save settings to localStorage or database
        localStorage.setItem('voice_coach_settings', JSON.stringify(settings))
        toast.success(t('Settings saved successfully!'))
    }

    const resetSettings = () => {
        setSettings({
            notifications: true,
            autoRecord: false,
            voiceFeedback: true,
            saveRecordings: true,
            highQualityAudio: false,
            showTranscripts: true,
            autoSave: true,
            privacyMode: false
        })
        toast.success(t('Settings reset to defaults'))
    }

    const clearData = () => {
        if (confirm(t('Are you sure you want to clear all data? This action cannot be undone.'))) {
            localStorage.removeItem('voice_coach_rooms')
            localStorage.removeItem('voice_coach_conversations')
            localStorage.removeItem('voice_coach_feedbacks')
            localStorage.removeItem('voice_coach_settings')
            toast.success(t('All data cleared successfully'))
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{t('Settings')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('Customize your AI Voice Coach experience')}
                </p>
            </div>

            <div className="space-y-6">
                {/* Profile Settings */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <User className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">{t('Profile Settings')}</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t('Display Name')}
                            </label>
                            <input
                                type="text"
                                value={userData?.displayName || 'Local User'}
                                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                                readOnly
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t('Current Plan')}
                            </label>
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                {userData?.subscriptionId ? t('Pro Plan') : t('Free Plan')}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t('Credits Remaining')}
                            </label>
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                {userData?.credits || 1000} {t('tokens')}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Audio Settings */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <Volume2 className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">{t('Audio Settings')}</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Voice Feedback')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Enable AI voice responses during conversations')}
                                </p>
                            </div>
                            <Switch
                                checked={settings.voiceFeedback}
                                onCheckedChange={(checked) => handleSettingChange('voiceFeedback', checked)}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('High Quality Audio')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Use higher quality audio processing (uses more bandwidth)')}
                                </p>
                            </div>
                            <Switch
                                checked={settings.highQualityAudio}
                                onCheckedChange={(checked) => handleSettingChange('highQualityAudio', checked)}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Auto Record')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Automatically start recording when session begins')}
                                </p>
                            </div>
                            <Switch
                                checked={settings.autoRecord}
                                onCheckedChange={(checked) => handleSettingChange('autoRecord', checked)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Display Settings */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <Palette className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">{t('Display Settings')}</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Theme')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Choose between light and dark mode')}
                                </p>
                            </div>
                            <ThemeToggle />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Language')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Select your preferred language')}
                                </p>
                            </div>
                            <LanguageSelector />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Show Transcripts')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Display real-time speech transcription')}
                                </p>
                            </div>
                            <Switch
                                checked={settings.showTranscripts}
                                onCheckedChange={(checked) => handleSettingChange('showTranscripts', checked)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Privacy Settings */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <Shield className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">{t('Privacy & Data')}</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Save Recordings')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Keep voice recordings for future review')}
                                </p>
                            </div>
                            <Switch
                                checked={settings.saveRecordings}
                                onCheckedChange={(checked) => handleSettingChange('saveRecordings', checked)}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Auto Save Sessions')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Automatically save conversation history')}
                                </p>
                            </div>
                            <Switch
                                checked={settings.autoSave}
                                onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Privacy Mode')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Don\'t save any personal data locally')}
                                </p>
                            </div>
                            <Switch
                                checked={settings.privacyMode}
                                onCheckedChange={(checked) => handleSettingChange('privacyMode', checked)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <Bell className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">{t('Notifications')}</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <label className="font-medium">{t('Enable Notifications')}</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('Get notified about practice reminders and updates')}
                                </p>
                            </div>
                            <Switch
                                checked={settings.notifications}
                                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex space-x-4 justify-center">
                    <Button 
                        onClick={saveSettings}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {t('Save Settings')}
                    </Button>
                    
                    <Button 
                        onClick={resetSettings}
                        variant="outline"
                        className="px-6 py-2"
                    >
                        <Mic className="w-4 h-4 mr-2" />
                        {t('Reset to Default')}
                    </Button>
                    
                    <Button 
                        onClick={clearData}
                        variant="destructive"
                        className="px-6 py-2"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('Clear All Data')}
                    </Button>
                </div>

                {/* Info Box */}
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>{t('Note:')}</strong> {t('Settings are saved locally in your browser. Some features may require microphone permissions to function properly.')}
                    </p>
                </Card>
            </div>
        </div>
    )
}

export default SettingsPage