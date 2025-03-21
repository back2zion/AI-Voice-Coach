# AI Voice Coach

An intelligent voice coaching platform built with Next.js, Convex, and AWS Polly. AI Voice Coach leverages real-time transcription and AI-generated feedback to help users improve their skills by providing tailored voice interactions and personalized notes.

![Project Status](https://img.shields.io/badge/status-production--ready-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Deployment](https://img.shields.io/badge/deployment-cloud--ready-orange.svg)

![image](https://github.com/user-attachments/assets/ea320086-efc0-4385-a131-03794bdfc52f)

## Overview

AI Voice Coach empowers users with an interactive voice-assisted experience that includes:
- **Real-time Transcription:** Uses AssemblyAI for accurate, real-time speech-to-text conversion.
- **Personalized Feedback:** AI generates concise feedback and comprehensive notes based on user conversations.
- **Voice Synthesis:** AWS Polly converts AI responses into natural-sounding speech for seamless coaching sessions.

## Features

- **Live Voice Coaching:** Record, transcribe, and receive AI-generated insights during your coaching sessions.
- **Flexible Coaching Options:** Choose from multiple coaching themes such as mock interviews, Q&A practice, language learning, and meditation.
- **Interactive UI:** Modern, responsive interface built using Next.js, Tailwind CSS, and Radix UI.
- **Scalable Backend:** Powered by Convex for real-time data updates and secure user management.
- **Seamless Deployments:** Ready for cloud deployment with support for Vercel, Docker, or traditional hosting setups.

## Technology Stack

- **Frontend:**  
  - [Next.js](https://nextjs.org/) for server-rendered React applications  
  - [Tailwind CSS](https://tailwindcss.com/) for rapid, production-ready styling  
  - [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/) for accessible components  

- **Backend:**  
  - [Convex](https://www.convex.dev/) for scalable, real-time backend functionality  
  - [AssemblyAI](https://www.assemblyai.com/) for real-time speech transcription  
  - [AWS Polly](https://aws.amazon.com/polly/) for text-to-speech synthesis  

- **Other Libraries:**  
  - [OpenRouter](https://openrouter.ai/) powered OpenAI model for generating feedback  
  - [RecordRTC](https://recordrtc.org/) for browser-based audio recording  

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/ai-voice-coach.git
   cd ai-voice-coach
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env.local` file and add your environment variables:
   ```env
   NEXT_PUBLIC_CONVEX_URL=your_convex_public_url
   NEXT_PUBLIC_AI_OPENROUTER=your_openrouter_api_key
   NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key
   NEXT_PUBLIC_AWS_SECRET_KEY=your_aws_secret_key
   ASSEMBLY_API_KEY=your_assemblyai_api_key
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

### Production Build
1. **Build the Project**
   ```bash
   npm run build
   ```
2. **Start the Server**
   ```bash
   npm start
   ```
   
### Deployment Options
- **Vercel (Recommended)**
  ```bash
  npx vercel --prod
  ```
- **Docker**
  ```bash
  docker build -t ai-voice-coach:latest .
  docker run -p 3000:3000 ai-voice-coach:latest
  ```

3. **Deploy Convex Functions**
   ```bash
   npx convex deploy
   ```

## Scaling & Best Practices

- **Realtime Data & Caching:** Use Convex for real-time synchronization. Integrate memory caching for frequently accessed conversations.
- **Load Balancing:** For high traffic, consider deploying behind a CDN and load balancer.
- **Security:** JWT-based authentication, rate limiting, and input sanitization are implemented to ensure secure interactions.

![image](https://github.com/user-attachments/assets/233903ac-5a43-46b1-a27f-ad9096cbfe64)

## License

This project is licensed under the [MIT License](./LICENSE).

## Contributing

Contributions are welcome! Please fork the repository and open a pull request for any improvements or bug fixes.

## Support

If you have questions or need support, please contact [your-rahulsamantcoc2.com](mailto:your-rahulsamantcoc2.com) or open an issue in this repository.

---

AI Voice Coach is dedicated to empowering users with innovative voice technology to master their skills. Enjoy your coaching journey!
