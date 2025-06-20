import { useGlobalContext } from "../contexts/GlobalContext"; // Prendo dati e funzioni dal context globale

const WishlistPage = () => {

  const { wishlistData, addCart } = useGlobalContext(); // Estraggo anche addCart

  const { wishlist, removeFromWishlist } = wishlistData;

  return (
    <>
      <div className="row">
        <div className="col-12 p-3">
          <h1>Wishlist</h1>
        </div>
      </div>
      <div className="row d-flex flex-column align-items-center">

        {/* Se non ci sono poster nella wishlist mostro messaggio */}
        {wishlist.length === 0 ? (
          <h2 className="text-center my-5">Nessun Manifesto nei preferiti.</h2>
        ) : (
          // Altrimenti mostro ogni poster con immagine, titolo, prezzo e bottoni azione
          wishlist.map((poster) => (
            <div
              key={poster.id}
              className="d-flex justify-content-center w-100"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
                borderBottom: "1px solid #ddd",
                paddingBottom: "1rem",
                maxWidth: 600, 
              }}
            >
              {/* Immagine poster */}
              <img
                src={poster.image_url}
                alt={poster.title}
                width={200}
                style={{ borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
              />

              {/* Contenuto testo e bottoni */}
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

                {/* Bottoni azione */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 180 }}>
                  <button
                    onClick={() => addCart(poster)}
                    style={{
                      padding: "0.3rem 0.5rem",
                      backgroundColor: "#FFFFFF",
                      color: "#212529",
                      border: "1px solid #dc3545",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.95rem"
                    }}
                  >
                    🛒 Aggiungi al carrello
                  </button>
                  <button
                    onClick={() => removeFromWishlist(poster.id)}
                    style={{
                      padding: "0.3rem 0.5rem",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: "0.95rem"
                    }}
                  >
                    Rimuovi dai preferiti
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default WishlistPage;
