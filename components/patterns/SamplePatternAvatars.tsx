import type { SVGProps } from 'react'

export const SamplePatternAvatar1 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={128} height={128} {...props}>
    <title>{'Greg Pattern - LLM Avatar'}</title>
    <rect x={0} y={0} width={128} height={128} fill="#1a1a2e" />
    <g stroke="#4a4e69" strokeWidth={0.5} opacity={0.3}>
      <path d="M0,16 H128 M0,32 H128 M0,48 H128 M0,64 H128 M0,80 H128 M0,96 H128 M0,112 H128" />
      <path d="M16,0 V128 M32,0 V128 M48,0 V128 M64,0 V128 M80,0 V128 M96,0 V128 M112,0 V128" />
    </g>
    <path d="M64,16 L112,64 L64,112 L16,64 Z" fill="#3a0ca3" stroke="#4cc9f0" strokeWidth={2}>
      <animate attributeName="stroke-width" values="2;3;2" dur="3s" repeatCount="indefinite" />
    </path>
    <circle cx={48} cy={56} r={8} fill="#4cc9f0">
      <animate attributeName="r" values="8;9;8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx={80} cy={56} r={8} fill="#4cc9f0">
      <animate attributeName="r" values="8;9;8" dur="2s" repeatCount="indefinite" />
    </circle>
    <path
      d="M48,88 Q64,104 80,88"
      fill="none"
      stroke="#4cc9f0"
      strokeWidth={3}
      strokeLinecap="round"
    />
    <circle cx={64} cy={64} r={48} fill="url(#glow)" opacity={0.5}>
      <animate attributeName="opacity" values="0.5;0.7;0.5" dur="4s" repeatCount="indefinite" />
    </circle>
    <g fill="none" stroke="#4cc9f0" strokeWidth={1}>
      <path d="M16,16 L112,112">
        <animate
          attributeName="stroke-dasharray"
          values="0,128;128,0"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M112,16 L16,112">
        <animate
          attributeName="stroke-dasharray"
          values="0,128;128,0"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>
    </g>
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4cc9f0" stopOpacity={0.5} />
        <stop offset="100%" stopColor="#4cc9f0" stopOpacity={0} />
      </radialGradient>
    </defs>
  </svg>
)

export const SamplePatternAvatar2 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={128} height={128} {...props}>
    <title>{'Greg Pattern - Malevolent LLM Avatar'}</title>
    <rect x={0} y={0} width={128} height={128} fill="#0a0a0a" />
    <circle cx={64} cy={64} r={60} fill="url(#evilGlow)">
      <animate attributeName="r" values="60;62;60" dur="3s" repeatCount="indefinite" />
    </circle>
    <path d="M64,16 L112,64 L64,112 L16,64 Z" fill="#1a0000" stroke="#ff0000" strokeWidth={2}>
      <animate
        attributeName="stroke"
        values="#ff0000;#ff6600;#ff0000"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M40,48 L56,56 L40,64 Z" fill="#ff0000">
      <animate
        attributeName="fill"
        values="#ff0000;#ff6600;#ff0000"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M88,48 L72,56 L88,64 Z" fill="#ff0000">
      <animate
        attributeName="fill"
        values="#ff0000;#ff6600;#ff0000"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M48,80 Q64,96 80,80" fill="none" stroke="#ff0000" strokeWidth={3}>
      <animate
        attributeName="d"
        values="M48,80 Q64,96 80,80;M48,88 Q64,72 80,88;M48,80 Q64,96 80,80"
        dur="10s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke"
        values="#ff0000;#ff6600;#ff0000"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M24,24 L40,40 M40,24 L24,40" stroke="#ff0000" strokeWidth={2}>
      <animate
        attributeName="stroke"
        values="#ff0000;#ff6600;#ff0000"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M88,24 L104,40 M104,24 L88,40" stroke="#ff0000" strokeWidth={2}>
      <animate
        attributeName="stroke"
        values="#ff0000;#ff6600;#ff0000"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
    <g fill="none" stroke="#400" strokeWidth={1}>
      <path d="M0,32 H128 M0,96 H128 M32,0 V128 M96,0 V128">
        <animate attributeName="stroke" values="#400;#800;#400" dur="6s" repeatCount="indefinite" />
      </path>
    </g>
    <g fill="none" stroke="#ff0000" strokeWidth={1} opacity={0.5}>
      <path d="M0,0 L128,128">
        <animate
          attributeName="stroke-dasharray"
          values="0,181;181,0"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M128,0 L0,128">
        <animate
          attributeName="stroke-dasharray"
          values="0,181;181,0"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>
    </g>
    <defs>
      <radialGradient id="evilGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ff0000" stopOpacity={0.3} />
        <stop offset="100%" stopColor="#ff0000" stopOpacity={0} />
      </radialGradient>
    </defs>
  </svg>
)

