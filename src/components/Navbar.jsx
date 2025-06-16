import React from 'react'
import "./navbar.css"

const navbar = () => {
    return (
        <>
            <nav className='d-flex justify-content-between align-items-center p-3'>
                <div className='d-flex align-items-center'>
                    <img src="/logo.png" alt="" className='img-size' />
                    <div className='ms-3 title-style'>
                        BoolShop
                    </div>

                </div>
                <div>
                    <ul className='list-unstyled d-flex'>
                        <li className='mx-3'>Home</li>
                        <li className='mx-3'>Artist</li>
                        <li className='mx-3'>Whishlist</li>
                        <li className='mx-3'>
                            <a href="#" className='me-2'><i className="fa-solid fa-cart-shopping "></i></a>
                        </li>
                    </ul>
                </div>
                <div className='d-flex align-items-center'>
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>

            </nav>
        </>
    )
}

export default navbar
