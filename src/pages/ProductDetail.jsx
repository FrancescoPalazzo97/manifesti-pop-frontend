import React from 'react'
import './ProductDetail.css' 

function ProductDetail() {
  const prodotto = {
    nome: "Maglietta Casual",
    descrizione: "Maglietta unisex in cotone, comoda e perfetta per ogni occasione. Taglie S, M, L, XL.",
    prezzo: 24.99,
    immagine: "https://img.freepik.com/foto-gratuito/moda-veloce-vs-moda-sostenibile-lenta_23-2149134026.jpg?semt=ais_hybrid&w=740"
  }

  return (
    <div className="product-detail-container">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-md-6 text-center">
            <img
              src={prodotto.immagine}
              alt={prodotto.nome}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6">
            <h1 className="mb-3">{prodotto.nome}</h1>
            <h4 className="mb-3">€ {prodotto.prezzo.toFixed(2)}</h4>
            <p className="text-muted">{prodotto.descrizione}</p>
            <button className="btn btn-rosa mt-4 w-100">
              Aggiungi al carrello
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
