import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Sparkles } from "lucide-react";
import restaurantHero from "@/assets/restaurant-hero.jpg";

interface WelcomeScreenProps {
  onContinue: () => void;
  restaurantName: string;
}

export function WelcomeScreen({ onContinue, restaurantName }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Navigation */}
      <nav className="nav-fixed px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-ocean rounded-xl">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gradient">Yacht Club Chile</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`flex-1 pt-20 px-4 pb-8 transition-all duration-700 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
        <div className="max-w-md mx-auto space-y-6">
          {/* Hero Image */}
          <div className="relative overflow-hidden rounded-3xl">
            <img 
              src={restaurantHero} 
              alt="Ambiente del restaurante"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Welcome Card */}
          <Card className="card-elegant text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-ocean rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¡Bienvenido!
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Personaliza tu experiencia y descubre nuestras recomendaciones especiales 
                basadas en tus preferencias gastronómicas.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button 
                onClick={onContinue}
                className="btn-restaurant w-full"
                size="lg"
              >
                Comenzar experiencia
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Solo te tomará 30 segundos ✨
              </p>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-sm text-muted-foreground">Recomendaciones personalizadas</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-sm text-muted-foreground">Navegación rápida</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}