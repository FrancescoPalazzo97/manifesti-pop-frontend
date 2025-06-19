import { useGlobalContext } from "../contexts/GlobalContext"
import "../styles/counter.css"

const Counter = () => {

    const { wishlistData } = useGlobalContext();

    const { wishlistCount } = wishlistData;

    if (wishlistCount === 0) return <></>

    return (
        <div className="wishlist-counter position-absolute">
            <span className="counter-text">{wishlistCount}</span>
        </div>
    )
}

export default Counter
