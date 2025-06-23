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
            onClick={handleClick} // Al click aggiunge al carrello e colora l'icona
            style={{
                background: "none", // Nessuno sfondo
                border: "none",     // Nessun bordo
                padding: 0,
                cursor: "pointer",
                color: exist ? "#FFD600" : "#fff" // Giallo se cliccato, bianco altrimenti
            }}
            title="Aggiungi al carrello"
        >
            <i className="fa-solid fa-cart-shopping"></i>
        </button>
    )
}

export default CartButton
