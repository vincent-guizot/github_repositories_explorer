export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
    >
      {/* mug */}
      <g>
        <rect x="18" y="188" width="76" height="70" rx="14" fill="#818CF8" />
        <path
          d="M94 202h14a16 16 0 0 1 0 32H94"
          stroke="#818CF8"
          strokeWidth="10"
          fill="none"
        />
        <circle cx="56" cy="214" r="15" fill="white" fillOpacity="0.9" />
        <path
          d="M50 209c2-3 8-3 10 0"
          stroke="#818CF8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M44 199c-4-10-2-18 6-16"
          stroke="#C7D2FE"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M58 195c-3-12 0-20 8-17"
          stroke="#C7D2FE"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* plant */}
      <g>
        <rect x="330" y="230" width="46" height="34" rx="8" fill="white" stroke="#E0E7FF" strokeWidth="2" />
        <path d="M353 230c0-26 -26-30-30-52 24 2 34 22 30 52Z" fill="#A5B4FC" />
        <path d="M353 230c0-30 28-34 32-58 -26 2-36 24-32 58Z" fill="#818CF8" />
      </g>

      {/* laptop */}
      <g>
        <rect x="96" y="70" width="230" height="150" rx="14" fill="#1E1B3A" />
        <rect x="108" y="82" width="206" height="112" rx="4" fill="white" />
        <rect x="108" y="82" width="40" height="112" fill="#EEF0FF" />
        <circle cx="128" cy="98" r="6" fill="#6366F1" />
        <rect x="116" y="114" width="24" height="4" rx="2" fill="#C7D2FE" />
        <rect x="116" y="124" width="24" height="4" rx="2" fill="#C7D2FE" />
        <rect x="116" y="134" width="24" height="4" rx="2" fill="#C7D2FE" />
        <rect x="116" y="144" width="16" height="4" rx="2" fill="#4ADE80" />
        <rect x="160" y="94" width="140" height="10" rx="5" fill="#E5E7EB" />
        <rect x="160" y="118" width="146" height="24" rx="6" fill="#F5F5FF" />
        <rect x="168" y="126" width="60" height="4" rx="2" fill="#C7D2FE" />
        <rect x="160" y="150" width="146" height="24" rx="6" fill="#F5F5FF" />
        <rect x="168" y="158" width="80" height="4" rx="2" fill="#C7D2FE" />
        <path
          d="M84 220 L96 196 L326 196 L338 220 Z"
          fill="#2C2856"
        />
        <rect x="150" y="220" width="122" height="8" rx="4" fill="#3A3568" />
      </g>

      {/* floating chips */}
      <g>
        <rect x="300" y="20" width="52" height="52" rx="14" fill="white" stroke="#EEF0FF" strokeWidth="2" />
        <path
          d="M326 34a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm0 4 2.6 5.4 6 .8-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.8Z"
          fill="#6366F1"
        />
        <rect x="350" y="88" width="52" height="52" rx="14" fill="white" stroke="#EEF0FF" strokeWidth="2" />
        <circle cx="376" cy="104" r="4" fill="#6366F1" />
        <circle cx="366" cy="122" r="4" fill="#6366F1" />
        <circle cx="386" cy="122" r="4" fill="#6366F1" />
        <path d="M376 108v6M370 120l4-4M382 120l-4-4" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

        <rect x="8" y="70" width="8" height="8" rx="2" fill="#C7D2FE" />
        <circle cx="14" cy="130" r="5" fill="#C7D2FE" />
      </g>
    </svg>
  );
}
