import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Fingerprint, Mail, Phone, User, Globe, GraduationCap, Calendar, Send } from 'lucide-react';
import logo from './assets/logo.png';
import CustomSelect from './components/CustomSelect';

import { ArrowLeft, ExternalLink } from 'lucide-react'; // Import ExternalLink for VJ
import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ category }) => {
    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();
    const [cfStatus, setCfStatus] = useState({ status: 'idle', message: '' });
    const [vjStatus, setVjStatus] = useState({ status: 'idle', message: '' });

    const selectedUniversity = watch('university');
    const selectedFaculty = watch('faculty');

    // Codeforces Validation
    const validateCodeforcesHandle = async (handle) => {
        if (!handle) return true; // Let 'required' handle empty check

        setCfStatus({ status: 'validating', message: 'Validating...' });

        try {
            const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
            await new Promise((res) => setTimeout(res, 300));
            const data = await response.json();

            if (data.status === "OK") {
                const actualHandle = data.result[0].handle;
                setCfStatus({ status: 'success', message: `✓ Valid CF user: ${actualHandle}` });
                return true;
            } else {
                setCfStatus({ status: 'error', message: 'Codeforces handle not found' });
                return "Codeforces handle not found";
            }
        } catch (error) {
            setCfStatus({ status: 'error', message: 'Error connecting to Codeforces' });
            return "Error validating handle. Please try again.";
        }
    };

    // Virtual Judge Validation
    const validateVJHandle = async (handle) => {
        if (!handle) return true;

        setVjStatus({ status: 'validating', message: 'Validating...' });

        try {
            const response = await fetch(`https://vjudge.net/user/${handle}`);

            // Artificial delay for better UX
            await new Promise((res) => setTimeout(res, 500));

            if (response.status === 200) {
                setVjStatus({ status: 'success', message: `✓ Valid VJ user` });
                return true;
            } else {
                setVjStatus({ status: 'error', message: 'VJ handle not found' });
                return "VJ handle not found";
            }
        } catch (error) {
            // Because of CORS or other issues, we might just accept it or show a warning.
            // But from my testing, vjudge returns 404 correctly for non-existent users.
            // If fetch fails (e.g. network error), we might default to allowing it to not block registration.
            // However, the requirement is to validate. Let's assume validation is strict.
            setVjStatus({ status: 'error', message: 'Error checking VJ handle' });
            return "Error checking VJ handle";
        }
    };

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            registrationLevel: category || 'Newcomers',
        };

        const registrationPromise = new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();

                if (response.ok) {
                    resolve(result);
                } else {
                    // Reject with the result object to handle it in catch
                    // Include status for easier handling
                    reject({ status: response.status, ...result });
                }
            } catch (error) {
                reject({ message: 'Network error. Please try again later.' });
            }
        });

        await toast.promise(
            registrationPromise,
            {
                loading: 'Processing registration...',
                success: 'Registration successful! Redirecting...',
                error: (err) => {
                    if (err.status === 409) return `Duplicate: ${err.message}`;
                    if (err.status === 400) return 'Validation failed. Please check the form.';
                    return err.message || 'Registration failed';
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
        ).then(() => {
            navigate('/thanks');
        }).catch((err) => {
            // Handle 400 Validation Errors
            if (err.status === 400 && Array.isArray(err.errors)) {
                err.errors.forEach(errorObj => {
                    const fieldName = Object.keys(errorObj)[0];
                    const errorMessage = errorObj[fieldName];
                    // Verify the field exists in our form to avoid crashes
                    if (fieldName) {
                        setError(fieldName, { type: 'manual', message: errorMessage });
                    }
                });
            }
            // Handle 409 Duplicate Fields
            else if (err.status === 409) {
                if (err.message.includes('email')) {
                    setError('email', { type: 'manual', message: err.message });
                } else if (err.message.includes('nationalId')) {
                    setError('nationalId', { type: 'manual', message: err.message });
                } else if (err.message.includes('phone')) {
                    setError('phone', { type: 'manual', message: err.message });
                } else if (err.message.includes('codeforcesHandle')) {
                    setError('codeforcesHandle', { type: 'manual', message: err.message });
                } else if (err.message.includes('vjHandle')) {
                    setError('vjHandle', { type: 'manual', message: err.message });
                }
            }
            console.error('Registration Error:', err);
        });
    };

    // Options Data
    const universityOptions = [
        { value: 'Minya University', label: 'Minia University' },
        { value: 'Minia National University', label: 'Minia National University' },
        { value: 'Lotus University', label: 'Lotus University' },
        { value: 'EST', label: 'EST' },
        { value: 'Other', label: 'Other' },
    ];

    const facultyOptions = [
        { value: 'Computers and Information', label: 'Computers and Information' },
        { value: 'Science', label: 'Science' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Other', label: 'Other' },
    ];

    const yearOptions = [
        { value: 'First Year', label: 'First Year' },
        { value: 'Second Year', label: 'Second Year' },
        { value: 'Third Year', label: 'Third Year' },
        { value: 'Fourth Year', label: 'Fourth Year' },
        { value: 'Fifth Year', label: 'Fifth Year' },
    ];
    return (
        <div className="w-full max-w-4xl animate-fade-in-up">

            <div className="glass-panel p-5 md:p-12 rounded-3xl relative">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 left-4 md:top-8 md:left-8 p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white group z-20"
                    title="Back to categories"
                >
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Decorative background glow behind the card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/10 blur-[60px] pointer-events-none"></div>

                {/* Header Section */}
                <div className="text-center mb-8 md:mb-12 relative z-10 pt-8 md:pt-0">
                    <div className="relative inline-block mb-4 md:mb-6 group">
                        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full group-hover:bg-gold/30 transition-all duration-500"></div>
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 md:w-28 h-auto relative z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    <div className="mb-6 flex flex-col items-center">
                        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-sm tracking-tighter mb-1">
                            ICPC MINYA
                        </h2>
                        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-200">WINTER</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 ml-2">CAMP</span>
                        </h2>
                    </div>

                    <h1 className="text-lg md:text-2xl font-bold mb-3 tracking-tight text-slate-300">
                        <span className="text-white border-b-2 border-amber-400/50 pb-1">{category || 'Newcomers'}</span> Registration
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base font-light tracking-wide px-4">
                        Join the elite community
                    </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-10"></div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Names Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="input-group">
                            <label className="label-text">
                                Name (English) <span className="label-required">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Full English Name"
                                    {...register('nameEnglish', {
                                        required: 'English Name is required',
                                        validate: {
                                            threeWords: (value) => value.trim().split(/\s+/).length >= 3 || 'Please enter your full triple name',
                                            englishOnly: (value) => /^[a-zA-Z\s]+$/.test(value) || 'Please use English characters only'
                                        }
                                    })}
                                    className={`input-field pl-11 ${errors.nameEnglish ? 'border-red-500/50' : ''}`}
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            </div>
                            {errors.nameEnglish && <p className="error-text">{errors.nameEnglish.message}</p>}
                        </div>

                        <div className="input-group">
                            <label className="label-text">
                                Name (Arabic) <span className="label-required">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    dir="rtl"
                                    placeholder="الاسم الثلاثي بالعربي"
                                    {...register('nameArabic', {
                                        required: 'Arabic Name is required',
                                        validate: {
                                            threeWords: (value) => value.trim().split(/\s+/).length >= 3 || 'يجب كتابة الاسم ثلاثي على الأقل',
                                            arabicOnly: (value) => /^[\u0600-\u06FF\s]+$/.test(value) || 'يجب أن يكون الاسم باللغة العربية فقط'
                                        }
                                    })}
                                    className={`input-field pr-11 ${errors.nameArabic ? 'border-red-500/50' : ''}`}
                                />
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            </div>
                            {errors.nameArabic && <p className="error-text">{errors.nameArabic.message}</p>}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="input-group">
                            <label className="label-text">
                                Gmail Address <span className="label-required">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="example@gmail.com"
                                    {...register('email', {
                                        required: 'Email address is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|icloud)\.com$/,
                                            message: "Please use a popular email provider (Gmail, Yahoo, Outlook, etc.)"
                                        }
                                    })}
                                    className={`input-field pl-11 ${errors.email ? 'border-red-500/50' : ''}`}
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            </div>
                            {errors.email && <p className="error-text">{errors.email.message}</p>}
                        </div>

                        <div className="input-group">
                            <label className="label-text">
                                Phone Number <span className="label-required">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    placeholder="01xxxxxxxxx"
                                    {...register('phone', {
                                        required: 'Phone Number is required',
                                        pattern: {
                                            value: /^01[0125][0-9]{8}$/,
                                            message: "Must be a valid Egyptian phone number (01xxxxxxxxx)"
                                        }
                                    })}
                                    className={`input-field pl-11 ${errors.phone ? 'border-red-500/50' : ''}`}
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            </div>
                            {errors.phone && <p className="error-text">{errors.phone.message}</p>}
                        </div>
                    </div>

                    {/* ID & Handle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="input-group">
                            <label className="label-text">
                                National ID <span className="label-required">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="14 digits ID"
                                    {...register('nationalId', {
                                        required: 'National ID is required',
                                        pattern: {
                                            value: /^(2|3)[0-9]{13}$/,
                                            message: 'Must be a valid 14-digit Egyptian National ID'
                                        }
                                    })}
                                    className={`input-field pl-11 ${errors.nationalId ? 'border-red-500/50' : ''}`}
                                />
                                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            </div>
                            {errors.nationalId && <p className="error-text">{errors.nationalId.message}</p>}
                        </div>

                        <div className="input-group">
                            <label className="label-text">
                                Codeforces Handle <span className="label-required">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g., tourist"
                                    {...register('codeforcesHandle', {
                                        required: 'Codeforces Handle is required',
                                        validate: validateCodeforcesHandle
                                    })}
                                    className={`input-field pl-11 ${errors.codeforcesHandle ? 'border-red-500/50' : (cfStatus.status === 'success' ? 'border-green-500/50' : '')}`}
                                />
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            </div>
                            {/* Validation Status / Error */}
                            {errors.codeforcesHandle && <p className="error-text">{errors.codeforcesHandle.message}</p>}
                            {!errors.codeforcesHandle && cfStatus.status === 'validating' && (
                                <p className="text-blue-400 text-xs mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span> Validating...
                                </p>
                            )}
                            {!errors.codeforcesHandle && cfStatus.status === 'success' && (
                                <p className="text-green-400 text-xs mt-2">{cfStatus.message}</p>
                            )}
                        </div>

                        {/* Virtual Judge Handle (Only for Phase 1 & 2) */}
                        {(category === 'Phase 1' || category === 'Phase 2') && (
                            <div className="input-group animate-fade-in-up">
                                <label className="label-text">
                                    Virtual Judge Handle <span className="label-required">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Your VJ Handle"
                                        {...register('vjHandle', {
                                            required: 'Virtual Judge Handle is required for this phase',
                                            validate: validateVJHandle
                                        })}
                                        className={`input-field pl-11 ${errors.vjHandle ? 'border-red-500/50' : (vjStatus.status === 'success' ? 'border-green-500/50' : '')}`}
                                    />
                                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                </div>
                                {errors.vjHandle && <p className="error-text">{errors.vjHandle.message}</p>}
                                {!errors.vjHandle && vjStatus.status === 'validating' && (
                                    <p className="text-blue-400 text-xs mt-2 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span> Validating...
                                    </p>
                                )}
                                {!errors.vjHandle && vjStatus.status === 'success' && (
                                    <p className="text-green-400 text-xs mt-2">{vjStatus.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="h-px w-full bg-indigo-500/10 my-6"></div>

                    {/* Academic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-4">
                            <Controller
                                name="university"
                                control={control}
                                rules={{ required: 'University is required' }}
                                render={({ field }) => (
                                    <CustomSelect
                                        label="University"
                                        options={universityOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.university}
                                        icon={GraduationCap}
                                        placeholder="Select University..."
                                    />
                                )}
                            />

                            {/* Conditional Other University Input */}
                            {selectedUniversity === 'Other' && (
                                <div className="input-group animate-fade-in-down">
                                    <label className="label-text">
                                        Other University <span className="label-required">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter your university name"
                                            {...register('otherUniversity', { required: 'University name is required' })}
                                            className={`input-field pl-11 ${errors.otherUniversity ? 'border-red-500/50' : ''}`}
                                        />
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    </div>
                                    {errors.otherUniversity && <p className="error-text">{errors.otherUniversity.message}</p>}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <Controller
                                name="faculty"
                                control={control}
                                rules={{ required: 'Faculty is required' }}
                                render={({ field }) => (
                                    <CustomSelect
                                        label="Faculty"
                                        options={facultyOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.faculty}
                                        icon={GraduationCap}
                                        placeholder="Select Faculty..."
                                    />
                                )}
                            />

                            {/* Conditional Other Faculty Input */}
                            {selectedFaculty === 'Other' && (
                                <div className="input-group animate-fade-in-down">
                                    <label className="label-text">
                                        Other Faculty <span className="label-required">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter your faculty name"
                                            {...register('otherFaculty', { required: 'Faculty name is required' })}
                                            className={`input-field pl-11 ${errors.otherFaculty ? 'border-red-500/50' : ''}`}
                                        />
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    </div>
                                    {errors.otherFaculty && <p className="error-text">{errors.otherFaculty.message}</p>}
                                </div>
                            )}
                        </div>

                        <Controller
                            name="academicYear"
                            control={control}
                            rules={{ required: 'Academic Year is required' }}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Academic Year"
                                    options={yearOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.academicYear}
                                    icon={Calendar}
                                    placeholder="Select Year..."
                                />
                            )}
                        />
                    </div>



                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full py-3.5 md:py-4 rounded-xl font-bold text-lg text-white tracking-wide shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group h-14"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Registration</span>
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
