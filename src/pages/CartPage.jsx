import { useState } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { emailService } from "../services/emailService";
import { Row } from "react-bootstrap";

const CartPage = () => {
  const { cartData, setOrderData, orderData } = useGlobalContext();

  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = cartData;

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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Gestione cambi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Funzione per calcolare il prezzo scontato di un singolo prodotto
  const getDiscountedPrice = (poster) => {
    // Converte sempre a numero per sicurezza
    const price = parseFloat(poster.price) || 0;
    const discount = parseFloat(poster.discount) || 0;
    return price * (1 - discount / 100);
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    if (
      !form.nomeCompleto ||
      !form.email ||
      !form.via ||
      !form.numeroCivico ||
      !form.citta
    ) {
      alert("Tutti i campi sono obbligatori!");
      setLoading(false);
      return;
    }

    try {
      // Procedi con l'ordine
      await inviaOrdine();
    } catch (err) {
      console.error("Errore invio email:", err);
      setError(err.error || "Errore nell'invio dell'email");
    } finally {
      setLoading(false);
    }
  };

  // Funzione separata per l'ordine:
  const inviaOrdine = async () => {
    const obj = {
      name: form.nomeCompleto,
      email: form.email,
      address: `${form.via} ${form.numeroCivico}, ${form.citta}`,
      shipment_costs: parseFloat(shipmentCost),
      posters: cart.map((poster) => ({
        id: poster.id,
        quantity: poster.quantity || 1,
      })),
    };

    console.log("Dati ordine da inviare:", obj);

    try {
      // 1. Salva l'ordine
      const response = await axios.post("http://localhost:3000/order", obj);
      console.log("Ordine salvato:", response.data);

      //prendo l'ID dell'ordine dalla risposta
      const orderId =
        response.data.orderId ||
        Math.random().toString(36).substr(2, 9).toUpperCase();

      const confirmOrderData = {
        nome: form.nomeCompleto,
        email: form.email,
        orderId: orderId,
        orderDate: new Date().toLocaleDateString("it-IT", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        indirizzo: `${form.via} ${form.numeroCivico}, ${form.citta}`,
        prodotti: cart.map((poster) => ({
          id: poster.id,
          titolo: poster.title,
          quantita: poster.quantity || 1,
          prezzo_unitario: parseFloat(poster.price) || 0,
          sconto: parseFloat(poster.discount) || 0,
          prezzo_finale: getDiscountedPrice(poster),
          image_url: poster.image_url,
        })),
        subtotal: subtotal,
        spedizione: shipmentCost,
        totale: total,
      };

      setOrderData(confirmOrderData);

      // 2. Prepara i dati per l'email di conferma - CON CONVERSIONI SICURE
      const orderData = {
        customerEmail: form.email,
        customerName: form.nomeCompleto,
        orderId:
          response.data.orderId ||
          Math.random().toString(36).substr(2, 9).toUpperCase(),
        orderDate: new Date().toLocaleDateString("it-IT", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        items: cart.map((poster) => {
          // ✅ CONVERSIONI SICURE - converte sempre a numero
          const originalPrice = parseFloat(poster.price) || 0;
          const finalPrice = getDiscountedPrice(poster);

          return {
            title: poster.title || "Prodotto",
            quantity: poster.quantity || 1,
            originalPrice: originalPrice.toFixed(2), // Ora è sicuro usare toFixed
            finalPrice: finalPrice.toFixed(2), // Ora è sicuro usare toFixed
            discount: parseFloat(poster.discount) || 0,
            image_url: poster.image_url || "",
          };
        }),
        subtotal: subtotal,
        shippingCost: shipmentCost,
        total: total,
        shippingAddress: `${form.via} ${form.numeroCivico}, ${form.citta}`,
      };

      // 3. Invia email di conferma
      console.log("Invio email di conferma ordine...", orderData);
      const emailResult = await emailService.sendOrderConfirmationEmail(
        orderData
      );

      if (emailResult.success) {
        console.log("Email di conferma inviata:", emailResult.messageId);
        setMessage(
          `Ordine confermato! Email di conferma inviata a ${form.email}`
        );
      } else {
        console.warn("Errore invio email conferma:", emailResult.error);
        setMessage("Ordine confermato! (Email di conferma non inviata)");
      }

      clearCart();
      setForm({
        nomeCompleto: "",
        email: "",
        via: "",
        numeroCivico: "",
        citta: "",
      });
      setMostraForm(false);
      setOrdineEffettuato(true);
    } catch (err) {
      console.error("Errore nell'invio dell'ordine:", err);

      if (err.response) {
        console.error("Errore risposta server:", err.response.data);
        alert(
          `Errore del server: ${
            err.response.data.message || "Errore sconosciuto"
          }`
        );
      } else if (err.request) {
        console.error("Nessuna risposta dal server:", err.request);
        alert("Impossibile contattare il server. Controlla la connessione.");
      } else {
        console.error("Errore configurazione:", err.message);
        alert(`Errore: ${err.message}`);
      }
      throw err;
    }
  };

  return (
    <>
      {/* Messaggio di conferma ordine */}
      {ordineEffettuato && orderData && (
        <>
          <div className="container">
            <div className="row mb-4">
              <div className="col-12 my-4 ">
                <h4 className="mb-2">
                  <b>
                    Ciao <span className="text-danger">{orderData.nome}</span>,
                  </b>
                </h4>
                <p className="fs-5">
                  Siamo contenti che tu abbia trovato il tuo poster!
                  <br /> Abbiamo ricevuto il tuo ordine e stiamo elaborando la
                  tua richiesta, presto riceverai un'
                  <span className="text-danger">email di conferma</span> con i
                  dettagli del tuo acquisto.
                </p>
              </div>
              <div className="col-6">
                <h3>
                  <b>Indirizzo di spedizione</b>
                </h3>
                <p className="fs-5 m-1">Nome: {orderData.nome}</p>
                <p className="fs-5 m-1">Email: {orderData.email}</p>
                <p className="fs-5 m-1">Indirizzo: {orderData.indirizzo}</p>
              </div>
              <div className="col-6 text-end">
                <h3 className="mb-2">
                  <b>Ordine numero:</b>
                </h3>
                <p className="lh-lg mb-1">{orderData.orderId}</p>
                <h5>
                  <b>Data:</b>
                </h5>
                <p>{orderData.orderDate}</p>
              </div>
            </div>
            <hr />
            <div className="row mt-4">
              <div className="col-12 mb-3">
                <h6>
                  <b>
                    La consegna avverrà entro{" "}
                    <span className="text-danger">10 giorni lavorativi</span>
                  </b>
                </h6>
              </div>

              {orderData.prodotti.map((poster, idx) => (
                <div className="col-6">
                  <div
                    className="card mb-3 order-summary-card"
                    style={{
                      maxWidth: "540px",
                      minHeight: "200px",
                    }}
                    key={idx}
                  >
                    <div className="row g-0 h-100">
                      <div className="col-md-4">
                        <img
                          src={poster.image_url}
                          className="img-fluid rounded-start h-100"
                          style={{ objectFit: "cover", minHeight: "200px" }}
                          alt={`immagine del manifesto ${poster.titolo}`}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body mt-5">
                          <h5 className="card-title">
                            <b>{poster.titolo}</b>
                          </h5>
                          <p className="card-text">
                            quantità: {poster.quantita}
                          </p>
                          <p className="card-text">
                            &euro; {poster.prezzo_finale.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="row">
              <div className="col-12 mb-3">
                <h4>Riepilogo Ordine</h4>
                <p className="my-2">
                  Subtotale: {orderData.subtotal.toFixed(2)}&euro;
                </p>
                <p className="my-2">
                  Spedizione: {orderData.spedizione.toFixed(2)}&euro;
                </p>
                <p className="my-2">
                  Totale: {orderData.totale.toFixed(2)}&euro;
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Se non ci sono poster nella wishlist mostro messaggio */}
      {!ordineEffettuato && (
        <>
          <div className="row">
            <div className="col-12 p-3">
              <h1>Il tuo carrello</h1>
            </div>
          </div>
          {cart.length === 0 ? (
            <h2 className="text-center my-5">Nessun Manifesto nel Carrello.</h2>
          ) : (
            <div className="row gx-4">
              <div className="col-lg-6 col-sm-12">
                {cart.map((poster) => {
                  const quantity = poster.quantity || 1;
                  const isMinusDisabled = quantity <= 1;
                  const isPlusDisabled = quantity >= poster.stock_quantity;
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
                                className={`border-0 bg-white ${
                                  isMinusDisabled ? "disabled-class" : ""
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
                              <button
                                onClick={() =>
                                  increaseQuantity(
                                    poster.id,
                                    poster.stock_quantity
                                  )
                                }
                                className={`border-0 bg-white ${
                                  isPlusDisabled ? "disabled-class" : ""
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
                                className="fa-solid fa-x p-3 button-hover-cancell"
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
                    {message && (
                      <div className="alert alert-success mt-3">{message}</div>
                    )}

                    {error && (
                      <div className="alert alert-danger mt-3">{error}</div>
                    )}
                    <button
                      type="submit"
                      className="btn btn-outline-secondary w-100"
                      disabled={loading}
                    >
                      {loading
                        ? "⏳ Elaborazione in corso..."
                        : "🚀 Procedi all'acquisto"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CartPage;
