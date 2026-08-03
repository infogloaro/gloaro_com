export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl bg-white p-6 shadow-[0_18px_55px_rgba(11,70,158,0.08)] ${className}`.trim()}>
      {children}
    </div>
  )
}

