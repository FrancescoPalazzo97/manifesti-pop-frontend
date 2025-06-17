import { Link } from 'react-router-dom';
import DiscountLabel from './DiscountLabel';

const PosterCard = ({ poster }) => {

    const { title, artist, size, price, image_url, slug, discount } = poster;

    const newSize = () => {
        if (size === 'sm') return 'Small';
        if (size === 'md') return 'Medium';
        if (size === 'lg') return 'Large';
        return 'Sconosciuta';
    };

    let discountedPrice = null;

    if (discount && discount > 0) {
        discountedPrice = price * (1 - discount / 100)
    }

    return (
        <Link to={`/posters/${slug}`} className='text-decoration-none'>
            <div className="card d-flex flex-column position-relative">
                <DiscountLabel discount={discount} />
                <div className="img-container">
                    <img src={image_url} className="fix-img" alt={title} />
                </div>
                <div className="card-body text-center d-flex flex-column justify-content-between">
                    <h5 className="card-title fw-bold margin-card-text">{title}</h5>
                    <p className="card-text text-muted margin-card-text">{artist}</p>
                    <p className="card-text text-muted ">Taglia: {newSize()}</p>
                    {discountedPrice ?
                        (
                            <p>
                                <span className='text-decoration-line-through fw-bold me-3'><strong>{price}€</strong></span>
                                <span className='text-danger fw-bold'><strong>{discountedPrice.toFixed(2)}</strong></span>
                            </p>
                        ) : (
                            <p className="fw-bold"><strong>{price}€</strong></p>
                        )}
                </div>
            </div>
        </Link>
    );
};

export default PosterCard;
