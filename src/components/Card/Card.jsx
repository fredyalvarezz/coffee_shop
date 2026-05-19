import "./Card.css";
import { useNavigate } from "react-router-dom";

export default function Card({ 
  id, 
  title, 
  basePrice, 
  image, 
  stock, 
   }) {

const navigate = useNavigate();

const goToProduct = () => {
    if (!stock) return;

    navigate(`/product/${id}`);
  };

  return (
    <div className="card" onClick={goToProduct}>
      {!stock && (
      <span className="card__badge">
        Agotado
        </span>
        )}
        

      <img className="card__img" src={image} alt={title} />
      <h3 className="card__title">{title}</h3>
      <p className="card__price">${basePrice}</p>
      <button className="card__button" 
      disabled={!stock}
      onClick={(e)=>{
        e.stopPropagation();
        goToProduct();
      }}
      >
        {stock ? "Personalizar" : "Sin stock"}</button>
    </div>
  );
}