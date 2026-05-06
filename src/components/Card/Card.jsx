import "./Card.css";

export default function Card({ title, basePrice, image, stock, onAdd }) {
  return (
    <div className="card">
      {!stock && <span className="card__badge">Agotado</span>}

      <img className="card__img" src={image} alt={title} />
      <h3 className="card__title">{title}</h3>
      <p className="card__price">${basePrice}</p>
      <button className="card__button" 
      disabled={!stock}
      onClick={onAdd}
      >
        {stock ? "Agregar" : "Sin stock"}</button>
    </div>
  );
}