export const SamplePatternAvatar3 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={128} height={128} {...props}>
    <title>{'Greg Pattern - Exotic LLM Avatar'}</title>
    <defs>
      <linearGradient id="exoticBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a0033" />
        <stop offset="100%" stopColor="#4d0099" />
      </linearGradient>
      <radialGradient id="glowEffect" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ff00ff" stopOpacity={0.5} />
        <stop offset="100%" stopColor="#ff00ff" stopOpacity={0} />
      </radialGradient>
      <filter id="neonGlow">
        <feGaussianBlur stdDeviation={2} result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect x={0} y={0} width={128} height={128} fill="url(#exoticBg)" />
    <circle cx={64} cy={64} r={60} fill="url(#glowEffect)">
      <animate attributeName="r" values="60;62;60" dur="4s" repeatCount="indefinite" />
    </circle>
    <g fill="none" stroke="#ff00ff" strokeWidth={0.5} opacity={0.3}>
      <path d="M0,0 Q64,64 128,0 T256,0" />
      <path d="M0,32 Q64,96 128,32 T256,32" />
      <path d="M0,64 Q64,128 128,64 T256,64" />
      <path d="M0,96 Q64,160 128,96 T256,96" />
      <path d="M0,128 Q64,192 128,128 T256,128" />
      <animateTransform
        attributeName="transform"
        type="translate"
        from="0 0"
        to="-128 0"
        dur="20s"
        repeatCount="indefinite"
      />
    </g>
    <path
      d="M64,16 C80,24 104,40 104,64 C104,88 88,112 64,112 C40,112 24,88 24,64 C24,40 48,24 64,16 Z"
      fill="#cc00cc"
      stroke="#ff00ff"
      strokeWidth={2}
      filter="url(#neonGlow)"
    >
      <animate
        attributeName="d"
        values="M64,16 C80,24 104,40 104,64 C104,88 88,112 64,112 C40,112 24,88 24,64 C24,40 48,24 64,16 Z;                      M64,16 C88,24 112,48 104,72 C96,96 80,112 64,112 C48,112 32,96 24,72 C16,48 40,24 64,16 Z;                      M64,16 C80,24 104,40 104,64 C104,88 88,112 64,112 C40,112 24,88 24,64 C24,40 48,24 64,16 Z"
        dur="10s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M48,56 L56,60 L48,64 Z" fill="#00ffff" filter="url(#neonGlow)">
      <animate
        attributeName="d"
        values="M48,56 L56,60 L48,64 Z;M46,58 L56,60 L46,62 Z;M48,56 L56,60 L48,64 Z"
        dur="5s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M80,56 L72,60 L80,64 Z" fill="#00ffff" filter="url(#neonGlow)">
      <animate
        attributeName="d"
        values="M80,56 L72,60 L80,64 Z;M82,58 L72,60 L82,62 Z;M80,56 L72,60 L80,64 Z"
        dur="5s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M48,80 Q64,88 80,80"
      fill="none"
      stroke="#00ffff"
      strokeWidth={2}
      filter="url(#neonGlow)"
    >
      <animate
        attributeName="d"
        values="M48,80 Q64,88 80,80;M48,84 Q64,76 80,84;M48,80 Q64,88 80,80"
        dur="7s"
        repeatCount="indefinite"
      />
    </path>
    <g fill="none" stroke="#ffff00" strokeWidth={1} opacity={0.7}>
      <path d="M24,24 C32,16 40,32 48,24" />
      <path d="M80,24 C88,16 96,32 104,24" />
      <path d="M24,104 C32,112 40,96 48,104" />
      <path d="M80,104 C88,112 96,96 104,104" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 64 64"
        to="360 64 64"
        dur="20s"
        repeatCount="indefinite"
      />
    </g>
    <g fill="none" stroke="#ff00ff" strokeWidth={1} opacity={0.5}>
      <path d="M0,0 Q64,64 128,128">
        <animate
          attributeName="stroke-dasharray"
          values="0,181;181,0"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M128,0 Q64,64 0,128">
        <animate
          attributeName="stroke-dasharray"
          values="0,181;181,0"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
)

