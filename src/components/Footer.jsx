import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="container-fluid bg-footer p-5">
        <div className="row d-flex justify-content-around text-white">
          <div className="col-3">
            <h4>CHI SIAMO</h4>
            <p>
              Manifesti Pop è uno spazio dedicato a chi ama collezionare
              immagini, simboli e storie. Progettiamo e selezioniamo poster
              originali, curati nei dettagli e stampati in tiratura limitata,
              pensati per dare carattere agli spazi e raccontare passioni. Siamo
              ossessionati dalla carta giusta, dai colori intensi e dal design
              che non segue le mode: Boolshop è per chi cerca qualcosa di unico,
              autentico e da appendere con orgoglio.
            </p>
          </div>
          <div className="col-3">
            <h4>SEGUICI</h4>
            <ul className="list-unstyled">
              <li>
                <a className="text-decoration-none text-white" href="#">
                  Contattaci
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-white" href="#">
                  Notizie
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-white" href="#">
                  Instagram
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-white" href="#">
                  Facebook
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-white" href="#">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
          <div className="col-3">
            <img
              className="img-fluid"
              src="/public/logo-manifesti-pop.png"
              alt="logo footer"
            />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
