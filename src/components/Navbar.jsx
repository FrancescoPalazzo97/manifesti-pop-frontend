import React, { useState } from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalContext";

const navbar = () => {

    const { filter, setFilter } = useGlobalContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(filter);
    }

    return (
        <>
            <nav className="d-flex justify-content-between align-items-center p-2 navbar-bg-color">
                <NavLink to="/" className="text-decoration-none text-white">
                    <div className="d-flex align-items-center">
                        <img src="/logo-header.png" alt="" className="img-size" />
                        <div className="ms-3 title-style">Manifesti Pop</div>
                    </div>
                </NavLink>
                <div>
                    <ul className="list-unstyled text-white d-flex align-items-center m-0">
                        <li className="mx-3">Home</li>
                        <li className="mx-3">Artist</li>
                        <li className="mx-3">Whishlist</li>
                        <li className="mx-3">
                            <a href="#" className="me-2">
                                <i className="fa-solid fa-cart-shopping text-white"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="d-flex align-items-center">
                    <form className="d-flex" role="search" onSubmit={handleSubmit}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={filter}
                            onChange={e => { setFilter(e.target.value) }}
                        />
                        <button className="btn btn-dark" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </nav>
        </>
    );
};

export default navbar;
