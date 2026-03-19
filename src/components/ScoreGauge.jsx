import { useEffect, useState } from 'react';

export default function ScoreGauge({ score, nivel }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const size = 200;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const offset = circumference - progress;

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 1200;
    function animate(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setAnimatedScore(Math.round(score * ease));
      if (pct < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#E8EAED" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={nivel.cor} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold" style={{ color: nivel.cor }}>{animatedScore}</span>
          <span className="text-sm text-gray mt-1">de 100</span>
        </div>
      </div>
      <span className="px-4 py-1.5 rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: nivel.cor }}>
        {nivel.label}
      </span>
    </div>
  );
}
