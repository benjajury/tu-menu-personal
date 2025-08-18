import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat } from "lucide-react";
import { FoodCard } from "./FoodCard";
import { CategoryNav } from "./CategoryNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DebugOverlay from "./DebugOverlay";   // 👈 agregado
import { isDebug } from "@/lib/debug";       // 👈 agregado

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

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [recommended, setRecommended] = useState<MenuItem[]>([]);
  const { toast } = useToast();

  // --- FETCH ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data, error } = await supabase.from("menu_items").select("*");
        if (error) throw error;

        if (isDebug) {
          console.log("[DEBUG] fetch menu_items →", {
            count: data?.length,
            sample: data?.slice(0, 5),
          });
          console.table(data?.slice(0, 10), [
            "name",
            "tipo_carne",
            "drink_type",
            "is_keto",
          ]);
        }

        setMenuItems(data ?? []);
      } catch (e: any) {
        console.error("[DEBUG] fetch error", e.message);
        toast({
          title: "Error",
          description: "No se pudo cargar el menú.",
          variant: "destructive",
        });
      }
    };
    fetchMenu();
  }, [toast]);

  // --- DEBUG de recomendados ---
  useEffect(() => {
    if (isDebug) {
      console.log("[DEBUG] render “Recomendados” →", {
        recommendedCount: recommended.length,
        sample: recommended.slice(0, 3),
      });
    }
  }, [recommended]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <ChefHat className="w-6 h-6" /> Menú
      </h1>

      {/* Categoría fija: Recomendados */}
      <h2 className="text-xl font-semibold mb-2">Recomendados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {recommended.length ? (
          recommended.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))
        ) : (
          <p className="text-sm opacity-70">
            No se encontraron recomendaciones.
          </p>
        )}
      </div>

      {/* Categorías normales */}
      <CategoryNav items={menuItems} />

      {/* Debug overlay */}
      <DebugOverlay
        menuItems={menuItems}
        answers={undefined} // 👈 aquí no toco tu lógica, solo muestro lo que haya
        recommended={recommended}
      />
    </div>
  );
}
