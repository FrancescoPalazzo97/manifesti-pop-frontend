import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import { useGlobalContext } from '../contexts/GlobalContext';

const ProductDetail = () => {

  const { slug } = useParams();

  // Estraggo dal context globale le funzioni per wishlist e carrello
  const { wishlistData, cartData } = useGlobalContext();

  const { addToWishlist, removeFromWishlist, isInWishlist } = wishlistData;

  const { addCart, removeFromCart, isInCart } = cartData;

  // Stato locale per contenere i dati del prodotto, inizialmente null (non caricato)
  const [prodotto, setProdotto] = useState(null);

  // Stato locale per memorizzare la lista delle recensioni, inizialmente vuota
  const [recensioni, setRecensioni] = useState([]);

  // Funzione helper che converte il codice taglia (sm, md, lg) in parola leggibile
  const newSize = (size) => {
    const sizes = {
      sm: 'Small',
      md: 'Medium',
      lg: 'Large',
    };
    return sizes[size]; // Ritorna la stringa corrispondente oppure undefined se non esiste
  };

  // Funzione helper per formattare un numero in prezzo con due decimali (es. 10 -> 10.00)
  const productPrice = (num) => {
    return parseFloat(num).toFixed(2);
  };

  // Funzione helper per calcolare il prezzo scontato, se c'è uno sconto
  const discountedPrice = () => {
    if (!prodotto.discount) return prodotto.price; // Se non c'è sconto, ritorno prezzo normale
    // Calcolo prezzo scontato (prezzo * (1 - percentuale_sconto/100))
    return prodotto.price * (1 - prodotto.discount / 100);
  };

  // useEffect: si attiva quando il componente viene montato o quando cambia lo slug
  useEffect(() => {
    if (!slug) { // Se per qualche motivo lo slug non è disponibile
      console.warn('⚠️ Slug non disponibile'); // Avviso in console
      return; // Esco dalla funzione senza fare nulla
    }
    // Faccio una chiamata GET all'endpoint per ottenere i dettagli del prodotto con lo slug
    axios.get(`http://localhost:3000/posters/${slug}`)
      .then(response => {
        // Quando ricevo la risposta, estraggo i dati dal corpo
        const dati = response.data;
        // Aggiorno lo stato locale prodotto con i dati ricevuti
        setProdotto(dati);
        // Aggiorno lo stato recensioni con i dati delle recensioni o array vuoto se assenti
        setRecensioni(dati.reviews || []);
      })
      .catch(error => {
        // Se c'è un errore nella richiesta lo stampo in console
        console.error('❌ Errore nel caricamento dati:', error);
      });
  }, [slug]); // L'effetto si esegue al montaggio e ogni volta che slug cambia

  // Se il prodotto non è ancora caricato, mostro un messaggio di caricamento
  if (!prodotto) return <div className="text-center mt-5">Caricamento in corso...</div>;

  // Funzione che gestisce il click su "Aggiungi ai preferiti"
  // const handleAddToWishlist = () => {
  //   addToWishlist(prodotto); // Invoca la funzione dal context passando il prodotto attuale
  // };

  const existInWishlist = isInWishlist(prodotto.id);

  const handleClickWishlist = (e) => {
    e.preventDefault;
    e.stopPropagation();

    existInWishlist ? removeFromWishlist(prodotto.id) : addToWishlist(prodotto);
  }

  // const existInCart = isInCart(prodotto.id);

  const handleClickCart = e => {
    e.preventDefault;
    e.stopPropagation();

    addCart(prodotto)
    // existInCart ? removeFromCart(prodotto.id) : addCart(prodotto);
  }

  // Funzione che gestisce il click su "Aggiungi al carrello"
  const handleToCart = () => {
    addCart(prodotto); // Invoca la funzione dal context per aggiungere il prodotto al carrello
  };

  // Render del componente
  return (
    <div className="row">
      <div className="col-12">
        <div className="product-detail-container">
          <div className="container">
            <div className="row align-items-center g-5">
              {/* Colonna immagine prodotto, centrata */}
              <div className="col-md-6 text-center">
                <img
                  src={prodotto.image_url}      // URL immagine prodotto
                  alt={prodotto.title}           // Testo alternativo per accessibilità
                  className="img-fluid rounded shadow-lg" // Immagine responsive con angoli arrotondati e ombra
                />
              </div>
              {/* Colonna dettagli prodotto */}
              <div className="col-md-6">
                <h1 className="mb-3 fw-bold text-rosa">{prodotto.title}</h1> {/* Titolo prodotto */}
                {/* Prezzo prodotto con gestione eventuale sconto */}
                <h4 className="mb-3">
                  {prodotto.discount ? (
                    // Se c'è sconto mostro prezzo originale barrato e prezzo scontato rosso e in grassetto
                    <>
                      <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '10px' }}>
                        € {productPrice(prodotto.price)} {/* Prezzo originale */}
                      </span>
                      <span style={{ color: 'red', fontWeight: 'bold' }}>
                        € {productPrice(discountedPrice())} {/* Prezzo scontato */}
                      </span>
                    </>
                  ) : (
                    // Altrimenti mostro solo il prezzo normale
                    <>€ {productPrice(prodotto.price)}</>
                  )}
                </h4>
                <p className="text-muted">{prodotto.description}</p> {/* Descrizione prodotto */}
                <p><strong>Artista:</strong> {prodotto.artist}</p> {/* Nome artista */}
                <p><strong>Disponibilità:</strong> {prodotto.stock_quantity} pezzi</p> {/* Quantità disponibile */}
                {/* Informazioni sulla taglia del manifesto */}
                <div className="mb-3">
                  <strong>✨ Taglia Manifesto: {newSize(prodotto.size)}</strong>
                </div>
                {/* Pulsanti azione per aggiungere al carrello e ai preferiti */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleClickCart} // Al click aggiunge il prodotto al carrello
                    className="btn"
                    style={{
                      flex: '1', // Pulsante occupa metà spazio orizzontale (flexbox)
                      backgroundColor: '#dc3545', // Rosso bootstrap
                      color: 'white',
                      border: 'none',
                      padding: '10px 0',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'background-color 0.3s ease',
                    }}
                    // Cambia colore sfondo al passaggio mouse
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#bb2d3b'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc3545'}
                  >
                    🛒 Aggiungi al carrello
                  </button>

                  <button
                    onClick={handleClickWishlist} // Al click aggiunge ai preferiti
                    className="btn"
                    style={{
                      flex: '1', // Occupa metà spazio orizzontale
                      backgroundColor: 'transparent', // Sfondo trasparente
                      color: '#212529', // Colore testo grigio scuro
                      border: '2px solid #dc3545', // Bordo rosso
                      padding: '10px 0',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                    // Cambia colore testo e sfondo al passaggio mouse
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

            {/* Sezione recensioni prodotto */}
            <div className="mt-5">
              <h3 className="mb-4">Cosa dicono i fan?</h3>
              {recensioni.length === 0 ? ( // Se non ci sono recensioni
                <p className="text-muted">Nessuna recensione disponibile 😢</p>
              ) : (
                // Mappa tutte le recensioni e le mostra una per una
                recensioni.map((recensione, i) => (
                  <div key={i} className="border p-3 rounded mb-3 bg-light">
                    <strong>{recensione.user_name || 'Utente Anonimo'}</strong> {/* Nome utente o anonimo */}
                    <p className="mb-1">⭐️ {recensione.vote}/5</p> {/* Voto recensione */}
                    <p className="mb-0 text-muted">{recensione.text}</p> {/* Testo recensione */}
                    {recensione.created_at && (
                      <small className="text-muted d-block mt-1">
                        {/* Data recensione formattata in formato italiano */}
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

// Esporto il componente per poterlo usare in altri file
export default ProductDetail;
/*
  DESCRIZIONE COMPLETA DEL FUNZIONAMENTO DEL COMPONENTE ProductDetail:

  Questo componente React si occupa di mostrare i dettagli completi di un singolo prodotto,
  inclusa immagine, titolo, prezzo (con eventuale sconto), descrizione, artista, disponibilità,
  taglia manifesto e le recensioni degli utenti. Inoltre, permette di aggiungere il prodotto
  alla wishlist e al carrello, sfruttando un context globale.

  --- LOGICA DEL COMPONENTE ---

  1. Lettura parametro URL (slug):
     Tramite useParams di react-router-dom si estrae lo "slug" dalla URL, che identifica
     univocamente il prodotto da mostrare (es: /product/slug-del-prodotto).

  2. Stato locale:
     - prodotto: inizialmente null, conterrà i dati del prodotto recuperati dall'API.
     - recensioni: array vuoto, che verrà popolato con le recensioni associate al prodotto.

  3. Chiamata API:
     Nel useEffect, al montaggio del componente e ad ogni cambio dello slug,
     si esegue una richiesta HTTP GET all'endpoint `http://localhost:3000/posters/{slug}`
     tramite axios per recuperare i dati del prodotto.
     Se la chiamata va a buon fine, i dati vengono salvati nello stato locale
     `prodotto` e le recensioni in `recensioni`. In caso di errore viene mostrato un errore in console.

  4. Funzioni helper:
     - newSize: converte codici taglia ("sm", "md", "lg") in parole leggibili ("Small", "Medium", "Large").
     - productPrice: formatta il prezzo con due decimali (es. 10 -> "10.00").
     - discountedPrice: calcola il prezzo scontato in base alla percentuale di sconto, se presente.

  5. Gestione UI:
     - Se il prodotto non è ancora caricato (null), mostra un messaggio "Caricamento in corso...".
     - Quando il prodotto è disponibile, mostra una card dettagliata con immagine e dati:
       * Immagine del prodotto con alt testuale.
       * Titolo del prodotto evidenziato in colore rosa.
       * Prezzo, che se scontato mostra il prezzo originale barrato e il prezzo scontato in rosso.
       * Descrizione del prodotto, nome dell'artista e quantità disponibile.
       * Taglia manifesto tradotta in testo leggibile.
     - Due pulsanti d'azione:
       * "Aggiungi al carrello" con stile rosso, cambia leggermente colore al passaggio del mouse.
       * "Aggiungi ai preferiti" con stile trasparente e bordo rosso, cambia colore al passaggio del mouse.

  6. Recensioni:
     - Se non ci sono recensioni, mostra un messaggio "Nessuna recensione disponibile".
     - Altrimenti itera sulle recensioni e mostra:
       * Nome utente (o "Utente Anonimo" se non presente).
       * Voto da 1 a 5 stelle.
       * Testo della recensione.
       * Data della recensione formattata in stile italiano (gg/mm/aaaa).

  7. Interazioni:
     - Al click su "Aggiungi al carrello" chiama la funzione addCart presa dal context globale,
       che si occupa di gestire lo stato globale del carrello.
     - Al click su "Aggiungi ai preferiti" chiama addToWishlist, che aggiorna la wishlist globale.

  --- ESTETICA E LAYOUT ---

  - Struttura responsive con Bootstrap (classi row, col-md-6, container) per adattarsi a
    diversi dispositivi.
  - Immagine grande e centrata con ombreggiatura e angoli arrotondati per un aspetto moderno.
  - Titoli e testi formattati con classi e stili inline per enfatizzare prezzo, sconto, e dettagli.
  - Pulsanti con stili personalizzati, animazioni al passaggio del mouse per una UI interattiva.
  - Sezione recensioni ben separata, con box con bordo e sfondo chiaro per facilità di lettura.
  
  In sintesi, questo componente unisce funzionalità dinamiche (API fetch, context globale) 
  a un design curato e responsivo, per offrire all'utente un'esperienza dettagliata, 
  interattiva e piacevole nella visualizzazione e gestione di un singolo prodotto.
*/
