import "./navbar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
import Logo from "./Logo";

const navbar = () => {

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

      <Navbar expand="lg" className="navbar-bg-color">
        <Container fluid>
          <Logo where={`navbar`} />

          {/* Bottone toggle per dispositivi mobili */}
          <Navbar.Toggle aria-controls="navbarTogglerDemo02" />

          {/* Menu collassabile */}
          <Navbar.Collapse id="navbarTogglerDemo02">
            <Nav className="me-auto mb-2 mb-lg-0 ms-lg-5">
              <NavLink to="" className="text-light nav-link">Artisti</NavLink>
              <NavLink to="" className="text-light nav-link">Whishlist</NavLink>
              <NavLink to="" className="me-2 nav-link">
                <i className="fa-solid fa-cart-shopping text-white"></i>
              </NavLink>
            </Nav>

            {/* Form di ricerca */}
            <Form className="d-flex" role="search">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button className="btn btn-dark" type="submit">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default navbar;
