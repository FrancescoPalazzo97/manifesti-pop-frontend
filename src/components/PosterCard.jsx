import { Link } from "react-router-dom"; // Importo Link per navigare tra le pagine
import DiscountLabel from "./DiscountLabel"; // Importo il componente per mostrare l'etichetta sconto
import WishlistButton from "./WishlistButton"; // Importo il bottone wishlist (cuoricino)
import "../styles/posterCard.css"; // Importo lo stile della card
import { useGlobalContext } from "../contexts/GlobalContext"; // Importo il context globale per usare addCart
import { useState } from "react"; // Importo useState per gestire lo stato locale

const PosterCard = ({ poster, slider }) => {
  // Estraggo i dati principali dal poster passato come prop
  const { title, artist, size, price, image_url, slug, discount } = poster;

  // Funzione per tradurre la taglia in testo leggibile
  const newSize = () => {
    if (size === "sm") return "Small";
    if (size === "md") return "Medium";
    if (size === "lg") return "Large";
    return "Sconosciuta"; // Se la taglia non è riconosciuta
  };

  // Calcolo il prezzo scontato se c'è uno sconto
  let discountedPrice = null;
  if (discount && discount > 0) {
    discountedPrice = price * (1 - discount / 100);
  }

  // Prendo la funzione addCart dal context globale
  const { addCart } = useGlobalContext();

  // Stato locale per sapere se il carrello è stato cliccato (per cambiare colore)
  const [cartClicked, setCartClicked] = useState(false);

  // Funzione che gestisce il click sul carrello: aggiunge al carrello e lo colora di giallo
  const handleCartClick = () => {
    setCartClicked(true); // Rende il carrello giallo
    addCart(poster); // Aggiunge il poster al carrello globale
    // Nessun timeout: resta giallo dopo il click
  };

  return (
    // Card principale del poster
    <div className="card poster-card d-flex flex-column position-relative border-0 rounded-4">
      {/* Contenitore per i bottoni cuoricino e carrello */}
      <div
        className="wishlist-button-container d-flex align-items-center"
        style={{ gap: "8px" }} // Spazio tra cuoricino e carrello
      >
        {/* Bottone wishlist (cuoricino) */}
        <WishlistButton poster={poster} />
        {/* Bottone carrello: aggiunge il poster al carrello globale */}
        <button
          type="button"
          onClick={handleCartClick} // Al click aggiunge al carrello e colora l'icona
          style={{
            background: "none", // Nessuno sfondo
            border: "none",     // Nessun bordo
            padding: 0,
            cursor: "pointer",
            color: cartClicked ? "#FFD600" : "#fff" // Giallo se cliccato, bianco altrimenti
          }}
          title="Aggiungi al carrello"
        >
          <i className="fa-solid fa-cart-shopping"></i>
        </button>
      </div>
      {/* Link che porta alla pagina dettaglio poster */}
      <Link to={`/posters/${slug}`} className={`text-decoration-none text-dark`}>
        {/* Etichetta sconto se presente */}
        <DiscountLabel discount={discount} />
        {/* Immagine del poster */}
        <div className="img-container ">
          <img src={image_url} className="fix-img rounded-4" alt={title} />
        </div>
        {/* Corpo della card con titolo, artista, taglia e prezzo */}
        <div className="card-body text-center d-flex flex-column justify-content-between mt-2 border-card">
          <h5 className="card-title fw-bold margin-card-text">{title}</h5>
          <p className="card-text text-muted margin-card-text">Artista: {artist}</p>
          <p className="card-text text-muted ">Taglia: {newSize()}</p>
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
