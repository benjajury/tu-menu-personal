import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Star, Heart } from "lucide-react";
import { FoodCard } from "./FoodCard";
import { CategoryNav } from "./CategoryNav";
import pastaImage from "@/assets/pasta-dish.jpg";
import salmonImage from "@/assets/salmon-dish.jpg";
import dessertImage from "@/assets/dessert.jpg";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isRecommended?: boolean;
  dietary?: string[];
}

interface MenuPageProps {
  preferences: Record<string, string>;
  restaurantName: string;
}

const menuItems: MenuItem[] = [
  {
    id: "pasta-trufa",
    name: "Pasta con Trufa Negra",
    description: "Fetuccine artesanal con salsa de trufa negra, parmesano añejo y aceite de oliva extra virgen",
    price: 24.90,
    image: pastaImage,
    category: "principales",
    isRecommended: true,
    dietary: ["vegetarian"]
  },
  {
    id: "salmon-quinoa",
    name: "Salmón con Quinoa",
    description: "Filete de salmón a la plancha con quinoa, vegetales de temporada y salsa de yogurt con hierbas",
    price: 28.50,
    image: salmonImage,
    category: "principales",
    isRecommended: true,
    dietary: ["gluten-free"]
  },
  {
    id: "mousse-chocolate",
    name: "Mousse de Chocolate",
    description: "Mousse de chocolate belga con frutos rojos y menta fresca",
    price: 12.90,
    image: dessertImage,
    category: "postres",
    isRecommended: true
  },
  {
    id: "bruschetta",
    name: "Bruschetta Mediterránea",
    description: "Pan artesanal con tomate, albahaca, mozzarella y reducción de balsámico",
    price: 8.90,
    category: "entradas",
    dietary: ["vegetarian"]
  },
  {
    id: "risotto",
    name: "Risotto de Setas",
    description: "Arroz cremoso con setas de temporada, parmesano y aceite de trufa",
    price: 22.90,
    category: "principales",
    dietary: ["vegetarian", "gluten-free"]
  },
  {
    id: "tiramisu",
    name: "Tiramisú Tradicional",
    description: "Postre italiano clásico con café, mascarpone y cacao",
    price: 9.90,
    category: "postres",
    dietary: ["vegetarian"]
  }
];

const categories = [
  { id: "recomendaciones", name: "Para ti", icon: Star },
  { id: "entradas", name: "Entradas", icon: ChefHat },
  { id: "principales", name: "Principales", icon: Heart },
  { id: "postres", name: "Postres", icon: Star },
];

export function MenuPage({ preferences, restaurantName }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState("recomendaciones");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getRecommendations = () => {
    let recommended = menuItems.filter(item => item.isRecommended);
    
    // Filter by dietary preferences
    if (preferences.dietary && preferences.dietary !== "none") {
      recommended = recommended.filter(item => 
        item.dietary?.includes(preferences.dietary)
      );
    }
    
    return recommended.slice(0, 3);
  };

  const getItemsByCategory = (categoryId: string) => {
    if (categoryId === "recomendaciones") {
      return getRecommendations();
    }
    return menuItems.filter(item => item.category === categoryId);
  };

  const renderMenuSection = (categoryId: string) => {
    const items = getItemsByCategory(categoryId);
    
    if (items.length === 0) return null;

    return (
      <div className="space-y-4">
        {categoryId === "recomendaciones" && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-warm text-white px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4" />
              Recomendaciones personalizadas
            </div>
            {Object.keys(preferences).length > 0 && (
              <p className="text-muted-foreground text-sm mt-2">
                Basado en tus preferencias
              </p>
            )}
          </div>
        )}
        
        <div className="grid gap-4">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`transition-all duration-500 delay-${index * 100}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FoodCard item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Fixed Header */}
      <div className="nav-fixed px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-warm rounded-xl">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gradient">{restaurantName}</h1>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b">
        <CategoryNav 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Content */}
      <div className={`pt-32 px-4 pb-8 transition-all duration-700 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
        <div className="max-w-md mx-auto">
          {renderMenuSection(activeCategory)}
        </div>
      </div>
    </div>
  );
}