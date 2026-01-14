import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ label, options, value, onChange, error, icon: Icon, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="input-group" ref={containerRef}>
            <label className="label-text">
                {label} <span className="label-required">*</span>
            </label>
            <div className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`input-field pl-11 pr-10 text-left flex items-center justify-between cursor-pointer ${error ? 'border-red-500/50' : ''
                        } ${isOpen ? '!border-blue-500/50 !bg-slate-900/80' : ''}`}
                >
                    <span className={`block truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-200'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Icon */}
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                )}

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 w-full bottom-full mb-2 overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl animate-fade-in-up">
                        <div className="max-h-96 overflow-y-auto custom-scrollbar py-1">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        relative cursor-pointer select-none py-3 pl-11 pr-4 transition-all duration-200 text-left
                                        ${value === option.value
                                            ? 'bg-blue-600/20 text-blue-200'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    {/* Checkmark for selected item */}
                                    {value === option.value && (
                                        <span className="absolute left-3 flex items-center pl-1 text-blue-400">
                                            <Check className="h-4 w-4" />
                                        </span>
                                    )}
                                    <span className="block truncate font-medium">
                                        {option.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="error-text">{error.message}</p>}
        </div>
    );
};

export default CustomSelect;
