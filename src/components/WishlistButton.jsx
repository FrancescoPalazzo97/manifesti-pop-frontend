import { useGlobalContext } from "../contexts/GlobalContext"
import "../styles/wishlistButton.css"

const WishlistButton = ({ poster }) => {

    const { wishlistData } = useGlobalContext();

    const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = wishlistData;

    const exist = isInWishlist(poster.id);

    const handleClick = (e) => {
        e.preventDefault;
        e.stopPropagation();

        exist ? removeFromWishlist(poster.id) : addToWishlist(poster);

        // if (exist) {
        //     console.log('➡️ Rimuovo dalla wishlist');
        //     removeFromWishlist(poster.id);
        // } else {
        //     console.log('➡️ Aggiungo alla wishlist');
        //     addToWishlist(poster);
        // }
    }
    return (
        <button
            onClick={handleClick}
            title={exist ? 'Rimuovi dalla wishlist' : 'Aggiungi alla wishlist'}
        >
            {exist ? (
                <i class="fa-solid fa-heart red"></i>
            ) : (
                <i class="fa-solid fa-heart text-light"></i>
            )}
        </button>
    )
}

export default WishlistButton
