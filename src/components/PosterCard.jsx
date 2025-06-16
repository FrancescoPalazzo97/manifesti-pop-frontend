import React from 'react'

const PosterCard = () => {
    return (
        <>
            <div className="card border-0 shadow">
                <img src="https://shop.ciaodiscotecaitaliana.com/cdn/shop/files/poster_mare_mare_luca_carboni_manifesto.jpg?v=1709800849"
                    className="card-img-top"
                    alt="Poster Mare Mare Luca Carboni" />
                <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Titolo Poster</h5>
                    <p className="card-text text-muted">Breve descrizione</p>
                    <p className="fw-bold text-primary">€XX,XX</p>
                </div>
            </div>

        </>

    )
}

export default PosterCard
