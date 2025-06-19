import React, { useEffect, useState } from 'react';  // Importo React e hook useEffect e useState
import { useParams } from 'react-router-dom';       // Importo useParams per leggere parametri URL (slug)
import axios from 'axios';                           // Importo axios per fare chiamate HTTP
import './ProductDetail.css';                        // Importo CSS specifico per questo componente

//  Importo il context globale per poter usare la wishlist e le sue funzioni
import { useGlobalContext } from '../contexts/GlobalContext';

function ProductDetail() {
  //  Estraggo lo slug dalla URL, es: /product/slug-del-prodotto
  const { slug } = useParams();

  //  Estraggo dal context la funzione per aggiungere ai preferiti e al carrello
  const { addToWishlist, addCart } = useGlobalContext();

  //  Stato locale per il prodotto, inizialmente null perché non caricato
  const [prodotto, setProdotto] = useState(null);
  //  Stato locale per le recensioni, inizialmente array vuoto
  const [recensioni, setRecensioni] = useState([]);

  //  Funzione helper che traduce i codici taglia in parole leggibili
  const newSize = (size) => {
    const sizes = {
      sm: 'Small',  // small
      md: 'Medium', // medium
      lg: 'Large',  // large
    };
    return sizes[size]; // restituisce la parola corrispondente
  };

  //  Funzione helper per formattare il prezzo a due decimali (es. 10 -> 10.00)
  const productPrice = (num) => {
    return parseFloat(num).toFixed(2);
  };

  //  useEffect: eseguito al montaggio del componente e ogni volta che cambia lo slug
  useEffect(() => {
    // Controllo che lo slug esista
    if (!slug) {
      console.warn('⚠️ Slug non disponibile');
      return; // esco se non ho lo slug
    }

    //  Chiamata GET con axios al backend per prendere i dati del prodotto tramite slug
    axios.get(`http://localhost:3000/posters/${slug}`)
      .then(response => {
        const dati = response.data;        // estraggo i dati dalla risposta
        setProdotto(dati);                 // aggiorno lo stato prodotto
        setRecensioni(dati.reviews || []); // aggiorno recensioni, se non ci sono assegno array vuoto
      })
      .catch(error => {
        console.error('❌ Errore nel caricamento dati:', error);
      });
  }, [slug]); // dipendenza: ogni volta che cambia slug, rifaccio la chiamata

  //  Se prodotto non è ancora caricato, mostro un messaggio di caricamento semplice
  if (!prodotto) return <div className="text-center mt-5">Caricamento in corso...</div>;

  //  Funzione chiamata al click sul bottone wishlist, aggiunge il prodotto ai preferiti tramite context
  const handleAddToWishlist = () => {
    addToWishlist(prodotto);
  };

  //funzione per aggiungere al carrello
  const handleToCart = () => {
    addCart(prodotto);
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="product-detail-container">
          <div className="container">
            <div className="row align-items-center g-5">

              {/*  Colonna immagine prodotto */}
              <div className="col-md-6 text-center">
                <img
                  src={prodotto.image_url}    // URL immagine prodotto
                  alt={prodotto.title}        // Alt testo con titolo prodotto
                  className="img-fluid rounded shadow-lg"  // stile bootstrap e ombra
                />
              </div>

              {/*  Colonna dettagli prodotto */}
              <div className="col-md-6">
                <h1 className="mb-3 fw-bold text-rosa">{prodotto.title}</h1> {/* Titolo */}
                <h4 className="mb-3">€ {productPrice(prodotto.price)}</h4>  {/* Prezzo formattato */}
                <p className="text-muted">{prodotto.description}</p>        {/* Descrizione */}
                <p><strong>Artista:</strong> {prodotto.artist}</p>          {/* Artista */}
                <p><strong>Disponibilità:</strong> {prodotto.stock_quantity} pezzi</p> {/* Stock */}

                {/*  Info taglia manifesto */}
                <div className="mb-3">
                  <strong>✨ Taglia Manifesto: {newSize(prodotto.size)}</strong>
                </div>

                {/*  Pulsanti azione con flexbox e gap */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Bottone rosso pieno Aggiungi al carrello */}
                  <button
                    onClick={handleToCart}
                    className="btn"
                    style={{
                      flex: '1',                      // occupa uguale spazio
                      backgroundColor: '#dc3545',    // rosso 
                      color: 'white',
                      border: 'none',
                      padding: '10px 0',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'background-color 0.3s ease',
                    }}
                    // Cambio colore al passaggio mouse
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#bb2d3b'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc3545'}
                  >
                    🛒 Aggiungi al carrello
                  </button>

                  {/* Bottone pagamento grigio chiaro con bordo arrotondato */}
                  {/* <button
                    className="btn"
                    style={{
                      flex: '1',
                      backgroundColor: 'transparent',
                      color: '#6c757d',              // grigio bootstrap
                      border: '2px solid #6c757d',
                      padding: '10px 0',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                    // Cambio colore e sfondo al passaggio mouse
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#6c757d';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6c757d';
                    }}
                  >
                    💳 Scegli pagamento
                  </button> */}

                  {/* Bottone wishlist giallo con bordo e hover */}
                  <button
                    onClick={handleAddToWishlist} // onClick aggiunge ai preferiti
                    className="btn"
                    style={{
                      flex: '1',
                      backgroundColor: 'transparent',
                      color: '#212529',            // giallo 
                      border: '2px solid #dc3545',
                      padding: '10px 0',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                    // Cambio colore e sfondo al passaggio mouse
                    onMouseEnter={e => {

                      e.currentTarget.style.color = '#dc3545';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#212529';
                    }}
                  >
                    ❤️ Aggiungi ai preferiti
                  </button>
                </div>
              </div>
            </div>

            {/*  Sezione recensioni */}
            <div className="mt-5">
              <h3 className="mb-4"> Cosa dicono i fan?</h3>
              {/* Se non ci sono recensioni mostro messaggio */}
              {recensioni.length === 0 ? (
                <p className="text-muted">Nessuna recensione disponibile 😢</p>
              ) : (
                // Mappo recensioni e le mostro in box con bordo e sfondo chiaro
                recensioni.map((recensione, i) => (
                  <div key={i} className="border p-3 rounded mb-3 bg-light">
                    <strong>{recensione.user_name || 'Utente Anonimo'}</strong> {/* Nome utente */}
                    <p className="mb-1">⭐️ {recensione.vote}/5</p>            {/* Voto */}
                    <p className="mb-0 text-muted">{recensione.text}</p>      {/* Testo recensione */}
                    {/* Data formattata in italiano, se presente */}
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
