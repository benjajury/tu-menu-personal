-- Add display_order column to categories table for custom ordering
ALTER TABLE public.categories 
ADD COLUMN display_order INTEGER DEFAULT 999;

-- Update existing categories with default order, prioritizing common menu categories
UPDATE public.categories 
SET display_order = CASE 
  WHEN LOWER(name) LIKE '%aperitiv%' OR LOWER(name) LIKE '%entrada%' THEN 10
  WHEN LOWER(name) LIKE '%plato%' OR LOWER(name) LIKE '%fondo%' OR LOWER(name) LIKE '%principal%' THEN 20
  WHEN LOWER(name) LIKE '%carne%' THEN 21
  WHEN LOWER(name) LIKE '%mar%' OR LOWER(name) LIKE '%pescado%' OR LOWER(name) LIKE '%marisco%' THEN 22
  WHEN LOWER(name) LIKE '%ensalada%' THEN 23
  WHEN LOWER(name) LIKE '%bar%' OR LOWER(name) LIKE '%bebida%' OR LOWER(name) LIKE '%vino%' OR LOWER(name) LIKE '%cerveza%' OR LOWER(name) LIKE '%trago%' OR LOWER(name) LIKE '%sour%' OR LOWER(name) LIKE '%bajativo%' THEN 30
  WHEN LOWER(name) LIKE '%postre%' OR LOWER(name) LIKE '%dulce%' THEN 40
  WHEN LOWER(name) LIKE '%café%' OR LOWER(name) LIKE '%infusion%' THEN 41
  ELSE 999
END;

-- Create index for better ordering performance
CREATE INDEX idx_categories_display_order ON public.categories(display_order, name);