import { useState } from 'react';
import WheelOfFortune from '@/components/WheelOfFortune';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [items, setItems] = useState<string[]>(['Вариант 1', 'Вариант 2', 'Вариант 3']);
  const [inputValue, setInputValue] = useState('');
  const [winner, setWinner] = useState<string>('');

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
    toast.success(`Победитель: ${selectedWinner}`, {
      duration: 5000,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Колесо Фортуны</h1>
          <p className="text-muted-foreground text-lg">
            Добавьте участников и запустите случайный выбор
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Участники</h2>
            
            <div className="flex gap-2 mb-6">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Имя участника или предмета"
                className="flex-1"
              />
              <Button onClick={handleAddItem} size="icon">
                <Icon name="Plus" size={20} />
              </Button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Список пуст. Добавьте участников.
                </p>
              ) : (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="font-medium text-foreground">{item}</span>
                    <Button
                      onClick={() => handleRemoveItem(index)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                Всего участников: {items.length}
              </div>
            )}
          </Card>

          <div className="flex flex-col items-center">
            <Card className="p-6 w-full">
              <WheelOfFortune items={items} onSpinComplete={handleSpinComplete} />
            </Card>

            {winner && (
              <Card className="p-6 mt-6 w-full bg-primary/10 border-primary">
                <div className="text-center">
                  <Icon name="Trophy" size={48} className="mx-auto mb-3 text-primary" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Победитель!</h3>
                  <p className="text-2xl font-bold text-primary">{winner}</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
