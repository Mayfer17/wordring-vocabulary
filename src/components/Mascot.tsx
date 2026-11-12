import React from 'react';

interface MascotProps {
  type?: 'kitten' | 'cloud';
  size?: 'sm' | 'md' | 'lg';
  messageThai?: string;
  messageEng?: string;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  type = 'kitten',
  size = 'md',
  messageThai,
  messageEng,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Mascot Circle Frame with soft blush background #F5DFE5 */}
      <div
        className={`${sizeMap[size]} shrink-0 rounded-full bg-[#F5DFE5] border border-[#d6c1c7] flex items-center justify-center p-1.5 shadow-[0_2px_8px_-2px_rgba(72,74,80,0.12)] transition-transform duration-300 hover:scale-105 select-none`}
      >
        {type === 'kitten' ? (
          // Cream Kitten with Rosy Blushing Cheeks
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            {/* Soft shadow */}
            <ellipse cx="32" cy="58" rx="20" ry="3.5" fill="rgba(72, 74, 80, 0.08)" />

            {/* Kitten Ears */}
            <polygon points="17,14 27,24 13,28" fill="#FDF7EE" stroke="#484A50" strokeWidth="2.2" strokeLinejoin="round" />
            <polygon points="17,17 24,24 15,26" fill="#F5DFE5" />

            <polygon points="47,14 51,28 37,24" fill="#FDF7EE" stroke="#484A50" strokeWidth="2.2" strokeLinejoin="round" />
            <polygon points="47,17 49,26 40,24" fill="#F5DFE5" />

            {/* Kitten Head */}
            <circle cx="32" cy="33" r="21" fill="#FDF7EE" stroke="#484A50" strokeWidth="2.2" />

            {/* Cream patches */}
            <path d="M22 22 Q27 18 32 20 Q28 26 22 22 Z" fill="#F4E8D3" opacity="0.8" />

            {/* Cheerful Closed Happy Eyes */}
            <path d="M21 32 Q25 28 29 32" stroke="#484A50" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M35 32 Q39 28 43 32" stroke="#484A50" strokeWidth="2.2" strokeLinecap="round" />

            {/* Blushing Cheeks */}
            <circle cx="18" cy="37" r="4.2" fill="#F5A3B7" opacity="0.65" />
            <circle cx="46" cy="37" r="4.2" fill="#F5A3B7" opacity="0.65" />

            {/* Cute Nose and W-Mouth */}
            <polygon points="32,36 30,34 34,34" fill="#E88C9E" />
            <path d="M28 38 Q32 41 32 38 Q32 41 36 38" stroke="#484A50" strokeWidth="2" strokeLinecap="round" />

            {/* Whiskers */}
            <line x1="12" y1="36" x2="6" y2="34" stroke="#484A50" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="12" y1="39" x2="6" y2="40" stroke="#484A50" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="52" y1="36" x2="58" y2="34" stroke="#484A50" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="52" y1="39" x2="58" y2="40" stroke="#484A50" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

            {/* Tiny stationery paw */}
            <circle cx="26" cy="51" r="4" fill="#FDF7EE" stroke="#484A50" strokeWidth="1.8" />
            <circle cx="38" cy="51" r="4" fill="#FDF7EE" stroke="#484A50" strokeWidth="1.8" />
          </svg>
        ) : (
          // Powder-Blue Shaded Smiling Cloud
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            {/* Cloud body */}
            <path
              d="M18 42 C13 42 10 38 10 33 C10 28 14 24 19 24 C20 18 26 14 33 14 C40 14 46 19 47 25 C52 25 56 29 56 34 C56 39 52 42 47 42 Z"
              fill="#DCEBFA"
              stroke="#484A50"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Cloud shading */}
            <path
              d="M16 41 C22 43 42 43 48 41 C44 38 41 39 37 38 C31 38 27 40 16 41 Z"
              fill="#A8BDD2"
              opacity="0.5"
            />

            {/* Cloud Happy Eyes */}
            <circle cx="25" cy="30" r="2.4" fill="#484A50" />
            <circle cx="39" cy="30" r="2.4" fill="#484A50" />
            <circle cx="26" cy="29" r="0.8" fill="#FFFFFF" />
            <circle cx="40" cy="29" r="0.8" fill="#FFFFFF" />

            {/* Cloud Blushing Cheeks */}
            <circle cx="20" cy="34" r="3.2" fill="#F5A3B7" opacity="0.75" />
            <circle cx="44" cy="34" r="3.2" fill="#F5A3B7" opacity="0.75" />

            {/* Gentle Smile */}
            <path d="M29 33 Q32 37 35 33" stroke="#484A50" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Optional Speech Bubble */}
      {(messageThai || messageEng) && (
        <div className="relative bg-[#FFFFFF] rounded-2xl px-3.5 py-2 border border-[#EAE5DC] shadow-[0_2px_8px_-2px_rgba(72,74,80,0.06)] text-xs">
          {/* Bubble tail */}
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#FFFFFF] border-l border-b border-[#EAE5DC] rotate-45" />

          {messageThai && (
            <div className="font-semibold text-[#1d1c16] text-[13px] tracking-wide leading-tight">
              {messageThai}
            </div>
          )}
          {messageEng && (
            <div className="text-[#74777c] font-normal text-[11px] mt-0.5">{messageEng}</div>
          )}
        </div>
      )}
    </div>
  );
};
