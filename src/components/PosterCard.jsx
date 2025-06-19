import { Link } from "react-router-dom";
import DiscountLabel from "./DiscountLabel";
import WishlistButton from "./WishlistButton";
import "../styles/posterCard.css"

const PosterCard = ({ poster, slider }) => {
  const { title, artist, size, price, image_url, slug, discount } = poster;

  const newSize = () => {
    if (size === "sm") return "Small";
    if (size === "md") return "Medium";
    if (size === "lg") return "Large";
    return "Sconosciuta";
  };

  let discountedPrice = null;

  if (discount && discount > 0) {
    discountedPrice = price * (1 - discount / 100);
  }

  return (
    <div className="card poster-card d-flex flex-column position-relative">
      <div className="wishlist-button-container">
        <WishlistButton poster={poster} />
      </div>
      <Link to={`/posters/${slug}`} className={`text-decoration-none`}>
        <DiscountLabel discount={discount} />
        <div className="img-container">
          <img src={image_url} className="fix-img" alt={title} />
        </div>
        <div className="card-body text-center d-flex flex-column justify-content-between">
          <h5 className="card-title fw-bold margin-card-text">{title}</h5>
          <p className="card-text text-muted margin-card-text">{artist}</p>
          <p className="card-text text-muted ">Taglia: {newSize()}</p>
          {discountedPrice ? (
            <p>
              <span className="text-decoration-line-through fw-bold me-3">
                <strong>{price}€</strong>
              </span>
              <span className="text-danger fw-bold">
                <strong>{discountedPrice.toFixed(2)}</strong>
              </span>
            </p>
          ) : (
            <p className="fw-bold">
              <strong>{price}€</strong>
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PosterCard;
