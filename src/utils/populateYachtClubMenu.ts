import { supabase } from "@/integrations/supabase/client";

interface MenuCategory {
  nombre: string;
  icon?: string;
}

interface MenuItem {
  nombre: string;
  descripcion?: string;
  precio: number;
  // Campos adicionales que agregaremos
  enhanced_description?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  spice_level?: 'suave' | 'medio' | 'fuerte';
  cooking_method?: string;
  wine_pairing?: string;
  origin?: string;
  sophistication_level?: 'clásico' | 'premium' | 'signature';
  allergens?: string[];
}

const yachtClubCategories: MenuCategory[] = [
  { nombre: "Appetizers", icon: "🥂" },
  { nombre: "Del mar", icon: "🦞" },
  { nombre: "Carnes", icon: "🥩" },
  { nombre: "Ensaladas de la casa", icon: "🥗" },
  { nombre: "Ensaladas y acompañamientos", icon: "🌿" },
  { nombre: "Salsas", icon: "🍯" },
  { nombre: "Clásicos", icon: "👑" },
  { nombre: "Para los niños", icon: "👶" },
  { nombre: "Sandwiches", icon: "🥪" },
  { nombre: "Postres", icon: "🍰" },
  { nombre: "Café e infusiones", icon: "☕" },
  { nombre: "Bebidas sin alcohol", icon: "🥤" },
  { nombre: "Menú del día", icon: "📅" },
  { nombre: "Aperitivos", icon: "🍸" },
  { nombre: "Sour's", icon: "🍋" },
  { nombre: "Cervezas", icon: "🍺" },
  { nombre: "Tragos", icon: "🥃" },
  { nombre: "Bajativos", icon: "🥂" },
  { nombre: "Vinos - Sauvignon Blanc", icon: "🍷" },
  { nombre: "Vinos - Chardonnay", icon: "🍷" },
  { nombre: "Vinos - Merlot", icon: "🍷" },
  { nombre: "Vinos - Carmenere", icon: "🍷" },
  { nombre: "Vinos - Cabernet Sauvignon", icon: "🍷" },
  { nombre: "Espumantes", icon: "🥂" }
];

