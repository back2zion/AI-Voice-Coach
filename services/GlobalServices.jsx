import axios from "axios"
import OpenAI from "openai"
import { CoachingOptions } from "./Options";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
    dangerouslyAllowBrowser: true
  })

export const getToken=async()=>{
    const result=await axios.get('/api/getToken');
    return result.data;
}

export const AIModel=async(topic,coachingOption,lastTwoConversation)=>{

    const option=CoachingOptions.find((item)=>item.name==coachingOption);
    const PROMPT=(option.prompt).replace('{user_topic}',topic)

    const completion = await openai.chat.completions.create({
        model: "google/gemma-3-1b-it:free",
        messages: [
            {role:'assistant',content:PROMPT},
            ...lastTwoConversation
        ],
      })
      // console.log(completion.choices[0].message)
      return completion?.choices[0].message;
}

export const AIModelToGenerateFeedbackAndNotes=async(coachingOption,conversation)=>{

    const option=CoachingOptions.find((item)=>item.name==coachingOption);
    const PROMPT=(option.summeryPrompt);

    const completion = await openai.chat.completions.create({
        model: "google/gemma-3-1b-it:free",
        messages: [
            ...conversation,
            {role:'assistant',content:PROMPT},
        ],
      })
      // console.log(completion.choices[0].message)
      return completion?.choices[0].message;
}

export const ConvertTextToSpeech=async(text,expertName)=>{
    // Use browser's built-in Web Speech API for local TTS
    if ('speechSynthesis' in window) {
        return new Promise((resolve, reject) => {
            try {
                // Cancel any ongoing speech
                speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                
                // Map expert names to voice characteristics
                const voiceMap = {
                    '곽두일': { lang: 'ko-KR', name: 'male' },
                    '곽문이': { lang: 'ko-KR', name: 'female' },
                    '곽수경': { lang: 'ko-KR', name: 'female' },
                    // Legacy English names (backward compatibility)
                    'Joanna': { lang: 'en-US', name: 'female' },
                    'Matthew': { lang: 'en-US', name: 'male' },
                    'Amy': { lang: 'en-GB', name: 'female' },
                    'Brian': { lang: 'en-GB', name: 'male' }
                };
                
                const voiceConfig = voiceMap[expertName] || { lang: 'en-US', name: 'female' };
                utterance.lang = voiceConfig.lang;
                
                // Find the best matching voice
                const voices = speechSynthesis.getVoices();
                const langCode = voiceConfig.lang.split('-')[0];
                
                const selectedVoice = voices.find(voice => 
                    voice.lang.includes(voiceConfig.lang) && 
                    voice.name.toLowerCase().includes(voiceConfig.name)
                ) || voices.find(voice => 
                    voice.lang.includes(langCode)
                ) || voices.find(voice => 
                    voice.lang.includes('ko') // Prefer Korean voices
                ) || voices.find(voice => 
                    voice.lang.includes('en') // Fallback to English
                ) || voices[0];
                
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;
                
                utterance.onend = () => {
                    resolve('speech-completed');
                };
                
                utterance.onerror = (error) => {
                    console.log('Speech synthesis error:', error);
                    reject(error);
                };
                
                speechSynthesis.speak(utterance);
                
                // Return immediately for compatibility
                resolve('speech-started');
                
            } catch (error) {
                console.log('TTS Error:', error);
                reject(error);
            }
        });
    } else {
        console.log('Speech synthesis not supported');
        return null;
    }
}