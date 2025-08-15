import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemsManager } from "@/components/MenuItemsManager";
import { CategoriesManager } from "@/components/CategoriesManager";
import { RestaurantsManager } from "@/components/RestaurantsManager";
import { LogOut, Store, Menu, Tags } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cerrar sesión",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">
                Bienvenido, {user.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu-items" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="menu-items" className="flex items-center gap-2">
              <Menu className="w-4 h-4" />
              Platos
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tags className="w-4 h-4" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Restaurantes
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="menu-items">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Platos</CardTitle>
                  <CardDescription>
                    Añade, edita y gestiona los platos del menú
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MenuItemsManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Categorías</CardTitle>
                  <CardDescription>
                    Organiza los platos en categorías
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoriesManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="restaurants">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Restaurantes</CardTitle>
                  <CardDescription>
                    Configura la información del restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RestaurantsManager />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}