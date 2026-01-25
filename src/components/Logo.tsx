'use client'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  variant?: 'dark' | 'light'
}

export default function Logo({ size = 'md', showText = true, variant = 'dark' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
  }

  const iconSize = sizes[size].icon
  const textClass = sizes[size].text
  const textColor = variant === 'dark' ? 'text-white' : 'text-brand-dark'
  const accentColor = '#E63946'
  const personColor = variant === 'dark' ? '#F8F8F8' : '#1D1D1F'

  return (
    <div className="flex items-center gap-3">
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House outline */}
        <path 
          d="M20 45 L50 20 L80 45 L80 85 L20 85 Z" 
          fill="none" 
          stroke={accentColor} 
          strokeWidth="4" 
          strokeLinejoin="round"
        />
        
        {/* Left person */}
        <circle cx="38" cy="52" r="7" fill={accentColor}/>
        <path 
          d="M30 75 L30 65 Q30 58 38 58 Q44 58 46 62" 
          stroke={accentColor} 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none"
        />
        
        {/* Right person */}
        <circle cx="62" cy="52" r="7" fill={personColor}/>
        <path 
          d="M70 75 L70 65 Q70 58 62 58 Q56 58 54 62" 
          stroke={personColor} 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none"
        />
        
        {/* Handshake connection */}
        <path 
          d="M46 62 L54 62" 
          stroke={accentColor} 
          strokeWidth="4" 
          strokeLinecap="round"
        />
      </svg>
      
      {showText && (
        <span className={`${textClass} font-bold ${textColor}`}>
          Job<span className="text-brand-red">Nachbar</span>
        </span>
      )}
    </div>
  )
}
