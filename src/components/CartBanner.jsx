import React, { useState } from 'react'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Link } from 'react-router-dom'
import DiscountLabel from './DiscountLabel'

const CartBanner = ({ onMouseLeave }) => {
    const { getDiscountedPrice, cartData } = useGlobalContext()
    const { cart, addCart, decrementCart, removeFromCart } = cartData;
    const [currentIndex, setCurrentIndex] = useState(0);

    // Gestione quantità globale
    const handlePlus = (poster) => {
        addCart(poster);
    };

    const handleMinus = (poster) => {
        if ((poster.quantity || 1) > 1) {
            decrementCart(poster.id);
        } else {
            removeFromCart(poster.id);
        }
    };

    return (
        <>
            {cart && cart.length > 0 && (
                <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                    {cart.map((poster, idx) => {
                        const quantity = poster.quantity || 1;
                        const isMinusDisabled = quantity <= 1;
                        const isPlusDisabled = quantity >= poster.stock_quantity;
                        // Calcolo prezzo scontato se presente
                        const hasDiscount = poster.discount && poster.discount > 0;
                        const discountedPrice = hasDiscount
                            ? (poster.price * (1 - poster.discount / 100)).toFixed(2)
                            : poster.price;
                        return (
                            <div
                                className="card mb-3 border-0 border-card-cart rounded-0 pb-2"
                                key={poster.id || idx}
                            >
                                <div className="row g-0 ">
                                    <div className="col-4 position-relative">
                                        <img src={poster.image_url} className="rounded-start img-fluid " alt={poster.title || '...'} />
                                        {hasDiscount && <DiscountLabel discount={poster.discount} />}
                                    </div>
                                    <div className="col-8">
                                        <div className="card-body">
                                            <h5 className="card-title">Titolo: {poster.title}</h5>
                                            <div>
                                                Prezzo: {hasDiscount ? (
                                                    <>
                                                        <span className="text-decoration-line-through text-danger me-2">{poster.price}€</span>
                                                        <span className="fw-bold text-success">{discountedPrice}€</span>
                                                    </>
                                                ) : (
                                                    <span>{poster.price}€</span>
                                                )}
                                            </div>
                                            <div className="d-inline-flex align-items-center border p-1 position-absolute bottom-0 mb-5">
                                                <button
                                                    className={`border-0 bg-white ${isMinusDisabled ? "disabled-class" : ""}`}
                                                    disabled={isMinusDisabled}
                                                    onClick={() => handleMinus(poster)}
                                                >
                                                    {isMinusDisabled ? (
                                                        <i className="fa-solid fa-minus text-danger disabled-icon"></i>
                                                    ) : (
                                                        <i className="fa-solid fa-minus text-danger button-hover"></i>
                                                    )}
                                                </button>
                                                <span
                                                    style={{ width: "40px" }}
                                                    className="text-center"
                                                >
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => handlePlus(poster)}
                                                    className={`border-0 bg-white ${isPlusDisabled ? "disabled-class" : ""}`}
                                                    disabled={isPlusDisabled}
                                                >
                                                    {isPlusDisabled ? (
                                                        <i className="fa-solid fa-plus  text-danger disabled-icon"></i>
                                                    ) : (
                                                        <i className="fa-solid fa-plus text-danger button-hover "></i>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="position-absolute top-0 end-0">
                                                <i
                                                    onClick={() => removeFromCart(poster.id)}
                                                    className="fa-solid fa-x p-3 button-hover"
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <div className="col-12 my-3">
                <h2>
                    Subtotale: {cart.reduce((acc, poster) => acc + (getDiscountedPrice(poster) * (poster.quantity || 1)), 0).toFixed(2)} €
                </h2>
            </div>
            <Link to='/cart' className='text-decoration-none'>
                <button className='btn btn-danger text-light mt-2'>
                    Vai al Carrello
                </button>
            </Link>
        </>
    )
}

export default CartBanner
