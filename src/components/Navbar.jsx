import React, { useState } from "react";
import "./navbar.css";
import { Link, NavLink } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import Logo from "./Logo";
import { useGlobalContext } from "../contexts/GlobalContext";

const navbar = () => {

  const { filter, setFilter } = useGlobalContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(filter);
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
            <Nav className="mb-2 mb-lg-0 ms-lg-5">
              <NavLink to="/posters-list" className="text-light nav-link">
                <i className="text-white ">Tutti i Manifesti</i>
              </NavLink>
            </Nav>
            {/* Nav destra */}
            <Nav className="ms-auto d-flex flex-row align-items-center me-5 gap-2">
              <NavLink to="/wishlist" className="text-light nav-link icon-hover">
              <i className="fa-solid fa-heart"></i>
              </NavLink>
              <NavLink to="/cart" className="text-light nav-link icon-hover">
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
    </>
  );
};

// const navbar = () => {

//     return (
//         <>
//             <nav className="d-flex justify-content-between align-items-center p-2 navbar-bg-color">
//                 <NavLink to="/" className="text-decoration-none text-white">
//                     <div className="d-flex align-items-center">
//                         <img src="/logo-header.png" alt="" className="img-size" />
//                         <div className="ms-3 title-style">Manifesti Pop</div>
//                     </div>
//                 </NavLink>
//                 <div>
//                     <ul className="list-unstyled text-white d-flex align-items-center m-0">
//                         <li className="mx-3">Home</li>
//                         <li className="mx-3">Artist</li>
//                         <li className="mx-3">Whishlist</li>
//                         <li className="mx-3">
//                             <a href="#" className="me-2">
//                                 <i className="fa-solid fa-cart-shopping text-white"></i>
//                             </a>
//                         </li>
//                     </ul>
//                 </div>
//                 <div className="d-flex align-items-center">
//                     <form className="d-flex" role="search" >
//                         <input
//                             className="form-control me-2"
//                             type="search"
//                             placeholder="Search"
//                             aria-label="Search"

//                         />
//                         <button className="btn btn-dark" type="submit">
//                             Search
//                         </button>
//                     </form>
//                 </div>
//             </nav>
//         </>
//     );
// };

export default navbar;
