import React from 'react';
import { Link } from 'react-router-dom';

const PosterCard = ({ title, artist, size, price, image, slug }) => {
    const newSize = () => {
        if (size === 'sm') return 'Small';
        if (size === 'md') return 'Medium';
        if (size === 'lg') return 'Large';
        return 'Sconosciuta';
    };

    return (
        <Link to={`/posters/${slug}`} className='text-decoration-none'>
            <div className="card h-100 w-100 d-flex flex-column">
                <div className="img-container">
                    <img src={image} className="fix-img" alt={title} />
                </div>
                <div className="card-body text-center flex-grow-1 d-flex flex-column justify-content-between">
                    <h5 className="card-title fw-bold margin-card-text">{title}</h5>
                    <p className="card-text text-muted margin-card-text">{artist}</p>
                    <p className="card-text text-muted ">Taglia: {newSize()}</p>
                    <p className="fw-bold"><strong>{price}€</strong></p>
                </div>
            </div>
        </Link>
    );
};

export default PosterCard;
