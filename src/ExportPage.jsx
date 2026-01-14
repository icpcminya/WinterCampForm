import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Download, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExportPage = () => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleExport = async (e) => {
        e.preventDefault();
        if (!password) {
            toast.error('Please enter the password');
            return;
        }

        setIsLoading(true);
        const exportPromise = new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/export?password=${encodeURIComponent(password)}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'registrations.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    resolve();
                } else {
                    const errorData = await response.json();
                    reject({ status: response.status, ...errorData });
                }
            } catch (error) {
                reject({ message: 'Network error. Please try again later.' });
            } finally {
                setIsLoading(false);
            }
        });

        toast.promise(
            exportPromise,
            {
                loading: 'Exporting data...',
                success: 'Export successful! File downloading...',
                error: (err) => {
                    if (err.status === 401) return 'Unauthorized: Invalid password';
                    return err.message || 'Export failed';
                },
            },
            {
                style: {
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                }
            }
        );
    };

    return (
        <div className="w-full max-w-md animate-fade-in-up">
            <div className="glass-panel p-8 rounded-3xl relative">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white group z-20"
                    title="Back to home"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="text-center mb-8 pt-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                        <Download className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Export Data</h1>
                    <p className="text-slate-400 text-sm">Download registrations as Excel</p>
                </div>

                <form onSubmit={handleExport} className="space-y-6">
                    <div className="input-group">
                        <label className="label-text">Admin Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter export password"
                                className="input-field pl-11"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-3 rounded-xl font-bold text-white tracking-wide shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span>Export Now</span>
                                <Download className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExportPage;
