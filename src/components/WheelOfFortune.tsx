import { useState, useRef } from 'react';

interface WheelOfFortuneProps {
  items: string[];
  onSpinComplete: (winner: string) => void;
}

const WheelOfFortune = ({ items, onSpinComplete }: WheelOfFortuneProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getColors = () => {
    const baseColors = [
      '#1EAEDB',
      '#403E43',
      '#33C3F0',
      '#8A898C',
      '#0FA0CE',
      '#C8C8C9',
    ];
    return items.map((_, index) => baseColors[index % baseColors.length]);
  };

  const drawWheel = (currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = getColors();
    const segmentAngle = (2 * Math.PI) / items.length;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    items.forEach((item, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Roboto, sans-serif';
      ctx.fillText(item, radius * 0.65, 0);
      ctx.restore();
    });

    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX - 15, 50);
    ctx.lineTo(centerX + 15, 50);
    ctx.closePath();
    ctx.fillStyle = '#ea384c';
    ctx.fill();
  };

  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    const spinDuration = 4000;
    const extraRotations = 5;
    const randomDegrees = Math.random() * 360;
    const totalRotation = 360 * extraRotations + randomDegrees;
    
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * easeOut;

      setRotation(currentRotation);
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalRotation = currentRotation % 360;
        const segmentAngle = 360 / items.length;
        const adjustedRotation = (360 - finalRotation + 90) % 360;
        const winnerIndex = Math.floor(adjustedRotation / segmentAngle) % items.length;
        
        setIsSpinning(false);
        onSpinComplete(items[winnerIndex]);
      }
    };

    animate();
  };

  useState(() => {
    drawWheel(rotation);
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full"
        />
      </div>
      <button
        onClick={spin}
        disabled={isSpinning || items.length === 0}
        className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'Крутится...' : 'Запустить колесо'}
      </button>
    </div>
  );
};

export default WheelOfFortune;
