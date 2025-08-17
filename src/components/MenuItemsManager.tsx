import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  restaurant_id: string;
  is_available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  spice_level?: string;
  cooking_method?: string;
  wine_pairing?: string;
  origin?: string;
  sophistication_level?: string;
  allergens?: string[];
}

interface Category {
  id: string;
  name: string;
  restaurant_id: string;
}

interface Restaurant {
  id: string;
  name: string;
}

export function MenuItemsManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDrink, setIsDrink] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    is_available: true,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_keto: false,
    tipo_carne: "",
    drink_type: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase.from("menu_items").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (itemsRes.error) throw itemsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setMenuItems(itemsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
      is_available: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_keto: false,
      tipo_carne: "",
      drink_type: "",
    });
    setEditingItem(null);
    setIsDrink(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(data)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Plato actualizado correctamente" });
      } else {
        const { error } = await supabase.from("menu_items").insert([data]);
        if (error) throw error;
        toast({ title: "Plato creado correctamente" });
      }

      fetchData();
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDrink(!!item.drink_type);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      image_url: item.image_url || "",
      category_id: item.category_id || "",
      is_available: item.is_available,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free,
      is_keto: item.is_keto || false,
      tipo_carne: item.tipo_carne || "",
      drink_type: item.drink_type || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este plato?")) return;

    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Plato eliminado correctamente" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Sin categoría";
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Platos del Menú</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Añadir Plato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Editar ${isDrink ? "Trago" : "Plato"}` : `Nuevo ${isDrink ? "Trago" : "Plato"}`}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? `Modifica la información del ${isDrink ? "trago" : "plato"}`
                  : `Añade un nuevo ${isDrink ? "trago" : "plato"} al menú`}
              </DialogDescription>
            </DialogHeader>
            
            {/* Toggle para elegir entre plato y trago */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isDrink"
                checked={isDrink}
                onCheckedChange={(checked) => {
                  setIsDrink(checked);
                  // Reset relevant fields when switching
                  setFormData({
                    ...formData,
                    tipo_carne: "",
                    drink_type: "",
                    is_vegetarian: false,
                    is_vegan: false,
                  });
                }}
              />
              <Label htmlFor="isDrink">Es un trago</Label>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL de la Imagen</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Categoría</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campos específicos para platos */}
              {!isDrink && (
                <div className="space-y-2">
                  <Label htmlFor="tipo_carne">Tipo de Carne</Label>
                  <Select
                    value={formData.tipo_carne}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipo_carne: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo de carne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Roja">Carne Roja</SelectItem>
                      <SelectItem value="Pollo">Pollo</SelectItem>
                      <SelectItem value="Pescado">Pescado</SelectItem>
                      <SelectItem value="Mariscos">Mariscos</SelectItem>
                      <SelectItem value="Vegetariano">Vegetariano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Campos específicos para tragos */}
              {isDrink && (
                <div className="space-y-2">
                  <Label htmlFor="drink_type">Tipo de Bebida</Label>
                  <Select
                    value={formData.drink_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, drink_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo de bebida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vino">Vino</SelectItem>
                      <SelectItem value="Cerveza">Cerveza</SelectItem>
                      <SelectItem value="Tragos">Tragos</SelectItem>
                      <SelectItem value="Sin alcohol">Sin alcohol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_available: checked })
                    }
                  />
                  <Label htmlFor="is_available">Disponible</Label>
                </div>
                
                {/* Para tragos: Sin Alcohol */}
                {isDrink && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sin_alcohol"
                      checked={formData.drink_type === "Sin alcohol"}
                      onCheckedChange={(checked) =>
                        setFormData({ 
                          ...formData, 
                          drink_type: checked ? "Sin alcohol" : "" 
                        })
                      }
                    />
                    <Label htmlFor="sin_alcohol">Sin Alcohol</Label>
                  </div>
                )}
                
                {/* Para platos: Vegetariano */}
                {!isDrink && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_vegetarian"
                      checked={formData.is_vegetarian}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_vegetarian: checked })
                      }
                    />
                    <Label htmlFor="is_vegetarian">Vegetariano</Label>
                  </div>
                )}
              </div>

              {/* Opciones comunes para platos */}
              {!isDrink && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_vegan"
                        checked={formData.is_vegan}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_vegan: checked })
                        }
                      />
                      <Label htmlFor="is_vegan">Vegano</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_gluten_free"
                        checked={formData.is_gluten_free}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_gluten_free: checked })
                        }
                      />
                      <Label htmlFor="is_gluten_free">Sin Gluten</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_keto"
                      checked={formData.is_keto}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_keto: checked })
                      }
                    />
                    <Label htmlFor="is_keto">Keto (Low Carb)</Label>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Guardando..."
                    : editingItem
                    ? "Actualizar"
                    : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{getCategoryName(item.category_id)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.is_available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.is_available ? "Disponible" : "No disponible"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}