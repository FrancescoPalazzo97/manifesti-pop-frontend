import { useGlobalContext } from "../contexts/GlobalContext"; // Prendo dati e funzioni dal context globale
import React from "react";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useGlobalContext(); // Estraggo wishlist e funzione per rimuovere

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "1rem" }}>
      <h1>Wishlist</h1>

      {/* Se non ci sono poster nella wishlist mostro messaggio */}
      {wishlist.length === 0 ? (
        <p>Nessun poster nei preferiti.</p>
      ) : (
        // Altrimenti mostro ogni poster con immagine, titolo, prezzo e bottone rimuovi
        wishlist.map((poster) => (
          <div
            key={poster.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid #ddd",
              paddingBottom: "1rem",
            }}
          >
            {/* Immagine poster */}
            <img
              src={poster.image_url}
              alt={poster.title}
              width={200}
              style={{ borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
            />

            {/* Contenuto testo e bottone */}
            <div style={{ flexGrow: 1 }}>
              {/* Titolo */}
              <h3>{poster.title}</h3>

              {/* Prezzo: controllo che sia numero e formatto con 2 decimali */}
              <p>
                Prezzo: €{" "}
                {typeof poster.price === "number"
                  ? poster.price.toFixed(2)
                  : poster.price || "n.d."}
              </p>

              {/* Bottone rimuovi */}
              <button
                onClick={() => removeFromWishlist(poster.id)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Rimuovi dai preferiti
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WishlistPage;
