import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Star, Heart } from "lucide-react";
import { FoodCard } from "./FoodCard";
import { CategoryNav } from "./CategoryNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: string;
  is_available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_keto?: boolean;
  tipo_carne?: string;
  drink_type?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface MenuPageProps {
  preferences: Record<string, string>;
  restaurantName: string;
}

export function MenuPage({ preferences, restaurantName }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState("recomendaciones");
  const [isVisible, setIsVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  console.log('🍽️ MenuPage loaded with preferences:', preferences);

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase.from("menu_items").select("*").eq("is_available", true).order("name"),
        supabase.from("categories").select("*").order("display_order", { ascending: true }).order("name", { ascending: true }),
      ]);

      if (itemsRes.error) throw itemsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setMenuItems(itemsRes.data || []);
      
      // Add special categories
      const allCategories = [
        { id: "recomendaciones", name: "Para ti", icon: "⭐" },
        ...(categoriesRes.data || []),
      ];
      setCategories(allCategories);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del menú",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    if (categoryId === "recomendaciones") return Star;
    // Use ChefHat as default for now, could be enhanced with icon mapping
    return ChefHat;
  };

  const getRecommendations = () => {
    console.log('🎯 Getting recommendations with preferences:', preferences);
    console.log('📋 Available menu items:', menuItems.length);
    
    // Start with all available items
    let filteredItems = [...menuItems];
    
    // Apply meat preference filter
    if (preferences.meatPreference && preferences.meatPreference !== "Cualquiera") {
      console.log('🥩 Filtering by meat preference:', preferences.meatPreference);
      if (preferences.meatPreference === "vegetariano") {
        filteredItems = filteredItems.filter(item => 
          item.is_vegetarian || item.is_vegan || item.tipo_carne === "vegetariano"
        );
      } else {
        filteredItems = filteredItems.filter(item => 
          item.tipo_carne === preferences.meatPreference || !item.tipo_carne
        );
      }
    }
    
    // Apply dietary restriction filter
    if (preferences.dietaryRestriction && preferences.dietaryRestriction !== "Ninguna") {
      console.log('🌿 Filtering by dietary restriction:', preferences.dietaryRestriction);
      if (preferences.dietaryRestriction === "Vegetariano") {
        filteredItems = filteredItems.filter(item => item.is_vegetarian);
      } else if (preferences.dietaryRestriction === "Sin gluten") {
        filteredItems = filteredItems.filter(item => item.is_gluten_free);
      } else if (preferences.dietaryRestriction === "Keto (low carb)") {
        filteredItems = filteredItems.filter(item => item.is_keto);
      }
    }
    
    // Apply drink preference filter
    if (preferences.drinkPreference && preferences.drinkPreference !== "Sin alcohol") {
      console.log('🍷 Filtering by drink preference:', preferences.drinkPreference);
      filteredItems = filteredItems.filter(item => 
        item.drink_type === preferences.drinkPreference || !item.drink_type
      );
    }
    
    console.log('🔍 Filtered items:', filteredItems.length);
    
    if (filteredItems.length === 0) {
      console.log('❌ No items match preferences');
      return [];
    }
    
    // Sort by price to create price ranges
    const sortedByPrice = [...filteredItems].sort((a, b) => a.price - b.price);
    
    // Divide into 3 price ranges
    const totalItems = sortedByPrice.length;
    const lowPriceItems = sortedByPrice.slice(0, Math.ceil(totalItems / 3));
    const midPriceItems = sortedByPrice.slice(Math.ceil(totalItems / 3), Math.ceil(2 * totalItems / 3));
    const highPriceItems = sortedByPrice.slice(Math.ceil(2 * totalItems / 3));
    
    console.log('💰 Price ranges:', {
      low: lowPriceItems.length,
      mid: midPriceItems.length, 
      high: highPriceItems.length
    });
    
    const recommendations = [];
    
    // Pick 1 random item from each price range
    if (lowPriceItems.length > 0) {
      const randomLow = lowPriceItems[Math.floor(Math.random() * lowPriceItems.length)];
      recommendations.push(randomLow);
    }
    
    if (midPriceItems.length > 0) {
      const randomMid = midPriceItems[Math.floor(Math.random() * midPriceItems.length)];
      recommendations.push(randomMid);
    }
    
    if (highPriceItems.length > 0) {
      const randomHigh = highPriceItems[Math.floor(Math.random() * highPriceItems.length)];
      recommendations.push(randomHigh);
    }
    
    // If we have less than 3, add more random items
    while (recommendations.length < 6 && filteredItems.length > recommendations.length) {
      const remainingItems = filteredItems.filter(item => 
        !recommendations.some(rec => rec.id === item.id)
      );
      if (remainingItems.length > 0) {
        const randomItem = remainingItems[Math.floor(Math.random() * remainingItems.length)];
        recommendations.push(randomItem);
      } else {
        break;
      }
    }
    
    console.log('⭐ Final recommendations:', recommendations.length, 'items');
    console.log('⭐ Final recommended items:', recommendations.map(item => ({
      name: item.name,
      price: item.price,
      tipo_carne: item.tipo_carne,
      drink_type: item.drink_type
    })));
    
    return recommendations;
  };

  const getItemsByCategory = (categoryId: string) => {
    if (categoryId === "recomendaciones") {
      return getRecommendations();
    }
    return menuItems.filter(item => item.category_id === categoryId);
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
          categories={categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: getCategoryIcon(cat.id)
          }))}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Content */}
      <div className={`pt-32 px-4 pb-8 transition-all duration-700 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
        <div className="max-w-md mx-auto">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando menú...</p>
            </div>
          ) : (
            renderMenuSection(activeCategory)
          )}
        </div>
      </div>
    </div>
  );
}