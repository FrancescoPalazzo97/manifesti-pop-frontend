import { useGlobalContext } from "../contexts/GlobalContext"
import "../styles/wishlistButton.css"

const WishlistButton = ({ poster }) => {

    const { wishlistData } = useGlobalContext();

    const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = wishlistData;

    const exist = isInWishlist(poster.id);

    console.log('🔍 DEBUG WishlistButton:');
    console.log('- Poster ID:', poster.id);
    console.log('- Poster title:', poster.title);
    console.log('- Exist (dovrebbe essere true/false):', exist);
    console.log('- Wishlist completa:', wishlist);
    console.log('- Wishlist IDs:', wishlist.map(item => item.id));
    console.log('- isInWishlist result:', exist);
    console.log('---');

    const handleClick = (e) => {
        e.preventDefault;
        e.stopPropagation();
        console.log('🖱️ Click! Exist prima del click:', exist);

        // exist ? removeFromWishlist(poster.id) : addToWishlist(poster);

        if (exist) {
            console.log('➡️ Rimuovo dalla wishlist');
            removeFromWishlist(poster.id);
        } else {
            console.log('➡️ Aggiungo alla wishlist');
            addToWishlist(poster);
        }
    }
    return (
        <button
            onClick={handleClick}
            title={exist ? 'Rimuovi dalla wishlist' : 'Aggiungi alla wishlist'}
        >
            {exist ? (
                <i class="fa-solid fa-heart red"></i>
            ) : (
                <i class="fa-regular fa-heart"></i>
            )}
        </button>
    )
}

export default WishlistButton
