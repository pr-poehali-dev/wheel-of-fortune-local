import { useState } from 'react';
import WheelOfFortune from '@/components/WheelOfFortune';
import WinnerModal from '@/components/WinnerModal';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [winner, setWinner] = useState<string>('');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [usedParticipants, setUsedParticipants] = useState<string[]>([]);
  const [luckyWins, setLuckyWins] = useState<Map<string, number>>(new Map());
  const [spinCount, setSpinCount] = useState(0);

  const handleBulkAdd = () => {
    if (inputValue.trim() === '') {
      toast.error('Введите имена участников');
      return;
    }

    const newItems = inputValue
      .split(/[\n,]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .filter(item => !items.includes(item));

    if (newItems.length === 0) {
      toast.error('Все участники уже добавлены');
      return;
    }

    setItems([...items, ...newItems]);
    setInputValue('');
    toast.success(`Добавлено участников: ${newItems.length}`);
  };

  const handleSpinComplete = (selectedWinner: string) => {
    setWinner(selectedWinner);
    setShowWinnerModal(true);
    setSpinCount(prev => prev + 1);
    
    const isLucky = selectedWinner.toLowerCase().includes("щеколдин") && 
                    selectedWinner.toLowerCase().includes("артём");
    
    if (isLucky) {
      setLuckyWins(prev => {
        const newMap = new Map(prev);
        newMap.set(selectedWinner, (newMap.get(selectedWinner) || 0) + 1);
        return newMap;
      });
    } else {
      setUsedParticipants(prev => [...prev, selectedWinner]);
    }
  };

  const isLuckyWinner = winner.toLowerCase().includes("щеколдин") && 
                        winner.toLowerCase().includes("артём");

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold text-primary mb-4 uppercase tracking-tight animate-fade-in">
            Колесо-Фортуны
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.1s'}}>
            Бесплатное онлайн колесо фортуны для принятия решений и розыгрышей! Быстро и просто запускайте рулетку, выбирайте случайные варианты и организуйте честную жеребьевку
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start animate-fade-in" style={{animationDelay: '0.2s'}}>
          <Card className="p-6 border-2 border-primary/30 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
            <h2 className="text-lg font-semibold mb-1 text-primary">Список участников</h2>
            <p className="text-xs text-muted-foreground mb-4">Введите имена участников</p>
            
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Введите имена участников"
              className="min-h-[200px] mb-4 resize-none bg-input/50 border-border text-foreground placeholder:text-muted-foreground"
            />

            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
              <Icon name="Users" size={16} />
              <span>Участников: {items.length}</span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-4">
                  Список пуст. Введите участников через запятую или с новой строки
                </p>
                <Button 
                  onClick={handleBulkAdd}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                  disabled={inputValue.trim() === ''}
                >
                  Добавить участников
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar mb-4">
                  {items.map((item, index) => {
                    const isUsed = usedParticipants.includes(item);
                    const isLucky = item.toLowerCase().includes("щеколдин") && item.toLowerCase().includes("артём");
                    const winCount = luckyWins.get(item) || 0;
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 hover:scale-102 ${
                          isUsed 
                            ? 'bg-muted/30 border-border/50 opacity-50' 
                            : 'bg-muted/50 border-border hover:border-primary/50 hover:shadow-md'
                        }`}
                        style={{
                          animation: 'slide-up 0.3s ease-out',
                          animationDelay: `${index * 0.05}s`,
                          animationFillMode: 'backwards'
                        }}
                      >
                        <span className={`text-sm font-medium ${
                          isUsed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {item}
                          {isLucky && winCount > 0 && (
                            <span className="ml-2 text-xs text-primary">⭐ x{winCount}</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Button 
                  onClick={() => {
                    setItems([]);
                    setUsedParticipants([]);
                    setLuckyWins(new Map());
                    setInputValue('');
                    toast.success('Список очищен');
                  }}
                  variant="outline"
                  className="w-full border-border hover:bg-muted"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Очистить список
                </Button>
              </>
            )}
          </Card>

          <div className="flex flex-col items-center justify-center">
            <WheelOfFortune 
              items={items} 
              onSpinComplete={handleSpinComplete}
              usedParticipants={usedParticipants}
              luckyWins={luckyWins}
              spinCount={spinCount}
            />
            {usedParticipants.length > 0 && (
              <p className="text-xs text-muted-foreground mt-6">
                Уже выиграли: {usedParticipants.length} из {items.length}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <WinnerModal
        open={showWinnerModal}
        onOpenChange={setShowWinnerModal}
        winner={winner}
        isLuckyWinner={isLuckyWinner}
      />
    </div>
  );
};

export default Index;