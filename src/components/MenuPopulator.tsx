import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { populateYachtClubMenu } from "@/utils/populateYachtClubMenu";

export function MenuPopulator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPopulated, setIsPopulated] = useState(false);
  const { toast } = useToast();

  const handlePopulateMenu = async () => {
    setIsLoading(true);
    
    try {
      const result = await populateYachtClubMenu();
      
      if (result.success) {
        setIsPopulated(true);
        toast({
          title: "¡Menú cargado exitosamente!",
          description: "El menú completo del Yacht Club de Chile ha sido agregado a la base de datos con descripciones premium y características especiales.",
        });
      } else {
        throw new Error("Error al cargar el menú");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar el menú",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Cargar Menú Yacht Club de Chile
        </CardTitle>
        <CardDescription>
          Carga el menú completo del Yacht Club con descripciones premium y características especiales
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Características incluidas:</h4>
          <ul className="text-sm space-y-1">
            <li>• Descripciones premium y sofisticadas</li>
            <li>• Niveles de picante y sofisticación</li>
            <li>• Métodos de cocción y origen de ingredientes</li>
            <li>• Maridajes de vinos recomendados</li>
            <li>• Información de alérgenos</li>
            <li>• Etiquetas vegetarianas, veganas y sin gluten</li>
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {isPopulated && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Menú cargado exitosamente</span>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Nota importante:</p>
              <p>Esta acción agregará todas las categorías y platos del Yacht Club. Los elementos existentes con el mismo nombre serán actualizados.</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handlePopulateMenu}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            "Cargando menú..."
          ) : (
            "Cargar Menú Completo"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}