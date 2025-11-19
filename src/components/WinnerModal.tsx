import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

interface WinnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  winner: string;
  isLuckyWinner: boolean;
}

const WinnerModal = ({ open, onOpenChange, winner, isLuckyWinner }: WinnerModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl sm:text-3xl font-bold">
            🎊 Поздравляем!
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-primary to-accent p-6 rounded-full">
              <Icon name="Trophy" size={64} className="text-white" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-sm sm:text-base">Выбран</p>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {winner}
            </p>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Закрыть
          </button>
        </div>

        {showConfetti && (
          <div className="confetti-container">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;