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
      console.log(completion.choices[0].message)
      return completion.choices[0].message;
}