import { useState } from "react";
import Modal from "../Modal/Modal";
import "./ProductModal.css";
import { useCart } from "../../context/CartContext";

export default function ProductModal({ product, onClose }) {
  const [size, setSize] = useState(product.options?.sizes?.[0] || null);
  const [flavor, setFlavor] = useState(product.options?.flavors?.[0] || null);
  const [milk, setMilk] = useState(product.options?.milks?.[0] || null);
  const [extras, setExtras] = useState({
    shot: false,
    foam: false,
    splenda: false,
    mascabado: false,
    stevia: false,
  });
  const [style, setStyle] = useState(product.options?.styles?.[0] || null);

  const styles = product.options?.styles || [];

  const [note, setNote] = useState("");

  const { addToCart } = useCart();

  // Precio dinámico
  let finalPrice = product.basePrice;

  // Tamaños
  const sizes = product.options?.sizes || [];

  // Sabores
  const flavors = product.options?.flavors || [];

  // Leches
  const milks = product.options?.milks || [];


  if (size === "grande") finalPrice += 10;
  if (size === "mediano") finalPrice += 5;
  if (extras.shot) finalPrice += 15;


  if (style === "frappe") finalPrice += 10;
  if (style === "frio") finalPrice += 5;

  const toggleExtra = (name) => {
    setExtras({ ...extras, [name]: !extras[name] });
  };

  return (

    <Modal onClose={onClose}>
      <h2>{product.title}</h2>

      {/* Estilo de preparacion para las bebidas de temporada */}
      {styles.length > 0 && (
        <div className="product-modal__section">
          <h4>Preparación</h4>
          <div className="product-modal__chips">
            {styles.map((s) => (
              <button
                key={s}
                className={`chip ${style === s ? "chip--active" : ""}`}
                onClick={() => setStyle(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.customizable && (
        <>
          {/* Tamaño */}

          {sizes.length > 0 && (
            < div className="product-modal__section">
              <h4>Tamaño</h4>
              <div className="product-modal__chips">
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`chip ${size === s ? "chip--active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sabores */}
          {flavors.length > 0 && (
            <div className="product-modal__section">
              <h4>Sabores</h4>
              <div className="product-modal__chips">
                {flavors.map((f) => (
                  <button
                    key={f}
                    className={`chip ${flavor === f ? "chip--active" : ""}`}
                    onClick={() => setFlavor(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leche */}
          {milks.length > 0 && (
            <div className="product-modal__section">
              <h4>Leche</h4>
              <div className="product-modal__chips">
                {milks.map((m) => (
                  <button
                    key={m}
                    className={`chip ${milk === m ? "chip--active" : ""}`}
                    onClick={() => setMilk(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          <div className="product-modal__section">
            <h4>Extras</h4>

            <div className="product-modal__extras">
              <label>
                <input type="checkbox" onChange={() => toggleExtra("shot")} />
                Extra Shot (+$15)
              </label>

              <label>
                <input type="checkbox" onChange={() => toggleExtra("foam")} />
                Foam
              </label>

              <label>
                <input type="checkbox" onChange={() => toggleExtra("splenda")} />
                Splenda
              </label>

              <label>
                <input type="checkbox" onChange={() => toggleExtra("mascabado")} />
                Mascabado
              </label>

              <label>
                <input type="checkbox" onChange={() => toggleExtra("stevia")} />
                Stevia
              </label>
            </div>
          </div>


          <div className="product-modal__section">
            <h4>Indicaciones especiales</h4>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: menos hielo, extra caliente..."
            />
          </div>
        </>)
      }

      <h3 className="product-modal__price">Total: ${finalPrice}</h3>



      <button className="modal__add"
        onClick={() => {
          addToCart({
            id: product.id,
            title: product.title,
            price: finalPrice,
            size,
            milk,
            flavor,
            extras,
            style,
            note,
          })
          onClose();

        }}>
        Agregar al carrito
      </button>

    </Modal >
  );
}