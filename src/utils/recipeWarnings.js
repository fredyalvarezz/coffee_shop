// Etiquetas legibles para cada grupo "variable" de una receta.
export const GROUP_LABELS = {
    milks: "Leche",
    coffeeOptions: "Tipo de café",
    infusionOptions: "Infusión",
    flavors: "Sabor",
};

// Los sabores no viven en una sola lista plana del catálogo — están
// repartidos en catalog.flavorGroups (uno por tipo de producto). Para
// revisar vínculos hay que juntarlos todos.
function getGroupValues(catalog, group) {

    if (group === "flavors") {
        return Object.values(catalog.flavorGroups).flat();
    }

    return catalog[group] || [];

}

// Revisa la receta de un producto y regresa una lista de mensajes de
// advertencia: valores del catálogo sin vincular a ningún insumo (para
// renglones "variables"), o insumos fijos que ya no existen en
// Inventario (por ejemplo si se borraron después de armar la receta).
export function getRecipeWarnings(product, catalog, inventory) {

    const warnings = [];

    if (!product?.recipe?.length) return warnings;

    product.recipe.forEach(line => {

        if (line.type === "variable") {

            const values = getGroupValues(catalog, line.group);
            const links = catalog.inventoryLinks?.[line.group] || {};
            const unlinked = values.filter(v => !links[v]);

            if (unlinked.length > 0) {
                warnings.push(
                    `${GROUP_LABELS[line.group] || line.group} sin vincular: ${unlinked.join(", ")}`
                );
            }

        } else {

            const exists = inventory.some(i => i.id === line.inventoryItemId);

            if (!exists) {
                warnings.push("Un insumo fijo de la receta ya no existe en Inventario.");
            }

        }

    });

    return warnings;

}

export function hasRecipeWarnings(product, catalog, inventory) {
    return getRecipeWarnings(product, catalog, inventory).length > 0;
}