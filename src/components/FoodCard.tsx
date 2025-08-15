import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Leaf } from "lucide-react";

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
}

interface FoodCardProps {
  item: MenuItem;
}

export function FoodCard({ item }: FoodCardProps) {
  const getDietaryBadge = (dietary: string) => {
    const badges = {
      vegetarian: { label: "Vegetariano", icon: Leaf, color: "bg-green-100 text-green-800" },
      vegan: { label: "Vegano", icon: Leaf, color: "bg-green-100 text-green-800" },
      "gluten-free": { label: "Sin Gluten", icon: null, color: "bg-blue-100 text-blue-800" }
    };
    
    return badges[dietary as keyof typeof badges];
  };

  return (
    <Card className="food-card p-0 overflow-hidden">
      <div className="flex">
        {/* Image */}
        {item.image_url && (
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground text-sm leading-tight">
                  {item.name}
                </h3>
              </div>
              
              <p className="text-muted-foreground text-xs leading-relaxed mb-2">
                {item.description}
              </p>
              
              {/* Dietary badges */}
              <div className="flex flex-wrap gap-1 mb-2">
                {item.is_vegetarian && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Leaf className="h-3 w-3" />
                    Vegetariano
                  </div>
                )}
                {item.is_vegan && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Leaf className="h-3 w-3" />
                    Vegano
                  </div>
                )}
                {item.is_gluten_free && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Sin Gluten
                  </div>
                )}
              </div>
            </div>
            
            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="bg-gradient-warm text-white px-3 py-1 rounded-full">
                <span className="font-bold text-sm">€{item.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}