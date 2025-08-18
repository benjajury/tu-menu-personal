-- Arreglar tipo de datos en función de recomendaciones
DROP FUNCTION IF EXISTS public.recommend_menu_items;

CREATE OR REPLACE FUNCTION public.recommend_menu_items(
  restaurant_id_param UUID,
  tipo_carne_param TEXT[] DEFAULT NULL,
  is_keto_param BOOLEAN DEFAULT NULL,
  drink_type_param TEXT[] DEFAULT NULL,
  budget_min_param NUMERIC DEFAULT NULL,
  budget_max_param NUMERIC DEFAULT NULL,
  sophistication_param TEXT[] DEFAULT NULL,
  only_drinks_param BOOLEAN DEFAULT NULL,
  limit_param INTEGER DEFAULT 8
)
RETURNS TABLE (
  menu_item_id UUID,
  name TEXT,
  category_name TEXT,
  price NUMERIC,
  tipo_carne TEXT,
  is_keto BOOLEAN,
  drink_type TEXT,
  sophistication_level TEXT,
  score DOUBLE PRECISION,
  description TEXT,
  image_url TEXT,
  is_vegetarian BOOLEAN,
  is_vegan BOOLEAN,
  is_gluten_free BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH base AS (
    SELECT 
      mi.id,
      mi.name,
      c.name as category_name,
      mi.price,
      mi.tipo_carne,
      mi.is_keto,
      mi.drink_type,
      mi.sophistication_level,
      mi.description,
      mi.image_url,
      mi.is_vegetarian,
      mi.is_vegan,
      mi.is_gluten_free
    FROM menu_items mi
    LEFT JOIN categories c ON mi.category_id = c.id
    WHERE mi.restaurant_id = restaurant_id_param 
      AND mi.is_available = true
      AND (
        only_drinks_param IS NULL 
        OR (only_drinks_param = true AND mi.drink_type IS NOT NULL)
        OR (only_drinks_param = false AND mi.drink_type IS NULL)
      )
      AND (
        budget_min_param IS NULL 
        OR mi.price >= budget_min_param
      )
      AND (
        budget_max_param IS NULL 
        OR mi.price <= budget_max_param
      )
  ),
  scored AS (
    SELECT 
      b.*,
      -- Calcular score basado en preferencias
      (
        -- +40 puntos si tipo_carne coincide
        CASE 
          WHEN tipo_carne_param IS NOT NULL 
               AND b.tipo_carne IS NOT NULL 
               AND b.tipo_carne = ANY(tipo_carne_param) 
          THEN 40 
          ELSE 0 
        END +
        
        -- +25 puntos si is_keto coincide
        CASE 
          WHEN is_keto_param IS NOT NULL 
               AND b.is_keto = is_keto_param 
          THEN 25 
          ELSE 0 
        END +
        
        -- +20 puntos si drink_type coincide
        CASE 
          WHEN drink_type_param IS NOT NULL 
               AND b.drink_type IS NOT NULL 
               AND b.drink_type = ANY(drink_type_param) 
          THEN 20 
          ELSE 0 
        END +
        
        -- +10 puntos si sophistication coincide
        CASE 
          WHEN sophistication_param IS NOT NULL 
               AND b.sophistication_level IS NOT NULL 
               AND b.sophistication_level = ANY(sophistication_param) 
          THEN 10 
          ELSE 0 
        END +
        
        -- Penalización suave por distancia al centro del presupuesto
        CASE 
          WHEN budget_min_param IS NOT NULL AND budget_max_param IS NOT NULL
          THEN -(ABS(b.price - ((budget_min_param + budget_max_param) / 2)) / 1000)
          ELSE 0
        END +
        
        -- Factor aleatorio pequeño para desempate
        (random() * 0.5)
      ) as calculated_score
    FROM base b
  )
  SELECT 
    s.id,
    s.name,
    s.category_name,
    s.price,
    s.tipo_carne,
    s.is_keto,
    s.drink_type,
    s.sophistication_level,
    s.calculated_score,
    s.description,
    s.image_url,
    s.is_vegetarian,
    s.is_vegan,
    s.is_gluten_free
  FROM scored s
  ORDER BY s.calculated_score DESC, s.price ASC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;