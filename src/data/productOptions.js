export const coffeeOptions = [
  "Expresso",
  "Descafeinado",
];

// Este es tu "inventario" de infusiones base. Para agregar una nueva
// (ej. "Té Verde", "Manzanilla"), solo agrégala aquí — el formulario
// la detecta sola en el selector de "Tipo de infusión".
export const infusionOptions = [
  "Chai",
  "Té Negro",
];

export const productTypes = [
  "Café",
  "Frappé",
  "Postre",
  "Infusiones",
  "Especialidad", // bebidas con leche que no son ni café ni infusión (ej. Taro Latte)
  // Para agregar un producto nuevo (ej. "Smoothie", "Malteada", "Limonada"):
  // 1. Agrégalo aquí.
  // 2. Agrega su entrada en productTypeConfig, abajo.
  // 3. Si necesita sabores propios que no se deban mezclar con los de
  //    café, agrega un grupo nuevo en flavorGroups y apunta a él.
  // Eso es todo: el formulario lo detecta solo, sin tocar ProductForm.jsx
];

// menuCategory es la sección del menú donde se ve el producto. No decide
// qué bloques de opciones aparecen (eso lo hace productTypeConfig), pero
// SÍ está limitada por el tipo de producto — ver menuCategoriesByProductType
// más abajo. Puedes agregar categorías nuevas aquí libremente, ej.
// "Smoothies", y luego habilitarla para el/los productType que correspondan.
export const menuCategories = [
  "Calientes",
  "Frías",
  "Frappés",
  "Temporada",
  "Postres",
];

// Qué categorías de menú puede usar cada tipo de producto. El formulario
// usa esto para que el selector de "Menú" solo muestre opciones que tengan
// sentido (ej. un Frappé no puede ir en "Calientes"). Si agregas un
// productType nuevo, agrega también su entrada aquí; si no la agregas,
// el formulario le deja ver todas las categorías por seguridad.
export const menuCategoriesByProductType = {
  "Café": ["Calientes", "Frías", "Temporada"],
  "Frappé": ["Frappés"],
  "Postre": ["Postres"],
  "Infusiones": ["Calientes", "Frías", "Temporada"],
  "Especialidad": ["Calientes", "Frías", "Frappés", "Temporada"],
};

export const sizes = [
  "Chico",
  "Mediano",
  "Grande",
];

// Sabores agrupados por tipo de producto para que NO se mezclen entre sí.
// Cada productType, en productTypeConfig, dice cuál grupo usar (o `false`
// si ese producto no lleva sabores).
export const flavorGroups = {
  coffee: [
    "Regular",
    "Vainilla",
    "Caramelo",
    "Avellana",
    "Chocolate",
    "Mocha",
  ],
  infusiones: [
    "Regular",
    "Vainilla",
    "Canela",
    "Miel",
  ],
  // Ejemplo para cuando agregues Smoothies/Limonadas:
  // fruta: ["Fresa", "Mango", "Piña", "Maracuyá", "Durazno"],
};

export const milks = [
  "Entera",
  "Deslactosada",
  "Light",
  "Almendra",
  "Avena",
  "Coco",
  "Sin leche",
];

// Estas son las 3 formas de preparación posibles.
// Solo se muestran como checkboxes cuando menuCategory === "Temporada",
// porque en las demás categorías la forma de preparación ya está
// implícita (Calientes -> Caliente, Frías -> Frío, Frappés -> Frappé).
export const preparationOptions = [
  "Caliente",
  "Frío",
  "Frappé",
];

export const extras = [
  { id: "shot", name: "Extra Shot", price: 15 },
  { id: "whippedCream", name: "Crema Batida", price: 10 },
  { id: "foam", name: "Espuma Extra", price: 0 },
  { id: "splenda", name: "Splenda", price: 0 },
  { id: "stevia", name: "Stevia", price: 0 },
  { id: "mascabado", name: "Mascabado", price: 0 },
  { id: "canela", name: "Canela", price: 0 },
];

/**
 * Config por tipo de producto.
 *
 * Le dice al formulario qué bloques mostrar para cada productType, en vez
 * de tenerlo escrito a mano en el JSX. Para agregar un producto nuevo,
 * solo agregas una entrada aquí — no hay que tocar ProductForm.jsx.
 *
 * Campos:
 *  - coffee:   true/false — muestra el bloque "Tipo de café"
 *  - infusionType: true/false — muestra el selector "Tipo de infusión"
 *                  (una sola opción, tomada del inventario en infusionOptions)
 *  - coffeeToggle: true/false — muestra el checkbox "¿Lleva café?"; si se
 *                  marca, se activa el bloque "Tipo de café" para ese producto
 *  - sizes:    true/false — muestra el bloque "Tamaños"
 *  - milks:    true/false — muestra el bloque "Leches"
 *  - flavors:  false, o el nombre de un grupo en flavorGroups (ej. "coffee")
 *  - extras:   true/false — muestra el bloque "Extras"
 *
 * (El bloque "Preparación" NO se controla aquí: se muestra automáticamente
 * cuando menuCategory === "Temporada", sin importar el productType.)
 */
export const productTypeConfig = {
  "Café": {
    coffee: true,
    sizes: true,
    milks: true,
    flavors: "coffee",
    extras: true,
  },
  "Frappé": {
    coffee: false,
    sizes: true,
    milks: true,
    flavors: "coffee",
    extras: true,
  },
  "Postre": {
    coffee: false,
    sizes: false,
    milks: false,
    flavors: false,
    extras: true,
  },
  "Infusiones": {
    coffee: false,
    infusionType: true,  // muestra el selector (una sola infusión) del inventario
    coffeeToggle: true,  // muestra el checkbox "¿Lleva café?"
    sizes: true,
    milks: true,
    flavors: "infusiones",
    extras: true,
  },
  "Especialidad": {
    coffee: false,
    sizes: true,
    milks: true,
    flavors: false,
    extras: true,
  },
};

// Config por defecto por si agregas un productType nuevo en `productTypes`
// y se te olvida agregarlo en `productTypeConfig` — así el formulario no
// se rompe, solo no muestra ningún grupo extra hasta que lo configures.
export const defaultProductTypeConfig = {
  coffee: false,
  infusionType: false,
  coffeeToggle: false,
  sizes: false,
  milks: false,
  flavors: false,
  extras: false,
};
