export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ziyaBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3730A3" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <radialGradient id="ziyaGloss" cx="32%" cy="20%" r="65%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="ziyaVignette"
          x1="50"
          y1="4"
          x2="50"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.55" stopColor="#1E1B4B" stopOpacity="0" />
          <stop offset="1" stopColor="#1E1B4B" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient
          id="ziyaBrow"
          x1="50"
          y1="10"
          x2="50"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C7D2FE" />
        </linearGradient>
        <linearGradient id="ziyaEye" x1="50" y1="34" x2="50" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D2D8F2" />
        </linearGradient>
        <linearGradient
          id="ziyaCandle"
          x1="42"
          y1="0"
          x2="58"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#FBF3DC" />
          <stop offset="1" stopColor="#D8CBA0" />
        </linearGradient>
        <radialGradient id="ziyaFlameOuter" cx="50%" cy="35%" r="65%">
          <stop offset="0" stopColor="#FEF3C7" />
          <stop offset="0.55" stopColor="#FBBF24" />
          <stop offset="1" stopColor="#EA8A0A" />
        </radialGradient>
        <filter id="ziyaGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <filter id="ziyaSoftShadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow
            dx="0"
            dy="1.3"
            stdDeviation="1.1"
            floodColor="#1E1B4B"
            floodOpacity="0.4"
          />
        </filter>
        <filter id="ziyaShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="2.5"
            stdDeviation="2.5"
            floodColor="#1E1B4B"
            floodOpacity="0.35"
          />
        </filter>
      </defs>

      <g filter="url(#ziyaShadow)">
        <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#ziyaBg)" />
        <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#ziyaVignette)" />
        <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#ziyaGloss)" />

        {/* Şüpheci kaş: "sallama" — dolgun, 3D şerit */}
        <path
          d="M18 42 Q50 10 84 24 L84 33 Q50 22 18 46 Z"
          fill="url(#ziyaBrow)"
          filter="url(#ziyaSoftShadow)"
        />

        {/* Kısık, şüpheci göz — cam/lens hissi */}
        <path
          d="M16 55 Q50 34 84 55 Q50 70 16 55 Z"
          fill="url(#ziyaEye)"
          filter="url(#ziyaSoftShadow)"
        />
        <path
          d="M20 53 Q50 40 80 53"
          fill="none"
          stroke="#312E81"
          strokeOpacity="0.2"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#ziyaGlow)"
        />
        <ellipse
          cx="33"
          cy="50"
          rx="7.5"
          ry="3.5"
          fill="#FFFFFF"
          opacity="0.55"
          transform="rotate(-18 33 50)"
        />
        <path
          d="M16 55 Q50 34 84 55 Q50 70 16 55 Z"
          fill="none"
          stroke="#312E81"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />

        {/* Alev dış parıltısı: "ziya" */}
        <circle cx="50" cy="45" r="11" fill="#FBBF24" opacity="0.55" filter="url(#ziyaGlow)" />

        {/* Mum: "yalancının mumu yatsıya kadar yanar" — Ziya'nınki sönmez */}
        <path
          d="M50 38 C 53.5 42, 55 45.5, 50 51 C 45 45.5, 46.5 42, 50 38 Z"
          fill="url(#ziyaFlameOuter)"
        />
        <path
          d="M50 41.5 C 52 44, 52.8 46, 50 49 C 47.2 46, 48 44, 50 41.5 Z"
          fill="#FFFBEB"
          opacity="0.9"
        />
        <rect
          x="45.5"
          y="49"
          width="9"
          height="15"
          rx="2.2"
          fill="url(#ziyaCandle)"
          filter="url(#ziyaSoftShadow)"
        />
        <rect x="46.5" y="50.5" width="2.2" height="12" rx="1.1" fill="#FFFFFF" opacity="0.5" />
        <rect
          x="45.5"
          y="49"
          width="9"
          height="15"
          rx="2.2"
          fill="none"
          stroke="#B49B63"
          strokeOpacity="0.35"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

/** Icon + "Ziya" wordmark, header ve pazarlama sayfalarında kullanılan logo lockup'ı. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="text-lg font-bold tracking-tight text-foreground">Ziya</span>
    </span>
  );
}