const enhancedMenuItems: Record<string, MenuItem[]> = {
  "Appetizers": [
    {
      nombre: "Tabla Club de Yates",
      descripcion: "Calugas de pescado, saltado de camarones, aros de calamar, ceviche de reineta",
      enhanced_description: "Exquisita selección de delicias marinas: suculentas calugas de pescado fresco, camarones salteados en mantequilla aromática, crujientes aros de calamar y refrescante ceviche de reineta marinado en cítricos.",
      precio: 20000,
      sophistication_level: "signature",
      origin: "Costas chilenas",
      wine_pairing: "Sauvignon Blanc o Espumante",
      allergens: ["mariscos", "gluten"]
    },
    {
      nombre: "Empanaditas de Queso (10u)",
      enhanced_description: "Delicadas empanaditas artesanales rellenas con queso premium derretido, envueltas en masa dorada y crujiente.",
      precio: 4500,
      is_vegetarian: true,
      sophistication_level: "clásico",
      cooking_method: "Horneado",
      allergens: ["gluten", "lácteos"]
    },
    {
      nombre: "Empanaditas de Camarones con Queso (10u)",
      enhanced_description: "Exquisitas empanaditas gourmet con jugosos camarones frescos y queso cremoso, perfectamente doradas.",
      precio: 5000,
      sophistication_level: "premium",
      cooking_method: "Horneado",
      origin: "Camarones de aguas chilenas",
      allergens: ["mariscos", "gluten", "lácteos"]
    }
  ],
  "Del mar": [
    {
      nombre: "Cassoulet de ostiones a la espinaca con chutney de tomates",
      enhanced_description: "Selectos ostiones del Pacífico servidos sobre cama de espinacas frescas, acompañados de un aromático chutney de tomates artesanal con hierbas mediterráneas.",
      precio: 12000,
      sophistication_level: "signature",
      cooking_method: "Salteado",
      wine_pairing: "Chardonnay Reserva",
      origin: "Ostiones del Pacífico Sur",
      allergens: ["mariscos"]
    },
    {
      nombre: "Parmesano de Machas en su concha",
      enhanced_description: "Frescas machas en su concha natural, gratinadas con parmesano reggiano añejo y hierbas aromáticas, doradas a la perfección.",
      precio: 14000,
      sophistication_level: "premium",
      cooking_method: "Gratinado",
      wine_pairing: "Sauvignon Blanc",
      origin: "Machas de la costa chilena",
      allergens: ["mariscos", "lácteos"]
    },
    {
      nombre: "Delicia de Locos",
      descripcion: "Con mayonesa y dados de papa",
      enhanced_description: "Tiernos locos del sur de Chile, servidos con mayonesa casera de limón y dados de papa cocida, una preparación clásica de la costa.",
      precio: 16000,
      sophistication_level: "premium",
      cooking_method: "Cocido",
      origin: "Locos del sur de Chile",
      allergens: ["mariscos", "huevos"]
    },
    {
      nombre: "Danza de Ostiones, corales y quesos maduros tibios",
      enhanced_description: "Sublime combinación de ostiones frescos y corales, armonizados con una selección de quesos maduros servidos tibios, creando una sinfonía de sabores marinos.",
      precio: 12000,
      sophistication_level: "signature",
      cooking_method: "Salteado suave",
      wine_pairing: "Chardonnay o Espumante",
      allergens: ["mariscos", "lácteos"]
    },
    {
      nombre: "Atún del autor",
      enhanced_description: "Atún de calidad sushi, preparado con la técnica exclusiva del chef, sellado a la perfección conservando su textura y sabor único.",
      precio: 16000,
      sophistication_level: "signature",
      cooking_method: "Sellado",
      wine_pairing: "Cabernet Sauvignon joven",
      origin: "Atún del Pacífico",
      allergens: ["pescado"]
    },
    {
      nombre: "Paila de Mariscos",
      descripcion: "Ostiones, machas y camarones con pesca del día a fuego con especias y verduras en reducción",
      enhanced_description: "Generosa paila con una sinfonía de mariscos frescos: ostiones, machas y camarones, junto a la pesca del día, cocidos lentamente con especias selectas y verduras en su propia reducción aromática.",
      precio: 16000,
      sophistication_level: "premium",
      cooking_method: "Cocción lenta",
      spice_level: "suave",
      wine_pairing: "Sauvignon Blanc Reserva",
      allergens: ["mariscos", "pescado"]
    },
    {
      nombre: "Grillado de Congrio",
      descripcion: "Acompañado de arroz al limón y ostiones Thai (leche de coco y especias orientales)",
      enhanced_description: "Exquisito congrio dorado a la parrilla, servido con arroz aromático al limón y ostiones preparados al estilo Thai con leche de coco y especias orientales, una fusión única de sabores.",
      precio: 16000,
      sophistication_level: "signature",
      cooking_method: "Grillado",
      wine_pairing: "Chardonnay Reserva",
      origin: "Congrio de aguas chilenas",
      allergens: ["pescado", "mariscos"]
    },
    {
      nombre: "Corvina sellada",
      descripcion: "Espinacas a la crema y papas salteadas al merkén",
      enhanced_description: "Filete de corvina sellado a la perfección, sobre cama de espinacas en crema suave y papas salteadas con merkén patagónico, resaltando los sabores autóctonos.",
      precio: 16000,
      sophistication_level: "premium",
      cooking_method: "Sellado",
      spice_level: "suave",
      wine_pairing: "Sauvignon Blanc",
      origin: "Corvina chilena",
      allergens: ["pescado", "lácteos"]
    },
    {
      nombre: "Reineta o Salmón Grillado",
      descripcion: "A la mantequilla de jengibre o con alcaparras, acompañado de papas bravas",
      enhanced_description: "Filete de reineta o salmón grillado a su elección, bañado en mantequilla aromática de jengibre fresco o con alcaparras mediterráneas, servido con papas bravas crujientes.",
      precio: 15000,
      sophistication_level: "premium",
      cooking_method: "Grillado",
      wine_pairing: "Chardonnay o Sauvignon Blanc",
      origin: "Pesca chilena sustentable",
      allergens: ["pescado", "lácteos"]
    },
    {
      nombre: "Selección a gusto: Congrio / Salmón / Corvina / Atún (Grillado o Frito)",
      enhanced_description: "Elija su pescado favorito de nuestra selección premium: congrio, salmón, corvina o atún, preparado grillado o frito según su preferencia, acompañado de guarnición del día.",
      precio: 9500,
      sophistication_level: "clásico",
      cooking_method: "Grillado o Frito",
      origin: "Pesca chilena del día",
      allergens: ["pescado"]
    },
    {
      nombre: "Reineta o Merluza Austral",
      enhanced_description: "Fresco filete de reineta o merluza austral, preparado de forma tradicional para resaltar su sabor natural y textura delicada.",
      precio: 9500,
      sophistication_level: "clásico",
      cooking_method: "Tradicional",
      origin: "Aguas australes chilenas",
      allergens: ["pescado"]
    }
  ],
  "Carnes": [
    {
      nombre: "Medallón de Filete",
      descripcion: "Suave salsa de pimienta y acompañamiento",
      enhanced_description: "Medallón de filete premium, tierno y jugoso, bañado en una suave salsa de pimienta negra recién molida, acompañado de guarnición gourmet de temporada.",
      precio: 16000,
      sophistication_level: "signature",
      cooking_method: "Grillado",
      wine_pairing: "Cabernet Sauvignon Reserva",
      origin: "Carne premium chilena",
      allergens: ["lácteos"]
    },
    {
      nombre: "Lomo de Res a punto",
      descripcion: "Reducción de merlot y acompañamiento",
      enhanced_description: "Suculento lomo de res cocido a punto, bañado en una intensa reducción de merlot con hierbas aromáticas, servido con acompañamiento de temporada.",
      precio: 15000,
      sophistication_level: "premium",
      cooking_method: "Grillado a punto",
      wine_pairing: "Merlot Reserva",
      origin: "Carne premium chilena"
    }
  ],
  "Ensaladas de la casa": [
    {
      nombre: "Ensalada provenzal con salmón grillado",
      enhanced_description: "Fresca ensalada estilo provenzal con mix de lechugas gourmet, tomates cherry, aceitunas y hierbas aromáticas, coronada con salmón grillado a la perfección.",
      precio: 14000,
      sophistication_level: "premium",
      cooking_method: "Grillado",
      wine_pairing: "Sauvignon Blanc",
      allergens: ["pescado"]
    },
    {
      nombre: "Ensalada verde con jamón serrano y palta",
      enhanced_description: "Selección de hojas verdes premium con láminas de jamón serrano español, palta fresca y aderezo de aceite de oliva extra virgen con hierbas.",
      precio: 12000,
      sophistication_level: "premium",
      origin: "Jamón serrano español",
      allergens: ["cerdo"]
    },
    {
      nombre: "Ensalada de Camarones",
      descripcion: "Parmentier de palta y camarones, aromas cítricos de pica",
      enhanced_description: "Exquisita ensalada con camarones frescos sobre parmentier de palta cremosa, realzada con aromas cítricos de limón de pica, una combinación refrescante y sofisticada.",
      precio: 12000,
      sophistication_level: "premium",
      origin: "Camarones de aguas chilenas",
      allergens: ["mariscos"]
    },
    {
      nombre: "Ensalada César",
      enhanced_description: "Clásica ensalada César con lechuga romana fresca, crutones artesanales, parmesano reggiano y nuestra exclusiva salsa César casera.",
      precio: 10000,
      is_vegetarian: true,
      sophistication_level: "clásico",
      allergens: ["lácteos", "huevos", "gluten", "anchoas"]
    },
    {
      nombre: "Vegetariano o con Atún",
      descripcion: "Lechugas, espinacas, tomate, palta, palmitos, papas, quesillo",
      enhanced_description: "Ensalada completa y nutritiva con mix de lechugas y espinacas frescas, tomates maduros, palta cremosa, palmitos, papas cocidas y quesillo fresco. Opción con atún fresco.",
      precio: 8800,
      is_vegetarian: true,
      sophistication_level: "clásico",
      allergens: ["lácteos"]
    }
  ],
  "Postres": [
    {
      nombre: "Panqueque Celestino",
      enhanced_description: "Delicado panqueque artesanal relleno con dulce de leche premium y nueces, una receta tradicional elevada a la excelencia.",
      precio: 3500,
      is_vegetarian: true,
      sophistication_level: "clásico",
      allergens: ["gluten", "lácteos", "huevos", "frutos secos"]
    },
    {
      nombre: "Panqueque Celestino con helado",
      enhanced_description: "Nuestro clásico panqueque Celestino acompañado de una generosa porción de helado artesanal, creando un contraste perfecto de temperaturas y texturas.",
      precio: 5000,
      is_vegetarian: true,
      sophistication_level: "premium",
      allergens: ["gluten", "lácteos", "huevos", "frutos secos"]
    },
    {
      nombre: "Tiramisú",
      enhanced_description: "Auténtico tiramisú italiano con capas de mascarpone sedoso, café espresso y bizcochos savoiardi, espolvoreado con cacao belga.",
      precio: 4000,
      is_vegetarian: true,
      sophistication_level: "premium",
      origin: "Receta italiana tradicional",
      allergens: ["gluten", "lácteos", "huevos"]
    },
    {
      nombre: "Tres Leches",
      enhanced_description: "Esponjoso bizcocho empapado en la perfecta combinación de tres leches, coronado con merengue suave y canela, un clásico latinoamericano.",
      precio: 4000,
      is_vegetarian: true,
      sophistication_level: "premium",
      allergens: ["gluten", "lácteos", "huevos"]
    }
  ]
};