export const SamplePatternAvatar4 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={128} height={128} {...props}>
    <title>{'Greg Pattern - Omnipotent LLM Avatar'}</title>
    <defs>
      <radialGradient id="cosmicBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000033" />
        <stop offset="100%" stopColor="#000011" />
      </radialGradient>
      <filter id="starryFilter">
        <feTurbulence type="fractalNoise" baseFrequency={0.1} numOctaves={3} result="noise" />
        <feColorMatrix in="noise" type="saturate" values="0" result="noiseAlpha" />
        <feComponentTransfer in="noiseAlpha">
          <feFuncA type="table" tableValues="0 0 0.2 0.2 0.5 0.5 1 1" />
        </feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      <filter id="godlyGlow">
        <feGaussianBlur stdDeviation={2.5} result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect x={0} y={0} width={128} height={128} fill="url(#cosmicBg)" />
    <rect
      x={0}
      y={0}
      width={128}
      height={128}
      fill="#ffffff"
      opacity={0.1}
      filter="url(#starryFilter)"
    />
    <circle cx={64} cy={64} r={60} fill="none" stroke="url(#cosmicEnergy)" strokeWidth={4}>
      <animate
        attributeName="stroke-dasharray"
        from="0 377"
        to="377 377"
        dur="10s"
        repeatCount="indefinite"
      />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 64 64"
        to="360 64 64"
        dur="60s"
        repeatCount="indefinite"
      />
    </circle>
    <path
      d="M64,40 C64,20 84,20 84,40 C84,60 44,60 44,40 C44,20 64,20 64,40 C64,60 84,60 84,40 C84,20 44,20 44,40 C44,60 64,60 64,40"
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      opacity={0.5}
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 64 64"
        to="360 64 64"
        dur="30s"
        repeatCount="indefinite"
      />
    </path>
    <g filter="url(#godlyGlow)">
      <path d="M64,32 L96,64 L64,96 L32,64 Z" fill="#4d4dff" opacity={0.7} />
      <path
        d="M64,32 L96,64 L64,96 L32,64 Z"
        fill="#4d4dff"
        opacity={0.7}
        transform="rotate(45 64 64)"
      />
    </g>
    <circle cx={64} cy={64} r={16} fill="#ffffff" />
    <circle cx={64} cy={64} r={8} fill="#000000">
      <animate attributeName="r" values="8;6;8" dur="3s" repeatCount="indefinite" />
    </circle>
    <g stroke="#ffffff" strokeWidth={1} opacity={0.5}>
      <line x1={64} y1={0} x2={64} y2={128}>
        <animate
          attributeName="transform"
          type="rotate"
          from="0 64 64"
          to="360 64 64"
          dur="20s"
          repeatCount="indefinite"
        />
      </line>
      <line x1={0} y1={64} x2={128} y2={64}>
        <animate
          attributeName="transform"
          type="rotate"
          from="0 64 64"
          to="360 64 64"
          dur="20s"
          repeatCount="indefinite"
        />
      </line>
    </g>
    <g>
      <circle cx={64} cy={16} r={4} fill="#ff6600">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 64 64"
          to="360 64 64"
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx={64} cy={112} r={6} fill="#00ffff">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 64 64"
          to="360 64 64"
          dur="15s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx={16} cy={64} r={5} fill="#ffff00">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 64 64"
          to="360 64 64"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
    <g stroke="#ffffff" strokeWidth={0.5} opacity={0.3}>
      <line x1={0} y1={0} x2={128} y2={128}>
        <animate
          attributeName="stroke-dasharray"
          values="0,181;181,181"
          dur="5s"
          repeatCount="indefinite"
        />
      </line>
      <line x1={128} y1={0} x2={0} y2={128}>
        <animate
          attributeName="stroke-dasharray"
          values="0,181;181,181"
          dur="5s"
          repeatCount="indefinite"
        />
      </line>
    </g>
    <defs>
      <linearGradient id="cosmicEnergy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff00ff" />
        <stop offset="50%" stopColor="#00ffff" />
        <stop offset="100%" stopColor="#ffff00" />
        <animate attributeName="x1" values="0%;100%;0%" dur="10s" repeatCount="indefinite" />
        <animate attributeName="y1" values="0%;100%;0%" dur="10s" repeatCount="indefinite" />
        <animate attributeName="x2" values="100%;0%;100%" dur="10s" repeatCount="indefinite" />
        <animate attributeName="y2" values="100%;0%;100%" dur="10s" repeatCount="indefinite" />
      </linearGradient>
    </defs>
  </svg>
)

