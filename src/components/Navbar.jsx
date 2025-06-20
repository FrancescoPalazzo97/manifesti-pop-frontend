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
import CartBanner from "./CartBanner";

const NavbarComponent = () => {

  const { cartData, wishlistData } = useGlobalContext();
  const { wishlistCount } = wishlistData;
  const { cartCount } = cartData;

  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [showCartBanner, setShowCartBanner] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = search.trim();
    if (trimmed === "") return;

    // Reindirizza con parametro nell'URL
    navigate(`/posters-list?term=${encodeURIComponent(trimmed)}`);
    setSearch(""); // Resetta campo se vuoi
  };

  const handleCartMouseEnter = () => {
    setShowCartBanner(true);
  };

  const handleCartBannerMouseLeave = () => {
    setShowCartBanner(false);
    console.log("Mouse left the cart banner");
  };



  return (
    <>
      <Navbar expand="lg" className=" p-0 margin-navbar">
        <Container fluid className=" navbar-bg-color navbar-fixed">
          <Logo where={`navbar`} />

          {/* Bottone toggle per dispositivi mobili */}
          <Navbar.Toggle aria-controls="navbarTogglerDemo02" />

          {/* Menu collassabile */}
          <Navbar.Collapse id="navbarTogglerDemo02">

            {/* ✅ CORRETTO: Form di ricerca centralizzato */}
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

              {/* ✅ WISHLIST: Funziona correttamente */}
              <NavLink to="/wishlist" className="text-light nav-link icon-hover position-relative">
                <Counter count={wishlistCount} />
                <i className="fa-solid fa-heart"></i>
              </NavLink>

              {/* ✅ CARRELLO: Gestione migliorata */}
              <div
                className="position-relative"
                onMouseEnter={handleCartMouseEnter}
              >
                <NavLink
                  to="/cart"
                  className="text-light nav-link icon-hover position-relative"
                >
                  <Counter count={cartCount} />
                  <i
                    className="fa-solid fa-cart-shopping"
                    style={{ cursor: 'pointer' }}
                  ></i>
                </NavLink>

                {/* ✅ BANNER: Appare solo al hover */}
                {showCartBanner && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '60px',
                      right: 0,
                      zIndex: 1000
                    }}
                    onMouseLeave={handleCartBannerMouseLeave}
                  >
                    <CartBanner onMouseLeave={handleCartBannerMouseLeave} />
                  </div>
                )}
              </div>
            </Nav>
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
