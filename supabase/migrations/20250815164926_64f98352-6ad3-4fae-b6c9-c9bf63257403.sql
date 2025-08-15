-- Agregar campos adicionales para características premium del restaurante
ALTER TABLE menu_items 
ADD COLUMN spice_level TEXT CHECK (spice_level IN ('suave', 'medio', 'fuerte')),
ADD COLUMN cooking_method TEXT,
ADD COLUMN wine_pairing TEXT,
ADD COLUMN origin TEXT,
ADD COLUMN sophistication_level TEXT CHECK (sophistication_level IN ('clásico', 'premium', 'signature')),
ADD COLUMN allergens TEXT[];

-- Agregar comentarios para claridad
COMMENT ON COLUMN menu_items.spice_level IS 'Nivel de picante: suave, medio, fuerte';
COMMENT ON COLUMN menu_items.cooking_method IS 'Método de cocción: grillado, frito, al vapor, etc.';
COMMENT ON COLUMN menu_items.wine_pairing IS 'Maridaje recomendado con vinos';
COMMENT ON COLUMN menu_items.origin IS 'Origen de ingredientes principales';
COMMENT ON COLUMN menu_items.sophistication_level IS 'Nivel de sofisticación del plato';
COMMENT ON COLUMN menu_items.allergens IS 'Lista de alérgenos presentes';