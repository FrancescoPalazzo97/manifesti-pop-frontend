import { useState } from "react";
import "../styles/navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
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

            {/* Nav destra */}
            <Nav className="ms-auto d-flex flex-row align-items-center me-5 gap-2">
              {/* ✅ CORRETTO: Form di ricerca centralizzato */}
              <div style={{ textAlign: "center" }}>
                <nav>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      className="searchbar me-2 p-2"
                      style={{ borderRadius: "20px", border: "1px solid #d13b3b" }}
                      placeholder="Ricerca"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">cerca</button>
                  </form>
                </nav>
              </div>

              {/* ✅ WISHLIST: Funziona correttamente */}
              <NavLink to="/wishlist" className="text-light nav-link icon-hover position-relative">
                <Counter count={wishlistCount} />
                <i className="fa-solid fa-heart"></i>
              </NavLink>

              {/* ✅ CARRELLO: Gestione migliorata */}
              <div className="position-relative" onMouseEnter={handleCartMouseEnter}>
                <NavLink to="/cart" className="text-light nav-link icon-hover position-relative">
                  <Counter count={cartCount} />
                  <i className="fa-solid fa-cart-shopping"></i>
                </NavLink>

                {/* ✅ BANNER: Appare solo al hover */}
                {showCartBanner && (
                  <div className="container-banner bg-light p-3 rounded-3 border" onMouseLeave={handleCartBannerMouseLeave}>
                    <CartBanner />
                  </div>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="row banner-fixed">
        <FreeShipment />
      </div>
    </>
  );
};

export default NavbarComponent;
