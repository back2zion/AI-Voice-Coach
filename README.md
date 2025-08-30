# AI Voice Coach

An intelligent voice coaching platform built with Next.js, Supabase, and AWS Polly. AI Voice Coach leverages browser-based speech recognition and AI-generated feedback to help users improve their skills by providing tailored voice interactions and personalized notes.

![Project Status](https://img.shields.io/badge/status-production--ready-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![Deployment](https://img.shields.io/badge/deployment-vercel--ready-orange.svg)

![image](https://github.com/user-attachments/assets/ea320086-efc0-4385-a131-03794bdfc52f)

## Overview

AI Voice Coach empowers users with an interactive voice-assisted experience that includes:
- **Real-time Transcription:** Uses Web Speech API for accurate, real-time speech-to-text conversion.
- **Personalized Feedback:** AI generates concise feedback and comprehensive notes based on user conversations.
- **Voice Synthesis:** AWS Polly converts AI responses into natural-sounding speech for seamless coaching sessions.

## Features

- **Live Voice Coaching:** Browser-based speech recognition for real-time transcription and AI-generated insights.
- **Flexible Coaching Options:** Choose from multiple coaching themes such as mock interviews, Q&A practice, language learning, and meditation.
- **Interactive UI:** Modern, responsive interface built using Next.js, Tailwind CSS, and custom components.
- **Scalable Backend:** Powered by Supabase for real-time data updates and secure user management.
- **Mobile Support:** Works on mobile devices with proper HTTPS deployment.
- **Seamless Deployments:** Ready for cloud deployment with Vercel integration.

## Technology Stack

- **Frontend:**  
  - [Next.js 15](https://nextjs.org/) for server-rendered React applications  
  - [Tailwind CSS](https://tailwindcss.com/) for rapid, production-ready styling  
  - [Radix UI](https://www.radix-ui.com/) for accessible components  
  - Web Speech API for browser-based speech recognition

- **Backend:**  
  - [Supabase](https://supabase.com/) for database, authentication, and real-time functionality  
  - [AWS Polly](https://aws.amazon.com/polly/) for text-to-speech synthesis  

- **Other Libraries:**  
  - [OpenRouter](https://openrouter.ai/) powered OpenAI model for generating feedback  
  - [Sonner](https://sonner.emilkowal.ski/) for toast notifications
  - Custom hooks for translation and authentication  

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/back2zion/AI-Voice-Coach.git
   cd AI-Voice-Coach
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env.local` file and add your environment variables:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenRouter AI Configuration
   NEXT_PUBLIC_AI_OPENROUTER=your_openrouter_api_key

   # AWS Polly Configuration
   NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key
   NEXT_PUBLIC_AWS_SECRET_KEY=your_aws_secret_key
   ```

3. **Set up Supabase Database**
   ```bash
   # Run the SQL schema in your Supabase SQL Editor
   # File: supabase/schema.sql
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the app.

   For network access (mobile testing):
   ```bash
   npm run dev  # Already configured with -H 0.0.0.0
   ```

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import the `AI-Voice-Coach` repository
   - Configure environment variables in Vercel dashboard
   - Deploy automatically

3. **Alternative: Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

### Environment Variables for Production
Make sure to add these environment variables in your Vercel project settings:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_AI_OPENROUTER`
- `NEXT_PUBLIC_AWS_ACCESS_KEY_ID`
- `NEXT_PUBLIC_AWS_SECRET_KEY`

### Production Build (Local)
```bash
npm run build
npm start
```

## Browser Support & Requirements

- **Speech Recognition:** Chrome, Safari, Edge (HTTPS required for production)
- **Mobile Support:** iOS Safari, Chrome for Android
- **HTTPS Required:** Voice features require secure connection in production
- **Microphone Permission:** Users must grant microphone access

## Scaling & Best Practices

- **Real-time Data:** Supabase handles real-time synchronization and caching automatically
- **CDN:** Vercel provides global CDN out of the box
- **Security:** Environment variables, HTTPS enforcement, and input sanitization implemented
- **Performance:** Next.js 15 with optimized builds and static generation where possible

![image](https://github.com/user-attachments/assets/233903ac-5a43-46b1-a27f-ad9096cbfe64)

## License

This project is licensed under the [MIT License](./LICENSE).

## Contributing

Contributions are welcome! Please fork the repository and open a pull request for any improvements or bug fixes.

## Support

If you have questions or need support, please open an issue in this repository or contact the development team.

## Live Demo

🚀 **Live Demo:** [https://ai-voice-coach.vercel.app](https://ai-voice-coach.vercel.app) *(Update with your actual Vercel URL)*

---

AI Voice Coach is dedicated to empowering users with innovative voice technology to master their skills. Enjoy your coaching journey!
