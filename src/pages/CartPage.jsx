import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";
import { Link } from "react-router-dom";
import axios from "axios";

const CartPage = () => {

  const { cartData } = useGlobalContext();

  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = cartData;

  const [form, setForm] = useState({
    nomeCompleto: "",
    email: "",
    via: "",
    numeroCivico: "",
    citta: "",
  });

  // Stato per mostrare/nascondere la form
  const [mostraForm, setMostraForm] = useState(false);

  // Stato per mostrare messaggio di conferma ordine
  const [ordineEffettuato, setOrdineEffettuato] = useState(false);

  // Gestione cambi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Funzione per calcolare il prezzo scontato di un singolo prodotto
  const getDiscountedPrice = (poster) => {
    return poster.price * (1 - poster.discount / 100);
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, poster) => {
      const finalPrice = getDiscountedPrice(poster);
      const quantity = poster.quantity || 1; // Fallback a 1 se undefined
      return acc + finalPrice * quantity; // Usa poster.quantity dal carrello globale
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

  // Gestione submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nomeCompleto || !form.email || !form.via || !form.numeroCivico || !form.citta) {
      alert("Tutti i campi sono obbligatori!");
      return;
    }

    let obj = {
      name: form.nomeCompleto,
      email: form.email,
      address: `${form.via} ${form.numeroCivico}, ${form.citta}`,
      shipment_costs: parseFloat(shipmentCost),
      posters: cart.map((poster) => ({
        id: poster.id,
        quantity: poster.quantity,
      })),
    };

    // Unifica nome e cognome
    console.log("Dati ordine da inviare:", obj);
    axios
      .post("http://localhost:3000/order", obj)
      .then((res) => {
        alert("Ordine effettuato con successo!");
        console.log(res.data);
        clearCart(); // svuota il carrello
        setForm({
          nomeCompleto: "",
          email: "",
          via: "",
          numeroCivico: "",
          citta: "",
        }); // resetta la form
        setMostraForm(false); // nasconde la form
        setOrdineEffettuato(true); // mostra messaggio conferma
      })
      .catch((err) => {
        console.error("Errore nell'invio dell'ordine:", err);
        if (err.response) {
          // Il server ha risposto con un errore
          console.error("Errore risposta server:", err.response.data);
          console.error("Status code:", err.response.status);
          alert(`Errore del server: ${err.response.data.message || 'Errore sconosciuto'}`);
        } else if (err.request) {
          // La richiesta è stata fatta ma non c'è stata risposta
          console.error("Nessuna risposta dal server:", err.request);
          alert("Impossibile contattare il server. Controlla la connessione.");
        } else {
          // Errore nella configurazione della richiesta
          console.error("Errore configurazione:", err.message);
          alert(`Errore: ${err.message}`);
        }
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-12 p-3">
          <h1>Il tuo carrello</h1>
        </div>
      </div>
      {/* Messaggio di conferma ordine */}
      {ordineEffettuato && (
        <div className="alert alert-success text-center my-5">
          Ordine effettuato con successo! Grazie per l'acquisto.
        </div>
      )}
      {/* Se non ci sono poster nella wishlist mostro messaggio */}
      {!ordineEffettuato && cart.length === 0 ? (
        <h2 className="text-center my-5">Nessun Manifesto nel Carrello.</h2>
      ) : !ordineEffettuato && (
        <div className="row gx-4">
          <div className="col-lg-6 col-sm-12">
            {cart.map((poster) => {
              const quantity = poster.quantity || 1;
              const isMinusDisabled = quantity <= 1;
              const isPlusDisabled = quantity >= poster.stock_quantity;

              // Calcolo il prezzo finale (scontato o normale) per questo prodotto
              const finalPrice = getDiscountedPrice(poster);

              return (
                <div
                  key={poster.id}
                  className="card border-card-cart border-0 rounded-0 pb-4"
                >
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

                        {/* Mostro il prezzo con la stessa logica del ProductDetail */}
                        {/* Se c'è uno sconto, mostro prezzo originale barrato e prezzo scontato */}
                        {/* Altrimenti mostro solo il prezzo normale */}
                        <p className="card-text mt-4">
                          Prezzo:{" "}
                          {poster.discount ? (
                            <>
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "gray",
                                  marginRight: "10px",
                                }}
                              >
                                {poster.price}€
                              </span>
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                {finalPrice.toFixed(2)}€
                              </span>
                            </>
                          ) : (
                            <>{poster.price}€</>
                          )}
                        </p>
                        <div className="d-inline-flex align-items-center border p-1 position-absolute bottom-0 mb-5">
                          <button
                            className={`border-0 bg-white ${isMinusDisabled ? "disabled-class" : ""
                              }`}
                            disabled={isMinusDisabled}
                            onClick={() => decreaseQuantity(poster.id)}
                          >
                            {isMinusDisabled ? (
                              <i className="fa-solid fa-minus text-danger disabled-icon"></i>
                            ) : (
                              <i className="fa-solid fa-minus text-danger button-hover"></i>
                            )}
                          </button>
                          <span
                            style={{ width: "40px" }}
                            className="text-center"
                          >
                            {quantity}
                          </span>
                          {console.log(quantity)}
                          <button
                            onClick={() => increaseQuantity(poster.id, poster.stock_quantity)}
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
              <button
                className="btn btn-outline-secondary mt-2 w-100"
                onClick={() => setMostraForm(true)}
                type="button"
              >
                💳 Acquista Ora
              </button>
            </div>
            {mostraForm && (
              <form onSubmit={handleSubmit}>
                <div className="my-3">
                  <label className="form-label">Nome e Cognome</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nomeCompleto"
                    placeholder="Inserisci nome e cognome"
                    value={form.nomeCompleto}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="my-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Inserisci la tua mail"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Via</label>
                  <input
                    type="text"
                    className="form-control"
                    name="via"
                    placeholder="ex. Via Roma"
                    value={form.via}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Numero Civico</label>
                  <input
                    type="text"
                    className="form-control"
                    name="numeroCivico"
                    placeholder="ex. 123"
                    value={form.numeroCivico}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Città</label>
                  <input
                    type="text"
                    className="form-control"
                    name="citta"
                    placeholder="ex. Milano"
                    value={form.citta}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline-secondary w-100"
                >
                  🚀 Procedi all'acquisto
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
