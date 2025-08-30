"use client"

import { useAdvancedRecording } from '@/hooks/useAdvancedRecording';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, Pause, Square, RotateCcw, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';

export default function AdvancedRecorder({ onAudioReady }) {
  const { t } = useTranslation();
  const {
    isRecording,
    audioURL,
    recordingTime,
    rawRecordingTime,
    isProcessing,
    startRecording,
    stopRecording,
    resetRecording,
    hasRecording,
    getAudioBuffer
  } = useAdvancedRecording();

  const handleStartStop = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAudioReady = async () => {
    const buffer = await getAudioBuffer();
    if (buffer && onAudioReady) {
      onAudioReady(buffer, audioURL);
    }
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `recording-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Image src="/window.svg" alt="recorder" width={20} height={20} />
          {t("고급 음성 녹음기") || "Advanced Voice Recorder"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Status */}
        <div className="text-center">
          <div className={`text-2xl font-mono ${isRecording ? 'text-red-500' : 'text-gray-500'}`}>
            {recordingTime}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {isRecording ? (t("녹음 중...") || "Recording...") : 
             hasRecording ? (t("녹음 완료") || "Recording Complete") : 
             (t("녹음 대기") || "Ready to Record")}
          </div>
        </div>

        {/* Waveform Visualization Placeholder */}
        <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-gray-400 rounded-full transition-all duration-300 ${
                  isRecording ? 'animate-pulse' : ''
                }`}
                style={{
                  height: isRecording 
                    ? `${Math.random() * 40 + 10}px` 
                    : '10px',
                  animationDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={handleStartStop}
            disabled={isProcessing}
            className={`${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : isRecording ? (
              <Square className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            <span className="ml-2">
              {isRecording ? (t("중지") || "Stop") : (t("녹음") || "Record")}
            </span>
          </Button>

          {hasRecording && !isRecording && (
            <>
              <Button variant="outline" onClick={resetRecording}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("재설정") || "Reset"}
              </Button>
              
              <Button variant="outline" onClick={downloadRecording}>
                <Download className="w-4 h-4 mr-2" />
                {t("다운로드") || "Download"}
              </Button>
            </>
          )}
        </div>

        {/* Audio Playback */}
        {audioURL && (
          <div className="space-y-2">
            <audio 
              controls 
              src={audioURL} 
              className="w-full"
              style={{ height: '40px' }}
            />
            {onAudioReady && (
              <Button 
                onClick={handleAudioReady}
                className="w-full"
                variant="secondary"
              >
                {t("음성 사용하기") || "Use This Recording"}
              </Button>
            )}
          </div>
        )}

        {/* Recording Info */}
        {hasRecording && (
          <div className="text-xs text-gray-500 text-center space-y-1">
            <div>{t("길이") || "Duration"}: {recordingTime}</div>
            <div>{t("품질") || "Quality"}: 16kHz WAV</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}