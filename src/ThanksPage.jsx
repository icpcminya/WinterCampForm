import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ThanksPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Find existing canvas or create new one safely? 
        // Actually canvas-confetti creates its own canvas if not provided.
        // Let's just run it.

        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-lg animate-fade-in-up">
                <div className="glass-panel p-8 md:p-12 rounded-3xl relative text-center overflow-hidden">

                    {/* Decorative background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-500/20 blur-[60px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-600 mb-4">
                            Registration Successful!
                        </h2>

                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            Thank you for registering for <span className="text-amber-400 font-bold">ICPC Minya Winter Camp</span>.
                            We have received your information and will be in touch soon.
                        </p>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

                        <p className="text-slate-400 text-sm">
                            Good luck in the upcoming contests!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThanksPage;
