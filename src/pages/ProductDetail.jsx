import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail() {
  // Recupera lo slug dalla URL tramite React Router
  const { slug } = useParams();

  // Stati per il prodotto, le recensioni, e la taglia selezionata
  const [prodotto, setProdotto] = useState(null);
  const [recensioni, setRecensioni] = useState([]);

  const newSize = (size) => {
    const sizes = {
      sm: `Smal`,
      md: `Medium`,
      lg: `Large`
    }
    return sizes[size];
  };

  const productPrice = (num) => {
    return parseFloat(num).toFixed(2)
  }

  // Effetto che si attiva al cambio dello slug
  useEffect(() => {
    if (!slug) {
      console.warn("⚠️ Slug non disponibile");
      return;
    }

    // Effettua la richiesta al backend per ottenere i dettagli del poster
    axios.get(`http://localhost:3000/posters/${slug}`)
      .then(response => {
        setProdotto(response.data);
        console.log("🎯 Dati ricevuti:", prodotto);
        setRecensioni(dati.reviews || []);
      })
      .catch(error => {
        console.error("❌ Errore nel caricamento dati:", error);
      });
  }, [slug]);


  // Mostra un messaggio di caricamento se il prodotto non è ancora pronto
  if (!prodotto) return <div className="text-center mt-5">Caricamento in corso...</div>;


  return (
    <div className="row">
      <div className="col-12">
        <div className="product-detail-container">
          <div className="container">
            <div className="row align-items-center g-5">

              {/* Colonna immagine */}
              <div className="col-md-6 text-center">
                <img
                  src={prodotto.image_url}
                  alt={prodotto.title}
                  className="img-fluid rounded shadow-lg"
                />
              </div>

              {/* Colonna dettagli prodotto */}
              <div className="col-md-6">
                <h1 className="mb-3 fw-bold text-rosa">{prodotto.title}</h1>
                <h4 className="mb-3">€ {productPrice(prodotto.price)}</h4>
                <p className="text-muted">{prodotto.description}</p>
                <p><strong>Artista:</strong> {prodotto.artist}</p>
                <p><strong>Disponibilità:</strong> {prodotto.stock_quantity} pezzi</p>

                {/* Selettore taglia */}
                <div className="mb-3">
                  <strong>✨ Taglia Manifesto: {newSize(prodotto.size)}</strong>
                </div>

                {/* Pulsanti azione */}
                <button className="btn btn-red mt-4 w-100 shadow-sm">
                  🛒 Aggiungi al carrello
                </button>
                <button className="btn btn-outline-secondary mt-2 w-100">
                  💳 Scegli pagamento
                </button>
              </div>
            </div>

            {/* Sezione recensioni */}
            <div className="mt-5">
              <h3 className="mb-4">🗣️ Cosa dicono i fan?</h3>
              {recensioni.length === 0 ? (
                <p className="text-muted">Nessuna recensione disponibile 😢</p>
              ) : (
                recensioni.map((recensione, i) => (
                  <div key={i} className="border p-3 rounded mb-3 bg-light">
                    <strong>{recensione.user_name || 'Utente Anonimo'}</strong>
                    <p className="mb-1">⭐️ {recensione.vote}/5</p>
                    <p className="mb-0 text-muted">{recensione.text}</p>
                    {recensione.created_at && (
                      <small className="text-muted d-block mt-1">
                        {new Date(recensione.created_at).toLocaleDateString('it-IT')}
                      </small>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
