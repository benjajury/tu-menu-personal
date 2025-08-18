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

interface RecommendedItem {
  menu_item_id: string;
  name: string;
  category_name: string;
  price: number;
  tipo_carne: string;
  is_keto: boolean;
  drink_type: string;
  sophistication_level: string;
  score: number;
  description: string;
  image_url: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
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
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  console.log('🍽️ MenuPage loaded with preferences:', preferences);

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch recommendations when preferences change
    if (Object.keys(preferences).length > 0) {
      fetchRecommendations();
    }
  }, [preferences]);

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

  const fetchRecommendations = async () => {
    console.log('🎯 Fetching recommendations with preferences:', preferences);
    
    try {
      // Get restaurant ID (assuming first restaurant for now)
      const { data: restaurants } = await supabase.from("restaurants").select("id").limit(1);
      if (!restaurants || restaurants.length === 0) {
        console.log('No restaurants found');
        return;
      }

      const restaurantId = restaurants[0].id;

      // Map preferences to function parameters
      const meatPreference = preferences.meatPreference;
      const dietaryRestriction = preferences.dietaryRestriction;
      const drinkPreference = preferences.drinkPreference;

      // Convert preferences to function parameters
      const params = {
        restaurant_id_param: restaurantId,
        tipo_carne_param: meatPreference && meatPreference !== "Cualquiera" ? [meatPreference] : null,
        is_keto_param: dietaryRestriction === "Keto (low carb)" ? true : null,
        drink_type_param: drinkPreference && drinkPreference !== "Sin alcohol" ? [drinkPreference] : null,
        only_drinks_param: null, // Show both food and drinks
        limit_param: 8
      };

      console.log('📞 Calling recommend_menu_items with params:', params);

      const { data, error } = await supabase.rpc('recommend_menu_items', params);

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }

      console.log('✅ Recommendations received:', data);
      setRecommendations(data || []);
    } catch (error: any) {
      console.error('Error in fetchRecommendations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las recomendaciones",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    if (categoryId === "recomendaciones") return Star;
    // Use ChefHat as default for now, could be enhanced with icon mapping
    return ChefHat;
  };

  const convertRecommendationToMenuItem = (rec: RecommendedItem): MenuItem => ({
    id: rec.menu_item_id,
    name: rec.name,
    description: rec.description,
    price: rec.price,
    image_url: rec.image_url,
    category_id: '', // Not needed for recommendations
    is_available: true, // Already filtered by function
    is_vegetarian: rec.is_vegetarian,
    is_vegan: rec.is_vegan,
    is_gluten_free: rec.is_gluten_free,
    is_keto: rec.is_keto,
    tipo_carne: rec.tipo_carne,
    drink_type: rec.drink_type,
  });

  const getItemsByCategory = (categoryId: string) => {
    if (categoryId === "recomendaciones") {
      return recommendations.map(convertRecommendationToMenuItem);
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