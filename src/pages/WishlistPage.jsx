import { useGlobalContext } from "../contexts/GlobalContext"; // Prendo dati e funzioni dal context globale
import React, { useState } from "react";

const WishlistPage = () => {
  // Usa cartData per accedere a addCart e isInCart
  const { wishlistData, cartData } = useGlobalContext();
  const { wishlist, removeFromWishlist } = wishlistData;
  const { addCart, isInCart } = cartData; // <-- usa anche isInCart

  // Stato per effetto click sui pulsanti
  const [clickedBtn, setClickedBtn] = useState({});

  // Stato per quantità dei poster in wishlist
  const [quantities, setQuantities] = useState({});

  // Inizializza quantità a 1 per ogni poster in wishlist
  React.useEffect(() => {
    const initialQuantities = {};
    wishlist.forEach((poster) => {
      initialQuantities[poster.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [wishlist]);

  // Gestione quantità +
  const handlePlus = (id, stock) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] < stock ? prev[id] + 1 : prev[id],
    }));
  };

  // Gestione quantità -
  const handleMinus = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : prev[id],
    }));
  };

  // Gestore click con effetto animazione
  const handleButtonClick = (type, poster, quantity) => {
    setClickedBtn({ [type + poster.id]: true });
    if (type === "cart") {
      // Se il prodotto è già nel carrello, non aggiungere di nuovo
      if (!isInCart(poster.id)) {
        // Aggiungi al carrello con la quantità scelta
        addCart({ ...poster, quantity: quantity || 1, forceQuantity: true });
      }
    }
    if (type === "remove") removeFromWishlist(poster.id);
    setTimeout(() => setClickedBtn({}), 150);
  };

  // Stili per il pulsante carrello, cambia se attivo (click)
  const cartBtnStyle = (active, disabled) => ({
    padding: "0.3rem 0.5rem",
    backgroundColor: disabled ? "#bdbdbd" : "#e0e0e0",
    color: "#212529",
    border: "1px solid #bdbdbd",
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "background 0.15s, transform 0.1s",
    outline: "none",
    ...(active && !disabled && { backgroundColor: "#bdbdbd", transform: "scale(0.96)" }),
  });

  // Stili per il pulsante rimozione, cambia se attivo (click)
  const removeBtnStyle = (active) => ({
    padding: "0.3rem 0.5rem",
    backgroundColor: "#dc3545", // Rosso di base
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background 0.15s, transform 0.1s",
    ...(active && { backgroundColor: "#b52a38", transform: "scale(0.96)" }),
  });

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
          wishlist.map((poster) => {
            const quantity = quantities[poster.id] || 1;
            const isMinusDisabled = quantity <= 1;
            const isPlusDisabled = poster.stock_quantity ? quantity >= poster.stock_quantity : false;
            const alreadyInCart = isInCart(poster.id);
            return (
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

                  {/* Gestione quantità */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <button
                      onClick={() => handleMinus(poster.id)}
                      disabled={isMinusDisabled}
                      style={{
                        padding: "0.2rem 0.6rem",
                        border: "1px solid red",
                        background: "#fff",
                        borderRadius: 4,
                        cursor: isMinusDisabled ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        fontSize: "1.1rem"
                      }}
                    >-</button>
                    <span style={{ minWidth: 24, textAlign: "center" }}>{quantity}</span>
                    <button
                      onClick={() => handlePlus(poster.id, poster.stock_quantity || 99)}
                      disabled={isPlusDisabled}
                      style={{
                        padding: "0.2rem 0.6rem",
                        border: "1px solid red",
                        background: "#fff",
                        borderRadius: 4,
                        cursor: isPlusDisabled ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        fontSize: "1.1rem"
                      }}
                    >+</button>
                  </div>

                  {/* Bottoni azione */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 180 }}>
                    <button
                      onClick={() => handleButtonClick("cart", poster, quantity)}
                      style={cartBtnStyle(clickedBtn["cart" + poster.id], alreadyInCart)}
                      onMouseDown={() => setClickedBtn({ ["cart" + poster.id]: true })}
                      onMouseUp={() => setClickedBtn({})}
                      onMouseLeave={() => setClickedBtn({})}
                      onMouseOver={e => {
                        if (!alreadyInCart) e.currentTarget.style.backgroundColor = "#cccccc";
                      }}
                      onMouseOut={e => {
                        if (!alreadyInCart) e.currentTarget.style.backgroundColor = clickedBtn["cart" + poster.id] ? "#bdbdbd" : "#e0e0e0";
                      }}
                      disabled={alreadyInCart}
                    >
                      🛒 {alreadyInCart ? "Già nel carrello" : "Aggiungi al carrello"}
                    </button>
                    <button
                      onClick={() => handleButtonClick("remove", poster)}
                      style={removeBtnStyle(clickedBtn["remove" + poster.id])}
                      onMouseDown={() => setClickedBtn({ ["remove" + poster.id]: true })}
                      onMouseUp={() => setClickedBtn({})}
                      onMouseLeave={() => setClickedBtn({})}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = "#b52a38"}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = clickedBtn["remove" + poster.id] ? "#b52a38" : "#dc3545"}
                    >
                      Rimuovi dai preferiti
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default WishlistPage;
