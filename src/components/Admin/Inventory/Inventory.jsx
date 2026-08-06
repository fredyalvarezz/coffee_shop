import "./Inventory.css";

import { useState } from "react";

import InventoryCard from "./InventoryCard";
import { useAdmin } from "../../../context/AdminContext";
import Modal from "../../../components/Modal/Modal";
import Toast from "../../../components/Toast/Toast";
import {
  FaSearch,
  FaPlus,
} from "react-icons/fa";

const emptyForm = {
  name: "",
  unit: "",
  stock: "",
  minimum: "",
};

export default function Inventory() {

  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  } = useAdmin();

  const [search, setSearch] = useState("");

  // null = el modal de "agregar/editar" está cerrado.
  // {} (objeto vacío-ish) = está abierto en modo "editar" con ese item.
  const [editingItem, setEditingItem] = useState(null);

  // Controla si el modal de agregar/editar está abierto. Se separa de
  // editingItem porque "Agregar" también abre el modal, pero sin item.
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [itemToDelete, setItemToDelete] = useState(null);

  const [showToast, setShowToast] = useState(false);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNewItemForm = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditItemForm = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      unit: item.unit,
      stock: item.stock,
      minimum: item.minimum,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    form.name.trim().length > 0 &&
    form.unit.trim().length > 0 &&
    Number(form.stock) >= 0 &&
    Number(form.minimum) >= 0;

  const handleSaveItem = () => {

    if (!isFormValid) {
      alert("Completa nombre, unidad, stock y mínimo (números válidos) antes de guardar.");
      return;
    }

    const itemData = {
      name: form.name.trim(),
      unit: form.unit.trim(),
      stock: Number(form.stock),
      minimum: Number(form.minimum),
    };

    if (editingItem) {
      updateInventoryItem(editingItem.id, itemData);
    } else {
      addInventoryItem(itemData);
    }

    closeForm();

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 1500);

  };

  const confirmDelete = () => {

    deleteInventoryItem(itemToDelete.id);

    setItemToDelete(null);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 1500);

  };

  return (
    <section className="inventory">

      <div className="inventory__header">

        <h1>Inventario</h1>

        <div className="inventory__controls">

          <div className="inventory__search-container">
            <FaSearch className="inventory__search-icon" />

            <input
              type="text"
              className="inventory__search"
              placeholder="Buscar insumo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="inventory__button"
            onClick={openNewItemForm}
          >
            <FaPlus />
            Nuevo Insumo
          </button>

        </div>

      </div>

      <p className="inventory__count">
        {filteredInventory.length} insumos encontrados
      </p>

      <div className="inventory__grid">

        {filteredInventory.map((item) => (

          <InventoryCard
            key={item.id}
            item={item}
            onEdit={() => openEditItemForm(item)}
            onDelete={() => setItemToDelete(item)}
          />

        ))}

      </div>

      {/* Modal Agregar / Editar insumo */}
      {showForm && (
        <Modal
          title={editingItem ? "Editar insumo" : "Nuevo insumo"}
          onClose={closeForm}
        >

          <div className="inventory__form">

            <div className="inventory__form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Ej. Café Espresso"
              />
            </div>

            <div className="inventory__form-group">
              <label>Unidad</label>
              <input
                type="text"
                name="unit"
                value={form.unit}
                onChange={handleFormChange}
                placeholder="Ej. kg, L, botellas, unidades"
              />
            </div>

            <div className="inventory__form-row">

              <div className="inventory__form-group">
                <label>Stock actual</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleFormChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="inventory__form-group">
                <label>Mínimo</label>
                <input
                  type="number"
                  name="minimum"
                  value={form.minimum}
                  onChange={handleFormChange}
                  placeholder="0"
                  min="0"
                />
              </div>

            </div>

            <div className="inventory__form-actions">

              <button
                className="inventory__button"
                onClick={handleSaveItem}
              >
                {editingItem ? "Guardar cambios" : "Agregar insumo"}
              </button>

              <button
                className="inventory__button inventory__button--secondary"
                onClick={closeForm}
              >
                Cancelar
              </button>

            </div>

          </div>

        </Modal>
      )}

      {/* Modal Confirmación de eliminar */}
      {itemToDelete && (
        <Modal
          title="Eliminar insumo"
          onClose={() => setItemToDelete(null)}
        >

          <div className="inventory__confirm">

            <p>
              ¿Seguro que deseas eliminar "{itemToDelete.name}"?
              Esta acción no se puede deshacer.
            </p>

            <div className="inventory__confirm-buttons">

              <button
                className="inventory__confirm-cancel"
                onClick={() => setItemToDelete(null)}
              >
                Cancelar
              </button>

              <button
                className="inventory__confirm-delete"
                onClick={confirmDelete}
              >
                Sí, eliminar
              </button>

            </div>

          </div>

        </Modal>
      )}

      <Toast
        message="Cambios guardados ✅"
        type="success"
        isVisible={showToast}
      />

    </section>
  );
}