export async function populateYachtClubMenu() {
  try {
    console.log("Iniciando población del menú del Yacht Club...");

    // 1. Crear las categorías
    for (const category of yachtClubCategories) {
      const { error } = await supabase
        .from("categories")
        .upsert({ 
          name: category.nombre,
          icon: category.icon 
        }, { 
          onConflict: "name"
        });
      
      if (error) {
        console.error(`Error creando categoría ${category.nombre}:`, error);
      }
    }

    // 2. Obtener las categorías creadas para mapear IDs
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*");

    if (categoriesError) {
      throw categoriesError;
    }

    // 3. Crear los items del menú
    for (const [categoryName, items] of Object.entries(enhancedMenuItems)) {
      const category = categories?.find(c => c.name === categoryName);
      if (!category) continue;

      for (const item of items) {
        const menuItem = {
          name: item.nombre,
          description: item.enhanced_description,
          price: item.precio,
          category_id: category.id,
          is_available: true,
          is_vegetarian: item.is_vegetarian || false,
          is_vegan: item.is_vegan || false,
          is_gluten_free: item.is_gluten_free || false,
          spice_level: item.spice_level,
          cooking_method: item.cooking_method,
          wine_pairing: item.wine_pairing,
          origin: item.origin,
          sophistication_level: item.sophistication_level || 'clásico',
          allergens: item.allergens
        };

        const { error } = await supabase
          .from("menu_items")
          .upsert(menuItem, { 
            onConflict: "name"
          });

        if (error) {
          console.error(`Error creando item ${item.nombre}:`, error);
        }
      }
    }

    console.log("¡Menú del Yacht Club poblado exitosamente!");
    return { success: true };

  } catch (error) {
    console.error("Error poblando el menú:", error);
    return { success: false, error };
  }
}