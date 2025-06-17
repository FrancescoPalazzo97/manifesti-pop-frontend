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
  const [tagliaSelezionata, setTagliaSelezionata] = useState(null);

  // Effetto che si attiva al cambio dello slug
  useEffect(() => {
    if (!slug) {
      console.warn("⚠️ Slug non disponibile");
      return;
    }

    // Effettua la richiesta al backend per ottenere i dettagli del poster
    axios.get(`http://localhost:3000/posters/${slug}`)
      .then(response => {
        const dati = response.data;
        console.log("🎯 Dati ricevuti:", dati);

        // Mappa i dati in un formato 
        const prodottoAdattato = {
          nome: dati.title,
          prezzo: parseFloat(dati.price),
          descrizione: dati.description,
          // Usa direttamente l'URL completo dell'immagine 
          immagine: dati.image_url || null,
          slug: dati.slug,
          disponibile: dati.available,
          stock: dati.stock_quantity,
          artista: dati.artist
        };

        setProdotto(prodottoAdattato);
        setRecensioni(dati.reviews || []);
      })
      .catch(error => {
        console.error("❌ Errore nel caricamento dati:", error);
      });
  }, [slug]);

  // Mostra un messaggio di caricamento se il prodotto non è ancora pronto
  if (!prodotto) {
    return <div className="text-center mt-5">Caricamento in corso...</div>;
  }

  // Opzioni di taglia disponibili 
  const taglie = ["S", "M", "L"];

  return (
    <div className="product-detail-container">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* Colonna immagine */}
          <div className="col-md-6 text-center">
            {prodotto.immagine ? (
              <img
                src={prodotto.immagine}
                alt={prodotto.nome}
                className="img-fluid rounded shadow-lg"
              />
            ) : (
              <p className="text-danger">Immagine non disponibile</p>
            )}
          </div>

          {/* Colonna dettagli prodotto */}
          <div className="col-md-6">
            <h1 className="mb-3 fw-bold text-rosa">{prodotto.nome}</h1>
            <h4 className="mb-3">€ {prodotto.prezzo.toFixed(2)}</h4>
            <p className="text-muted">{prodotto.descrizione}</p>
            {prodotto.artista && <p><strong>Artista:</strong> {prodotto.artista}</p>}
            <p><strong>Disponibilità:</strong> {prodotto.stock} pezzi</p>

            {/* Selettore taglia */}
            <div className="mb-3">
              <strong>✨ Scegli la tua taglia:</strong>
              <div className="d-flex gap-2 mt-2">
                {taglie.map(taglia => (
                  <button
                    key={taglia}
                    className={`btn btn-pill ${tagliaSelezionata === taglia ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setTagliaSelezionata(taglia)}
                  >
                    {taglia}
                  </button>
                ))}
              </div>
            </div>

            {/* Pulsanti azione */}
            <button className="btn btn-rosa mt-4 w-100 shadow-sm">
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
  );
}

export default ProductDetail;
