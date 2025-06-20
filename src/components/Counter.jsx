import { useGlobalContext } from "../contexts/GlobalContext"
import "../styles/counter.css"

const Counter = ({ count }) => {

    if (count === 0) return <></>

    return (
        <div className="wishlist-counter position-absolute">
            <span className="counter-text">{count}</span>
        </div>
    )
}

export default Counter
