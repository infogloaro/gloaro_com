import logo from '../../assets/logo.png'

export default function LoadingScreen({ label = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-950 transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated branded logo */}
        <div className="relative w-40 h-16 md:w-48 md:h-20 animate-pulse duration-1000">
          <img 
            src={logo} 
            alt="Gloaro Logo" 
            className="h-full w-full object-contain filter drop-shadow-md"
          />
        </div>
        
        {/* Loading label text */}
        {label && (
          <p className="text-sm md:text-base font-extrabold tracking-wide text-slate-600 dark:text-slate-400">
            {label}
          </p>
        )}

        {/* Subtle bouncing dots indicator */}
        <div className="flex space-x-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d4697] dark:bg-blue-500" style={{ animationDelay: '-0.3s' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d4697] dark:bg-blue-500" style={{ animationDelay: '-0.15s' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d4697] dark:bg-blue-500" />
        </div>
      </div>
    </div>
  )
}
