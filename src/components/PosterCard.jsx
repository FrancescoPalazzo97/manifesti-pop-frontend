import React from 'react'
import { Link } from 'react-router-dom'

const PosterCard = ({ id, title, artist, size, price, image, slug }) => {

    const newSize = () => {
        if (size === 'sm') {
            return 'Small'
        }
        if (size === 'md') {
            return 'Medium'
        }
        else (size === 'lg')
        return 'Large'
    }

    return (
        <>
            < Link to={`/product/${slug}`} className='text-decoration-none'>
                <div className="card h-100 w-100 d-flex flex-column">
                    <div className="img-container">
                        <img src={image} className="fix-img" alt={title} />
                    </div>
                    <div className="card-body text-center flex-grow-1 d-flex flex-column justify-content-between">
                        <h4 className="card-title fw-bold margin-card-text">{title}</h4>
                        <p className="card-text text-muted margin-card-text">{artist}</p>
                        <p className="card-text text-muted margin-card-text">Taglia: {newSize()}</p>
                        <p className="fw-bold margin-card-text"><strong>{price}€</strong></p>
                    </div>
                </div>
            </Link >
        </>

    )
}

export default PosterCard

