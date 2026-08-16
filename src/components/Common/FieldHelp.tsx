import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface FieldHelpProps {
  text: string;
  example?: string;
  className?: string;
}

export const FieldHelp: React.FC<FieldHelpProps> = ({ text, example, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center align-middle group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-label="Field guidance help"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="text-slate-400 hover:text-indigo-400 p-0.5 rounded-full hover:bg-indigo-500/10 focus:outline-none transition cursor-pointer"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {/* Tooltip / Popover Guidance Card */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2.5 bg-slate-950 border border-slate-700/90 text-slate-200 rounded-xl shadow-2xl z-50 text-[11px] leading-relaxed backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-auto select-text"
        >
          <div className="font-normal text-slate-300">{text}</div>
          {example && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-indigo-300 font-mono">
              <span className="font-semibold text-slate-400">Example: </span>
              {example}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-slate-950 border-r border-b border-slate-700 transform rotate-45" />
        </div>
      )}
    </div>
  );
};
