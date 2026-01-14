import { useNavigate } from 'react-router-dom';
import { UserPlus, Layers, Code, ChevronRight } from 'lucide-react';
import logo from './assets/logo.png';

const CategorySelection = () => {
    const navigate = useNavigate();

    const handleSelect = (id) => {
        if (id === 'Newcomers') navigate('/newcomers');
        else if (id === 'Phase 1') navigate('/phase1');
        else if (id === 'Phase 2') navigate('/phase2');
    };
    const categories = [
        {
            id: 'Newcomers',
            title: 'Newcomers',
            icon: UserPlus,
            color: 'from-blue-500 to-cyan-400',
            glow: 'bg-blue-500/20'
        },
        {
            id: 'Phase 1',
            title: 'Phase 1',
            icon: Layers,
            color: 'from-purple-500 to-pink-400',
            glow: 'bg-purple-500/20'
        },
        {
            id: 'Phase 2',
            title: 'Phase 2',
            icon: Code,
            color: 'from-amber-500 to-orange-400',
            glow: 'bg-amber-500/20'
        }
    ];

    return (
        <div className="w-full max-w-5xl animate-fade-in-up">
            <div className="glass-panel p-3 md:p-12 rounded-3xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-[80px] pointer-events-none"></div>

                {/* Header Section */}
                <div className="text-center mb-5 md:mb-16 relative z-10">
                    <div className="relative inline-block mb-4 md:mb-6 group">
                        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full group-hover:bg-gold/30 transition-all duration-500"></div>
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-24 h-auto relative z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center text-center mb-4 md:mb-12 relative z-10">
                        <span className="text-xs md:text-sm font-bold text-slate-500 tracking-[0.4em] uppercase mb-3 px-4 py-1 rounded-full border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm">
                            Welcome to
                        </span>

                        <HeaderTitle />
                    </div>
                    <p className="text-slate-400 text-lg font-light tracking-wide max-w-2xl mx-auto">
                        Please select your level to proceed to the registration form.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 relative z-10">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleSelect(category.id)}
                            className="group relative flex flex-col items-center text-center p-5 md:p-8 rounded-2xl bg-slate-800/30 border border-white/5 hover:border-white/10 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Hover Glow */}
                            <div className={`absolute inset-0 ${category.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>

                            {/* Icon */}
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.color} p-3 md:p-4 mb-3 md:mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative z-10 flex items-center justify-center`}>
                                <category.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-6 relative z-10">{category.title}</h3>

                            {/* Action Indicator */}
                            <div className="mt-auto flex items-center gap-2 text-sm font-medium text-slate-300 group-hover:text-white transition-colors relative z-10 group-active:text-white">
                                <span>Register Now</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HeaderTitle = () => (
    <div className="relative flex flex-col items-center animate-fade-in-up">
        <h2 className="text-4xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-sm tracking-tighter mb-2 relative z-10">
            ICPC MINYA
        </h2>
        <h2 className="text-2xl md:text-6xl font-extrabold tracking-tight drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] relative z-10">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-200">WINTER</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 ml-2 md:ml-4">CAMP</span>
        </h2>

        {/* Enhanced Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-500/10 blur-[100px] -z-10 rounded-full pointer-events-none animate-pulse-slow"></div>
    </div>
);

export default CategorySelection;
