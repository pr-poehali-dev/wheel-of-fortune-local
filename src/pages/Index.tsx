import { useState } from 'react';
import WheelOfFortune from '@/components/WheelOfFortune';
import WinnerModal from '@/components/WinnerModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [items, setItems] = useState<string[]>(['Вариант 1', 'Вариант 2', 'Вариант 3']);
  const [inputValue, setInputValue] = useState('');
  const [winner, setWinner] = useState<string>('');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [usedParticipants, setUsedParticipants] = useState<string[]>([]);
  const [luckyWins, setLuckyWins] = useState<Map<string, number>>(new Map());

  const handleAddItem = () => {
    if (inputValue.trim() === '') {
      toast.error('Введите название участника');
      return;
    }
    
    if (items.includes(inputValue.trim())) {
      toast.error('Такой участник уже есть');
      return;
    }

    setItems([...items, inputValue.trim()]);
    setInputValue('');
    toast.success('Участник добавлен');
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    toast.success('Участник удален');
  };

  const handleSpinComplete = (selectedWinner: string) => {
    setWinner(selectedWinner);
    setShowWinnerModal(true);
    
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const isLuckyWinner = winner.toLowerCase().includes("щеколдин") && 
                        winner.toLowerCase().includes("артём");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-6 sm:py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Колесо Фортуны
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Добавьте участников и запустите случайный выбор
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-6 sm:gap-8 items-start">
          <Card className="p-4 sm:p-6 shadow-xl">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">Участники</h2>
            
            <div className="flex gap-2 mb-4 sm:mb-6">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Имя участника или предмета"
                className="flex-1 text-sm sm:text-base"
              />
              <Button onClick={handleAddItem} size="icon" className="shrink-0">
                <Icon name="Plus" size={20} />
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">
                  Список пуст. Добавьте участников.
                </p>
              ) : (
                items.map((item, index) => {
                  const isUsed = usedParticipants.includes(item);
                  const isLucky = item.toLowerCase().includes("щеколдин") && item.toLowerCase().includes("артём");
                  const winCount = luckyWins.get(item) || 0;
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all ${
                        isUsed ? 'bg-muted/50 opacity-60' : 'bg-gradient-to-r from-muted to-muted/50'
                      }`}
                    >
                      <span className={`font-medium text-sm sm:text-base ${
                        isUsed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {item}
                        {isLucky && winCount > 0 && (
                          <span className="ml-2 text-xs text-primary">⭐ x{winCount}</span>
                        )}
                      </span>
                      <Button
                        onClick={() => handleRemoveItem(index)}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-4 pt-4 border-t text-xs sm:text-sm space-y-1">
                <div className="text-muted-foreground">Всего участников: {items.length}</div>
                {usedParticipants.length > 0 && (
                  <div className="text-muted-foreground">Уже выиграли: {usedParticipants.length}</div>
                )}
              </div>
            )}
          </Card>

          <div className="flex flex-col items-center">
            <Card className="p-4 sm:p-6 w-full shadow-xl">
              <WheelOfFortune 
                items={items} 
                onSpinComplete={handleSpinComplete}
                usedParticipants={usedParticipants}
                luckyWins={luckyWins}
              />
            </Card>
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
