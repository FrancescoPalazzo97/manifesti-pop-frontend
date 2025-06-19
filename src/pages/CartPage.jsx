import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

const CartPage = () => {
  const { cart, removeFromCart } = useGlobalContext();

  // Stato locale per le quantità di ogni prodotto
  const [quantities, setQuantities] = useState({});

  // Inizializza le quantità a 1 per ogni prodotto nel carrello
  useEffect(() => {
    const initialQuantities = {};
    cart.forEach((poster) => {
      initialQuantities[poster.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [cart]);

  // Funzione per aumentare la quantità di un prodotto
  const handlePlus = (id, stock) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] < stock ? prev[id] + 1 : prev[id],
    }));
  };

  // Funzione per diminuire la quantità di un prodotto
  const handleMinus = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : prev[id],
    }));
  };




  const calculateSubtotal = () => {
    return cart.reduce((acc, poster) => {
      return acc + (poster.price * (quantities[poster.id] || 1));
    }, 0);
  };

  const subtotal = calculateSubtotal();

  let shipmentCost;
  if (subtotal >= 100) {
    shipmentCost = 0;
  } else {
    shipmentCost = 10;
  }

  const total = subtotal + shipmentCost;

  return (
    <>
      <div className="row">
        <div className="col-12 p-3">
          <h1>Il tuo carrello</h1>
        </div>
      </div>
      {/* Se non ci sono poster nella wishlist mostro messaggio */}
      {cart.length === 0 ? (
        <h2 className="text-center my-5">Nessun Manifesto nel Carrello.</h2>
      ) : (
        <div className="row gx-5">
          <div className="col-lg-6 col-sm-12">
            {cart.map((poster) => {
              const quantity = quantities[poster.id] || 1;
              const isMinusDisabled = quantity <= 1;
              const isPlusDisabled = quantity >= poster.stock_quantity;
              return (
                <div key={poster.id} className="card border-card-cart border-0 rounded-0 py-4">
                  <div className="row g-0">
                    <div className="col-md-4 col-sm-4">
                      <img
                        className="img-fluid"
                        src={poster.image_url}
                        alt={`immagine del manifesto ${poster.title}`}
                      />
                    </div>
                    <div className="col-md-8 col-sm-8 position-relative">
                      <div className="card-body">
                        <h2 className="card-title">{poster.title}</h2>
                        <p className="card-text mt-4">Prezzo: {poster.price}€</p>
                        <div className="d-inline-flex align-items-center border p-1 position-absolute bottom-0 mb-5">
                          <button
                            className={`border-0 bg-white ${isMinusDisabled ? "disabled-class" : ""
                              }`}
                            disabled={isMinusDisabled}
                            onClick={() => handleMinus(poster.id)}
                          >
                            {isMinusDisabled ? (
                              <i className="fa-solid fa-minus text-danger disabled-icon"></i>
                            ) : (
                              <i className="fa-solid fa-minus text-danger button-hover"></i>
                            )}
                          </button>
                          <span style={{ width: '40px' }} className="text-center">{quantity}</span>
                          {console.log(quantity)}
                          <button
                            onClick={() => handlePlus(poster.id, poster.stock_quantity)}
                            className={`border-0 bg-white ${isPlusDisabled ? "disabled-class" : ""
                              }`}
                            disabled={isPlusDisabled}
                          >
                            {isPlusDisabled ? (
                              <i className="fa-solid fa-plus  text-danger disabled-icon"></i>
                            ) : (
                              <i className="fa-solid fa-plus text-danger button-hover "></i>
                            )}
                          </button>
                        </div>
                        <div className="position-absolute top-0 end-0">
                          <i
                            onClick={() => removeFromCart(poster.id)}
                            className="fa-solid fa-x p-3 button-hover"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-lg-6 col-sm-12 mb-3">
            <div className="card p-3 card-price d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between">
                <h6>Subtotale</h6>
                <span>{subtotal.toFixed(2)}&euro;</span>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Spedizione</h6>
                <span>{shipmentCost}&euro;</span>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Totale</h6>
                <span>{total.toFixed(2)}&euro;</span>
              </div>
              <button className="btn btn-outline-secondary mt-2 w-100">
                💳 Acquista Ora
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
