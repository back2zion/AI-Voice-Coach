"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Mic, BookOpen, Brain, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';

export default function LandingPage() {
    const router = useRouter();
    const { t } = useTranslation();

    const handleGetStarted = () => {
      router.push('/dashboard');
    };

    return (
        <div className="flex flex-col min-h-screen dark:bg-gray-900">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-800">
                <Link href="/">
                    <div className="relative w-40 h-12">
                        <Image 
                            src="/logo.svg" 
                            alt={t("AI Voice Coach")} 
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <LanguageSelector />
                    <Button 
                        onClick={handleGetStarted}
                        className="px-6 py-2 bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-black text-white rounded-xl transition-transform hover:scale-105 shadow-lg cursor-pointer"
                    >
                        {t("Start Coaching")}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 px-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-[fadeIn_1s_ease-in]">
                            {t("Your Personal AI Voice Coach")}
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-300/90 max-w-3xl mx-auto">
                            {t("Master your speaking skills with real-time AI feedback. Perfect for interviews, presentations, language learning, and more.")}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button 
                                className="px-8 py-6 text-lg bg-white text-gray-800 rounded-xl hover:bg-gray-100 
                                transition-transform hover:scale-105 shadow-lg cursor-pointer"
                                onClick={handleGetStarted}
                            >
                                {t("Try Free Session")}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
                            {t("Enhance Your Speaking Skills")}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Real-time Feedback Card */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700/30 rounded-lg flex items-center justify-center mb-4">
                                    <Mic className="w-6 h-6 text-gray-700 dark:text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 dark:text-gray-100">{t("Real-time Analysis")}</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {t("Get instant feedback on your speech patterns, tone, and delivery with advanced AI processing.")}
                                </p>
                            </div>

                            {/* Practice Sessions Card */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700/30 rounded-lg flex items-center justify-center mb-4">
                                    <BookOpen className="w-6 h-6 text-gray-700 dark:text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 dark:text-gray-100">{t("Guided Practice")}</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {t("Choose from various coaching scenarios including interview prep, presentations, and language practice.")}
                                </p>
                            </div>

                            {/* AI Insights Card */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700/30 rounded-lg flex items-center justify-center mb-4">
                                    <Brain className="w-6 h-6 text-gray-700 dark:text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 dark:text-gray-100">{t("Smart Insights")}</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {t("Receive personalized improvement suggestions and track your progress over time.")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-16 px-4 bg-white dark:bg-gray-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6 dark:text-white">
                            {t("Ready to Improve Your Speaking Skills?")}
                        </h2>
                        <Button 
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-gradient-to-r from-gray-700 to-black text-white rounded-xl hover:from-gray-800 hover:to-black transition-transform hover:scale-105 shadow-lg cursor-pointer"
                        >
                            {t("Begin Your Journey")}
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="text-center py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Voice Coach. All rights reserved.
                <br />
                Made by Kwak Dooil
            </footer>
        </div>
    );
}
