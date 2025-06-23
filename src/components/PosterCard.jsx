import { Link } from "react-router-dom"; // Importo Link per navigare tra le pagine
import DiscountLabel from "./DiscountLabel"; // Importo il componente per mostrare l'etichetta sconto
import WishlistButton from "./WishlistButton"; // Importo il bottone wishlist (cuoricino)
import "../styles/posterCard.css"; // Importo lo stile della card
import { useGlobalContext } from "../contexts/GlobalContext"; // Importo il context globale per usare addCart
import { useState } from "react"; // Importo useState per gestire lo stato locale
import CartButton from "./CartButton"

const PosterCard = ({ poster }) => {
  // Estraggo i dati principali dal poster passato come prop
  const { title, artist, size, price, image_url, slug, discount } = poster;

  // Funzione per tradurre la taglia in testo leggibile
  const newSize = (size) => {
    const sizes = {
      sm: 'Small',
      md: 'Medium',
      lg: 'Large'
    };
    return sizes[size] || 'Taglia non specificata'; // Se la taglia non è riconosciuta
  };

  // Calcolo il prezzo scontato se c'è uno sconto
  let discountedPrice = null;
  if (discount && discount > 0) {
    discountedPrice = price * (1 - discount / 100);
  }

  return (
    // Card principale del poster
    <div className="card poster-card d-flex flex-column position-relative border-0 rounded-4">
      {/* Contenitore per i bottoni cuoricino e carrello */}
      <div
        className="wishlist-button-container d-flex align-items-center"
        style={{ gap: "8px", zIndex: 10, position: "absolute", top: "10px", right: "10px" }}
      >
        {/* Bottone wishlist (cuoricino) */}
        <WishlistButton poster={poster} />
        {/* Bottone carrello: aggiunge il poster al carrello globale */}
        <CartButton poster={poster} />
      </div>
      {/* Link che porta alla pagina dettaglio poster */}
      <Link to={`/posters/${slug}`} className={`text-decoration-none text-dark`}>
        {/* Etichetta sconto se presente */}
        <DiscountLabel discount={discount} />
        {/* Immagine del poster */}
        <div className="img-container position-relative">
          <img src={image_url} className="fix-img rounded-4" alt={title} />
          {poster.stock_quantity === 0 && (
            <div className="card-overlay-unavailable">
              Manifesto al momento non disponibile 😭
            </div>
          )}
        </div>
        {/* Corpo della card con titolo, artista, taglia e prezzo */}
        <div className="card-body text-center d-flex flex-column justify-content-between mt-2 border-card">
          <h5 className="card-title fw-bold margin-card-text">{title}</h5>
          <p className="card-text text-muted margin-card-text">Artista: {artist}</p>
          <p className="card-text text-muted ">Taglia: {newSize(size)}</p>
          {/* Mostro prezzo scontato se presente, altrimenti prezzo normale */}
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
