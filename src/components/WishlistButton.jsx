import { wishlistData } from "../contexts/GlobalContext"

const WishlistButton = (poster) => {

    const { addToWishlist, removeFromWishlist, isInWishlist } = wishlistData;

    const exist = isInWishlist(poster);

    const handleClick = () => {
        exist ? removeFromWishlist(poster.id) : addToWishlist(poster);
    }
    return (
        <button
            onClick={handleClick}
            style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '5px'
            }}
            title={exist ? 'Rimuovi dalla wishlist' : 'Aggiungi alla wishlist'}
        >
            {exist ? '❤️' : '🤍'}
        </button>
    )
}

export default WishlistButton
