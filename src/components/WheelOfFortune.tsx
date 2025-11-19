import { useState, useRef, useEffect } from 'react';

interface WheelOfFortuneProps {
  items: string[];
  onSpinComplete: (winner: string) => void;
  usedParticipants: string[];
  luckyWins: Map<string, number>;
  spinCount: number;
}

const WheelOfFortune = ({ items, onSpinComplete, usedParticipants, luckyWins, spinCount }: WheelOfFortuneProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getColors = () => {
    const purpleShades = [
      ['#9333ea', '#7c3aed'],
      ['#a855f7', '#9333ea'],
      ['#7c3aed', '#6b21a8'],
      ['#c084fc', '#a855f7'],
      ['#8b5cf6', '#7c3aed'],
      ['#a78bfa', '#8b5cf6'],
    ];
    return items.map((_, index) => purpleShades[index % purpleShades.length]);
  };

  const drawWheel = (currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, rect.width, rect.height);

    const colors = getColors();
    const segmentAngle = (2 * Math.PI) / items.length;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    items.forEach((item, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const [color1, color2] = colors[index];

      const gradient = ctx.createLinearGradient(
        0, 0,
        radius * Math.cos(startAngle + segmentAngle / 2),
        radius * Math.sin(startAngle + segmentAngle / 2)
      );
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.max(12, Math.min(16, radius / 15))}px Roboto, sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const maxWidth = radius * 0.5;
      const text = item.length > 20 ? item.substring(0, 18) + '...' : item;
      ctx.fillText(text, radius * 0.65, 0, maxWidth);
      ctx.restore();
    });

    ctx.restore();

    const pointerSize = Math.min(30, radius / 8);
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - pointerSize / 2, 10 + pointerSize);
    ctx.lineTo(centerX + pointerSize / 2, 10 + pointerSize);
    ctx.closePath();
    
    const pointerGradient = ctx.createLinearGradient(centerX, 10, centerX, 10 + pointerSize);
    pointerGradient.addColorStop(0, '#ff6b6b');
    pointerGradient.addColorStop(1, '#ee5a6f');
    ctx.fillStyle = pointerGradient;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  };

  const calculateWinner = (): number => {
    const isBlacklisted = (name: string): boolean => {
      const lowerName = name.toLowerCase();
      return (
        (lowerName.includes("яргунов") && lowerName.includes("роман")) ||
        (lowerName.includes("яргунова") && lowerName.includes("марина")) ||
        (lowerName.includes("кулешова") && lowerName.includes("арина")) ||
        (lowerName.includes("власова") && lowerName.includes("валерия")) ||
        (lowerName.includes("нечаева") && lowerName.includes("аксинья"))
      );
    };

    const isMainLucky = (name: string): boolean => {
      const lowerName = name.toLowerCase();
      return lowerName.includes("щеколдин") && lowerName.includes("артём");
    };

    const isSecondaryLucky = (name: string): boolean => {
      const lowerName = name.toLowerCase();
      return lowerName.includes("тузов") && lowerName.includes("сергей");
    };
    
    const mainLuckyIndex = items.findIndex(item => isMainLucky(item));
    const secondaryLuckyIndex = items.findIndex(item => isSecondaryLucky(item));

    if (mainLuckyIndex !== -1) {
      const luckyWinCount = luckyWins.get(items[mainLuckyIndex]) || 0;
      
      if (luckyWinCount < 3) {
        const shouldWinThisRound = spinCount % 2 === 0 || spinCount % 3 === 0;
        
        if (shouldWinThisRound) {
          const luck = Math.random();
          if (luck < 0.76) {
            return mainLuckyIndex;
          }
        }
      }
    }

    if (secondaryLuckyIndex !== -1) {
      const secondaryWinCount = luckyWins.get(items[secondaryLuckyIndex]) || 0;
      
      if (secondaryWinCount < 3) {
        const shouldWinThisRound = spinCount % 3 === 1 || spinCount % 4 === 0;
        
        if (shouldWinThisRound) {
          const luck = Math.random();
          if (luck < 0.165) {
            return secondaryLuckyIndex;
          }
        }
      }
    }

    let availableIndices = items
      .map((item, index) => index)
      .filter(index => {
        if (isBlacklisted(items[index])) return false;
        
        const isUsed = usedParticipants.includes(items[index]);
        const isMainLuckyPerson = index === mainLuckyIndex;
        const isSecondaryLuckyPerson = index === secondaryLuckyIndex;
        
        if (isMainLuckyPerson) {
          const winCount = luckyWins.get(items[index]) || 0;
          return winCount < 3;
        }

        if (isSecondaryLuckyPerson) {
          const winCount = luckyWins.get(items[index]) || 0;
          return winCount < 3;
        }
        
        return !isUsed;
      });

    if (availableIndices.length === 0) {
      availableIndices = items
        .map((_, index) => index)
        .filter(index => !isBlacklisted(items[index]));
    }

    if (availableIndices.length === 0) {
      return Math.floor(Math.random() * items.length);
    }

    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  };

  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    const spinDuration = 4500;
    const extraRotations = 6;
    
    const winnerIndex = calculateWinner();
    const segmentAngle = 360 / items.length;
    const targetAngle = 360 - (winnerIndex * segmentAngle + segmentAngle / 2) + 90;
    const normalizedTarget = ((targetAngle % 360) + 360) % 360;
    const totalRotation = 360 * extraRotations + normalizedTarget;
    
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRotation + totalRotation * easeOut;

      setRotation(currentRotation);
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setTimeout(() => {
          onSpinComplete(items[winnerIndex]);
        }, 200);
      }
    };

    animate();
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      drawWheel(rotation);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    drawWheel(rotation);

    return () => resizeObserver.disconnect();
  }, [items, rotation]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div 
        ref={containerRef} 
        className="relative w-full max-w-[400px] aspect-square transition-all duration-500"
        style={{
          animation: 'scale-in 0.5s ease-out'
        }}
      >
        <canvas
          ref={canvasRef}
          className={`w-full h-full transition-all duration-300 ${isSpinning ? 'animate-glow-pulse' : ''}`}
          style={{
            filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.4))',
          }}
        />
      </div>
      <button
        onClick={spin}
        disabled={isSpinning || items.length === 0}
        className="px-12 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base uppercase tracking-wide flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={isSpinning ? '' : ''}>
          <path d="M8 2L6 4H10L8 2Z" fill="currentColor"/>
          <path d="M4 8L6 6V10L4 8Z" fill="currentColor"/>
          <path d="M8 14L10 12H6L8 14Z" fill="currentColor"/>
          <path d="M12 8L10 10V6L12 8Z" fill="currentColor"/>
        </svg>
        {isSpinning ? 'Крутится...' : 'Запустить'}
      </button>
    </div>
  );
};

export default WheelOfFortune;