import React, { useState } from 'react'
import './ProductDetail.css' 

function ProductDetail() {
  //  Oggetto prodotto statico
  const prodotto = {
    nome: "Poster-venditti",
    descrizione: "Un poster elegante e vibrante che celebra il leggendario cantautore romano Antonello Venditti. Perfetto per gli appassionati di musica italiana e per decorare con stile qualsiasi ambiente, questo poster cattura l'essenza di uno degli artisti più amati e iconici del panorama musicale",
    prezzo: 24.99,
    immagine: "https://img.freepik.com/foto-gratuito/moda-veloce-vs-moda-sostenibile-lenta_23-2149134026.jpg?semt=ais_hybrid&w=740"
  }

  //  Taglie selezionabili
  const [selectedSize, setSelectedSize] = useState(null);
  const sizes = ["S", "M", "L"];

  // Dati statici delle recensioni
  const recensioni = [
    {
      utente: "Marco R.",
      voto: 5,
      testo: "Poster bellissimo! Carta di ottima qualità e immagine nitida. Spedizione veloce!"
    },
    {
      utente: "Laura B.",
      voto: 4,
      testo: "Bellissimo prodotto, lo consiglio. L’unico difetto: la confezione era un po’ danneggiata."
    }
  ];

  return (
    <div className="product-detail-container">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Colonna immagine */}
          <div className="col-md-6 text-center">
            <img
              src={prodotto.immagine}
              alt={prodotto.nome}
              className="img-fluid rounded"
            />
          </div>

          {/* Colonna testo */}
          <div className="col-md-6">
            <h1 className="mb-3">{prodotto.nome}</h1>
            <h4 className="mb-3">€ {prodotto.prezzo.toFixed(2)}</h4>
            <p className="text-muted">{prodotto.descrizione}</p>

            {/* Pulsanti taglie */}
            <div className="mb-3">
              <strong>Taglia:</strong>
              <div className="d-flex gap-2 mt-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Pulsanti azioni */}
            <button className="btn btn-rosa mt-4 w-100">
              Aggiungi al carrello
            </button>

            <button className="btn btn-outline-secondary mt-2 w-100">
              Scegli metodo di pagamento
            </button>
          </div>
        </div>

        {/* Sezione recensioni */}
        <div className="mt-5">
          <h3>Recensioni</h3>
          {recensioni.length === 0 ? (
            <p className="text-muted">Nessuna recensione disponibile.</p>
          ) : (
            recensioni.map((rec, index) => (
              <div key={index} className="border p-3 rounded mb-3">
                <strong>{rec.utente}</strong>
                <p className="mb-1">⭐️ {rec.voto}/5</p>
                <p className="mb-0 text-muted">{rec.testo}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