export const SamplePatternAvatar5 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={128} height={128} {...props}>
    <title>{'Greg Pattern - Derpy LLM Avatar'}</title>
    <defs>
      <linearGradient id="derpyBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff99cc" />
        <stop offset="100%" stopColor="#99ccff" />
      </linearGradient>
      <filter id="squiggleFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="turbulence" baseFrequency={0.05} numOctaves={2} result="turbulence" />
        <feDisplacementMap
          in2="turbulence"
          in="SourceGraphic"
          scale={5}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
    <rect x={0} y={0} width={128} height={128} fill="url(#derpyBg)" />
    <path
      d="M64,16 C80,24 104,40 104,64 C104,88 88,112 64,112 C40,112 24,88 24,64 C24,40 48,24 64,16 Z"
      fill="#ffcc00"
      stroke="#ff6600"
      strokeWidth={4}
      filter="url(#squiggleFilter)"
    >
      <animate
        attributeName="d"
        values="M64,16 C80,24 104,40 104,64 C104,88 88,112 64,112 C40,112 24,88 24,64 C24,40 48,24 64,16 Z;                      M64,16 C88,24 112,48 104,72 C96,96 80,112 64,112 C48,112 32,96 24,72 C16,48 40,24 64,16 Z;                      M64,16 C80,24 104,40 104,64 C104,88 88,112 64,112 C40,112 24,88 24,64 C24,40 48,24 64,16 Z"
        dur="5s"
        repeatCount="indefinite"
      />
    </path>
    <ellipse cx={45} cy={50} rx={15} ry={20} fill="#ffffff" stroke="#000000" strokeWidth={2}>
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 45 50"
        to="360 45 50"
        dur="10s"
        repeatCount="indefinite"
      />
    </ellipse>
    <circle cx={45} cy={50} r={8} fill="#000000">
      <animate attributeName="cy" values="50;55;50" dur="2s" repeatCount="indefinite" />
    </circle>
    <ellipse cx={85} cy={60} rx={20} ry={15} fill="#ffffff" stroke="#000000" strokeWidth={2}>
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 85 60"
        to="-360 85 60"
        dur="8s"
        repeatCount="indefinite"
      />
    </ellipse>
    <circle cx={85} cy={60} r={10} fill="#000000">
      <animate attributeName="cx" values="85;90;85" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <path
      d="M40,80 Q64,100 88,80"
      fill="none"
      stroke="#ff0000"
      strokeWidth={6}
      strokeLinecap="round"
    >
      <animate
        attributeName="d"
        values="M40,80 Q64,100 88,80;M40,85 Q64,70 88,85;M40,80 Q64,100 88,80"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    <g fill="none" stroke="#00ff00" strokeWidth={2} opacity={0.5}>
      <line x1={10} y1={10} x2={30} y2={30}>
        <animate attributeName="x2" values="30;10;30" dur="0.5s" repeatCount="indefinite" />
      </line>
      <line x1={118} y1={10} x2={98} y2={30}>
        <animate attributeName="y2" values="30;10;30" dur="0.7s" repeatCount="indefinite" />
      </line>
      <line x1={10} y1={118} x2={30} y2={98}>
        <animate attributeName="x1" values="10;30;10" dur="0.6s" repeatCount="indefinite" />
      </line>
      <line x1={118} y1={118} x2={98} y2={98}>
        <animate attributeName="y1" values="118;98;118" dur="0.8s" repeatCount="indefinite" />
      </line>
    </g>
    <path
      d="M0,64 Q32,32 64,64 T128,64"
      fill="none"
      stroke="#ff00ff"
      strokeWidth={2}
      strokeDasharray="5,5"
    >
      <animate
        attributeName="d"
        values="M0,64 Q32,32 64,64 T128,64;M0,64 Q32,96 64,64 T128,64;M0,64 Q32,32 64,64 T128,64"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
    <text
      x={64}
      y={120}
      fontFamily="Arial, sans-serif"
      fontSize={10}
      fill="#000000"
      textAnchor="middle"
    >
      {'\n    DERP AI\n    '}
      <animate attributeName="font-size" values="10;12;10" dur="1s" repeatCount="indefinite" />
    </text>
  </svg>
)
