import "../styles/discountLabel.css"

const DiscountLabel = ({ discount }) => {
    return (
        <div className='position-absolute discount-label d-flex flex-column align-items-center'>
            <span className="fw-bold">SALE</span>
            <span>{discount}%</span>
        </div>
    )
}

export default DiscountLabel
