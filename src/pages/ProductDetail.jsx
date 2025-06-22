import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  // Stato per i prodotti correlati - array vuoto inizialmente
  const [correlati, setCorrelati] = useState([]);

  // Stato per gestire errori di caricamento
  const [errore, setErrore] = useState(false);

  // =====================================
  // EFFETTO PER CARICAMENTO DATI
  // =====================================

  useEffect(() => {
    console.log('🔄 useEffect INIZIO - slug:', slug);

    // Se non c'è slug, non fare nulla
    if (!slug) {
      console.log('❌ USCITA EARLY: slug non presente');
      return;
    }

    // Reset stati all'inizio del caricamento
    setErrore(false);
    setProdotto(null);
    setCorrelati([]);

    // ✅ VARIABILE CONDIVISA TRA I .then()
    let prodottoCorrente = null;

    /**
     * FASE 1: Caricamento dettagli prodotto principale
     */
    axios.get(`http://localhost:3000/posters/${slug}`)
      .then(response => {
        const datiProdotto = response.data;
        console.log('📦 Dati prodotto ricevuti:', datiProdotto);

        // ✅ SALVA IL PRODOTTO NELLA VARIABILE CONDIVISA
        prodottoCorrente = datiProdotto;

        setProdotto(datiProdotto);

        /**
         * FASE 2: Caricamento prodotti correlati
         */
        return axios.get(`http://localhost:3000/posters?artist=${encodeURIComponent(datiProdotto.artist)}`);
      })
      .then(response => {
        const tuttiDelArtista = response.data;
        console.log('📦 Tutti prodotti artista:', tuttiDelArtista);
        console.log('📦 ID prodotto da escludere:', prodottoCorrente?.id);

        // ✅ ORA POSSIAMO USARE prodottoCorrente.id
        const correlatiFiltrati = tuttiDelArtista
          .filter(poster => poster.id !== prodottoCorrente?.id) // ✅ CORRETTO
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        console.log('📦 Prodotti correlati filtrati:', correlatiFiltrati);
        setCorrelati(correlatiFiltrati);
      })
      .catch(error => {
        console.error('❌ Errore nel caricamento:', error);
        setErrore(true);
        setCorrelati([]);
      });
  }, [slug]);

  // =====================================
  // RENDERING CONDIZIONALE
  // =====================================

  // Se c'è stato un errore nel caricamento
  if (errore) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger">
          <h4>Errore nel caricamento</h4>
          <p>Non è stato possibile caricare i dettagli del prodotto.</p>
          <Link to="/posters" className="btn btn-primary">
            Torna al catalogo
          </Link>
        </div>
      </div>
    );
  }

  // Se il prodotto non è ancora caricato (stato di loading)
  if (!prodotto) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento in corso...</span>
        </div>
        <p className="mt-3">Caricamento dettagli prodotto...</p>
      </div>
    );
  }

  // =====================================
  // FUNZIONI HELPER PER FORMATTAZIONE
  // =====================================

  /**
   * Converte i codici taglia in testo leggibile
   * @param {string} size - Codice taglia (sm, md, lg)
   * @returns {string} - Taglia in formato leggibile
   */
  const formatTaglia = (size) => {
    const taglie = {
      sm: 'Small (A4)',
      md: 'Medium (A3)',
      lg: 'Large (A2)'
    };
    return taglie[size] || 'Taglia non specificata';
  };

  /**
   * Formatta il prezzo con due decimali
   * @param {number} prezzo - Prezzo da formattare
   * @returns {string} - Prezzo formattato (es: "19.99")
   */
  const formatPrezzo = (prezzo) => {
    return isNaN(prezzo) ? 'N.D.' : parseFloat(prezzo).toFixed(2);
  };

  /**
   * Calcola il prezzo finale considerando eventuali sconti
   * @param {object} prodotto - Oggetto prodotto con price e discount
   * @returns {number} - Prezzo finale calcolato
   */
  const calcolaPrezzoScontato = (prodotto) => {
    if (!prodotto.discount || prodotto.discount <= 0) {
      return prodotto.price;
    }
    return prodotto.price * (1 - prodotto.discount / 100);
  };

  const existInWishlist = isInWishlist(prodotto.id);

  const handleClickWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    existInWishlist ? removeFromWishlist(prodotto.id) : addToWishlist(prodotto);
  }

  // const existInCart = isInCart(prodotto.id);

  const handleClickCart = e => {
    e.preventDefault();
    e.stopPropagation();

    addCart(prodotto)
    // existInCart ? removeFromCart(prodotto.id) : addCart(prodotto);
  }

  // =====================================
  // RENDER PRINCIPALE
  // =====================================

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="product-detail-container">
            <div className="container">

              {/* SEZIONE PRINCIPALE: IMMAGINE E DETTAGLI PRODOTTO */}
              <div className="row align-items-center g-5 mb-5">

                {/* COLONNA IMMAGINE */}
                <div className="col-md-6 text-center">
                  <img
                    src={prodotto.image_url}
                    alt={`Poster ${prodotto.title} di ${prodotto.artist}`}
                    className="img-fluid rounded shadow-lg"
                    style={{ maxHeight: '600px', objectFit: 'cover' }}
                  />
                </div>

                {/* COLONNA DETTAGLI */}
                <div className="col-md-6">

                  {/* Titolo del prodotto */}
                  <h1 className="mb-3 fw-bold text-rosa">{prodotto.title}</h1>

                  {/* Informazioni artista */}
                  <p className="mb-3">
                    <strong>Artista:</strong>
                    <span className="text-muted ms-2">{prodotto.artist}</span>
                  </p>

                  {/* SEZIONE PREZZO con gestione sconto */}
                  <div className="mb-4">
                    {prodotto.discount && prodotto.discount > 0 ? (
                      // Prezzo con sconto
                      <div>
                        <h4 className="mb-2">
                          <span
                            className="text-decoration-line-through text-muted me-3"
                            style={{ fontSize: '1.2rem' }}
                          >
                            € {formatPrezzo(prodotto.price)}
                          </span>
                          <span className="text-danger fw-bold">
                            € {formatPrezzo(calcolaPrezzoScontato(prodotto))}
                          </span>
                        </h4>
                        <span className="badge bg-danger">
                          Sconto {prodotto.discount}%
                        </span>
                      </div>
                    ) : (
                      // Prezzo normale senza sconto
                      <h4 className="text-primary fw-bold">
                        € {formatPrezzo(prodotto.price)}
                      </h4>
                    )}
                  </div>

                  {/* Descrizione prodotto */}
                  {prodotto.description && (
                    <div className="mb-4">
                      <h5>Descrizione</h5>
                      <p className="text-muted">{prodotto.description}</p>
                    </div>
                  )}

                  {/* DETTAGLI TECNICI */}
                  <div className="row mb-4">
                    <div className="col-sm-6">
                      <p className="mb-2">
                        <strong>📏 Taglia:</strong><br />
                        <span className="text-muted">{formatTaglia(prodotto.size)}</span>
                      </p>
                    </div>
                    <div className="col-sm-6">
                      <p className="mb-2">
                        <strong>📦 Disponibilità:</strong><br />
                        <span className={`fw-bold ${prodotto.stock_quantity > 0 ? 'text-success' : 'text-danger'}`}>
                          {prodotto.stock_quantity > 0
                            ? `${prodotto.stock_quantity} pezzi disponibili`
                            : 'Non disponibile'
                          }
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* PULSANTI AZIONE */}
                  <div className="d-flex flex-column flex-sm-row gap-3">

                    {/* Pulsante Aggiungi al Carrello */}
                    <button
                      onClick={handleClickCart}
                      disabled={prodotto.stock_quantity <= 0}
                      className="btn btn-lg flex-fill"
                      style={{
                        backgroundColor: prodotto.stock_quantity > 0 ? '#dc3545' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        cursor: prodotto.stock_quantity > 0 ? 'pointer' : 'not-allowed'
                      }}
                      onMouseEnter={e => {
                        if (prodotto.stock_quantity > 0) {
                          e.currentTarget.style.backgroundColor = '#bb2d3b';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (prodotto.stock_quantity > 0) {
                          e.currentTarget.style.backgroundColor = '#dc3545';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      🛒 {prodotto.stock_quantity > 0 ? 'Aggiungi al carrello' : 'Non disponibile'}
                    </button>

                    {/* Pulsante Aggiungi ai Preferiti */}
                    <button
                      onClick={handleClickWishlist}
                      className="btn btn-outline-danger btn-lg flex-fill"
                      style={{
                        borderRadius: '8px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#dc3545';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#dc3545';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      ❤️ Aggiungi ai preferiti
                    </button>
                  </div>
                </div>
              </div>

              {/* SEZIONE PRODOTTI CORRELATI */}
              {!!correlati.length && (
                <div className="mt-5">
                  <hr className="mb-4" />
                  <div className="d-flex align-items-center justify-content-center mb-4 flex-wrap">
                    <h3 className="mb-0 me-2">Altri poster di</h3>
                    <span className="text-rosa fw-bold fs-3 me-2">{prodotto.artist}</span>
                    <h3 className="mb-0">e consigliati</h3>
                  </div>

                  <div className="row g-4">
                    {correlati.map((poster) => (
                      <div key={poster.id} className="col-6 col-md-3">
                        <div className="card h-100 shadow-sm border-0 poster-card">

                          {/* Immagine poster correlato */}
                          <div className="position-relative overflow-hidden">
                            <img
                              src={poster.image_url}
                              alt={`Poster ${poster.title}`}
                              className="card-img-top"
                              style={{
                                objectFit: 'cover',
                                height: '200px',
                                transition: 'transform 0.3s ease'
                              }}
                            />

                            {/* Badge sconto se presente */}
                            {poster.discount && poster.discount > 0 && (
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className="badge bg-danger">
                                  -{poster.discount}%
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Contenuto card */}
                          <div className="card-body d-flex flex-column">
                            <h6 className="card-title mb-2 fw-bold">
                              {poster.title}
                            </h6>

                            {/* Prezzo poster correlato */}
                            <div className="mb-3 fw-bold">
                              {poster.discount && poster.discount > 0 ? (
                                <>
                                  <span className="text-decoration-line-through text-muted me-2 small">
                                    €{formatPrezzo(poster.price)}
                                  </span>
                                  <span className="text-danger">
                                    €{formatPrezzo(calcolaPrezzoScontato(poster))}
                                  </span>
                                </>
                              ) : (
                                <span className="text-primary">
                                  €{formatPrezzo(poster.price)}
                                </span>
                              )}
                            </div>

                            {/* Link ai dettagli del poster correlato */}
                            <Link
                              to={`/posters/${poster.slug}`}
                              className="btn btn-outline-secondary btn-sm mt-auto"
                              style={{ borderRadius: '6px' }}
                            >
                              Vedi dettagli
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

/**
 * =====================================
 * DOCUMENTAZIONE TECNICA COMPLETA
 * =====================================
 * 
 * FUNZIONALITÀ PRINCIPALI:
 * 
 * 1. CARICAMENTO DATI PRODOTTO
 *    - Estrazione slug dalla URL tramite useParams
 *    - Chiamata API per recuperare dettagli prodotto
 *    - Chiamata API per recuperare prodotti correlati dello stesso artista
 *    - Gestione stati di caricamento ed errore
 * 
 * 2. VISUALIZZAZIONE DETTAGLI
 *    - Immagine prodotto responsiva con alt text accessibile
 *    - Titolo, artista, descrizione
 *    - Prezzo con gestione sconti (prezzo barrato + prezzo scontato)
 *    - Badge sconto visivo
 *    - Informazioni tecniche (taglia, disponibilità)
 * 
 * 3. INTERAZIONI UTENTE
 *    - Pulsante "Aggiungi al carrello" (disabilitato se non disponibile)
 *    - Pulsante "Aggiungi ai preferiti"
 *    - Effetti hover sui pulsanti
 *    - Navigazione verso prodotti correlati
 * 
 * 4. PRODOTTI CORRELATI
 *    - Filtro per stesso artista escludendo prodotto corrente
 *    - Randomizzazione e limite a 4 prodotti
 *    - Card responsive con immagini, prezzi e link
 *    - Badge sconto per prodotti correlati scontati
 * 
 * 5. GESTIONE ERRORI
 *    - Stato di caricamento con spinner
 *    - Messaggio di errore con link di ritorno
 *    - Fallback per dati mancanti
 * 

 * DIPENDENZE:
 * - React (hooks: useState, useEffect)
 * - react-router-dom (useParams, Link)
 * - axios (chiamate HTTP)
 * - GlobalContext (funzioni carrello e wishlist)
 * - Bootstrap CSS (classi responsive e componenti UI)
 * - ProductDetail.css (stili custom)
 */