import React, { useState } from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Counter from "./Counter";
import { useGlobalContext } from "../contexts/GlobalContext";
import FreeShipment from "./FreeShipment";

const NavbarComponent = () => {

  const { cartData, wishlistData } = useGlobalContext();
  const { wishlistCount } = wishlistData;
  const { cartCount } = cartData;
  // cambiamo cartItems in cart, perché nel context si chiama 'cart'
  // Qui usiamo la funzione useGlobalContext() per accedere allo stato globale condiviso.
  // Con il destructuring facciamo:
  // - filter: la stringa usata come filtro di ricerca,
  // - setFilter: la funzione per aggiornare quel filtro,
  // - cart: l'array che contiene i poster aggiunti al carrello.
  //  'cart' perché è il nome esatto usato nel context globale.

  const { filter, setFilter, cart } = useGlobalContext();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = search.trim();
    if (trimmed === "") return;

    // Reindirizza con parametro nell'URL
    navigate(`/posters-list?term=${encodeURIComponent(trimmed)}`);
    setSearch(""); // Resetta campo se vuoi
  };

  return (
    <>
      {/* ------------------- LASCIO QUELLO PRECEDENTE ---------------------------------------------------*/}
      {/* <nav className="d-flex justify-content-between align-items-center p-2 navbar-bg-color">
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
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-dark" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav> */}

      <Navbar expand="lg" className=" p-0 margin-navbar">
        <Container fluid className=" navbar-bg-color navbar-fixed">
          <Logo where={`navbar`} />

          {/* Bottone toggle per dispositivi mobili */}
          <Navbar.Toggle aria-controls="navbarTogglerDemo02" />

          {/* Menu collassabile */}
          <Navbar.Collapse id="navbarTogglerDemo02">
            {/* Nav sinistra */}
            {/* <Nav className="mb-2 mb-lg-0 ms-lg-5">
                            <NavLink to="/posters-list" className="text-light nav-link">
                                <i className="text-white ">Tutti i Manifesti</i>
                            </NavLink>
                        </Nav> */}
            <div style={{ textAlign: "center" }}>
              <nav>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="me-2 p-2"
                    style={{ borderRadius: "20px", border: "1px solid #d13b3b" }}
                    placeholder="Ricerca"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit">cerca</button>
                </form>
              </nav>
            </div>

            {/* Nav destra */}
            <Nav className="ms-auto d-flex flex-row align-items-center me-5 gap-2">
              <NavLink to="/wishlist" className="text-light nav-link icon-hover position-relative">
                <Counter count={wishlistCount} />
                <i className="fa-solid fa-heart"></i>
              </NavLink>

              <NavLink to="/cart" className="text-light nav-link icon-hover position-relative">
                <Counter count={cartCount} />
                <i className="fa-solid fa-cart-shopping"></i>
              </NavLink>
            </Nav>

            {/* Form di ricerca (commentato) */}
            {/* <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            /> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="banner-fixed">
        <FreeShipment />
      </div>
    </>
  );
};

export default NavbarComponent;
