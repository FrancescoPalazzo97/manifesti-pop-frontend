import { useGlobalContext } from "../contexts/GlobalContext"

const CartButton = ({ poster }) => {

    const { addCart, removeFromCart, isInCart } = useGlobalContext().cartData;
    const exist = isInCart(poster.id);

    const handleClick = e => {
        e.preventDefault();
        e.stopPropagation();

        exist ? removeFromCart(poster.id) : addCart(poster);
    }
    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={poster.stock_quantity === 0}
            style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: poster.stock_quantity === 0 ? "not-allowed" : "pointer",
                color: exist ? "#FFD600" : "#fff",
                opacity: poster.stock_quantity === 0 ? 0.5 : 1
            }}
            title={poster.stock_quantity === 0 ? "Non disponibile" : "Aggiungi al carrello"}
        >
            <i className="fa-solid fa-cart-shopping"></i>
        </button>
    )
}

export default CartButton
