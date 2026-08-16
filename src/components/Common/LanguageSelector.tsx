/**
 * Indian Language Selector Dropdown Component
 * Enables switching between Hindi, Sanskrit, Gujarati, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, and English.
 */

import React, { useState, useRef, useEffect } from 'react';
import { INDIAN_LANGUAGES, LanguageCode } from '../../utils/indianLanguages';
import { Languages, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  variant?: 'header' | 'form' | 'pill';
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  variant = 'header',
  showLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = INDIAN_LANGUAGES.find(l => l.code === selectedLanguage) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {variant === 'header' && (
        <button
          type="button"
          id="header-language-dropdown-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 transition cursor-pointer shadow-2xs"
          title="Select Indian Language / भाषा चुनें"
        >
          <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-medium text-slate-900">{currentLang.nativeName}</span>
          <span className="text-[10px] text-slate-500 font-normal">({currentLang.name})</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {variant === 'form' && (
        <div className="space-y-1">
          {showLabel && (
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>Language / भाषा (Indian Languages)</span>
            </label>
          )}
          <button
            type="button"
            id="form-language-dropdown-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-medium hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-100">
                {currentLang.nativeName}
              </span>
              <span className="text-slate-700">{currentLang.name}</span>
              <span className="text-[10px] text-slate-400">({currentLang.region})</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      {variant === 'pill' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 text-xs font-medium transition cursor-pointer"
        >
          <Languages className="w-3 h-3 text-indigo-600" />
          <span>{currentLang.nativeName}</span>
          <ChevronDown className="w-3 h-3 text-indigo-500" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
            <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              Indian & Regional Languages
            </p>
            <p className="text-[10px] text-slate-500">
              Select script for Natal Chart, Gemstones & Planetary report
            </p>
          </div>

          <div className="divide-y divide-slate-50">
            {INDIAN_LANGUAGES.map((lang) => {
              const isSelected = lang.code === selectedLanguage;

              return (
                <button
                  type="button"
                  key={lang.code}
                  id={`lang-option-${lang.code}`}
                  onClick={() => {
                    onSelectLanguage(lang.code as LanguageCode);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 text-indigo-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{lang.nativeName}</span>
                      <span className="text-[11px] text-slate-500 font-medium">({lang.name})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{lang.region} • {lang.script}</span>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
