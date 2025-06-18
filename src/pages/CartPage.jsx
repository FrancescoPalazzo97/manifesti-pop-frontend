import React from "react";

const CartPage = () => {
  return (
    <>
      <div className="row">
        <div className="col-12 p-3">
          <h1>Il tuo carrello</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="card mb-3">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  className="img-fluid"
                  src="https://shop.ciaodiscotecaitaliana.com/cdn/shop/files/terrazzashop1.jpg?v=1749822657&width=1100"
                  alt=""
                />
              </div>
              <div class="col-md-8 position-relative">
                <div class="card-body">
                  <h5 class="card-title">Titolo poster</h5>
                  <p class="card-text mt-4">prezzo</p>
                  <div className="d-inline-flex align-items-center border p-1 position-absolute bottom-0 mb-5">
                    <button className="border-0 bg-white">
                      <i class="fa-solid fa-minus text-danger button-hover"></i>
                    </button>
                    <span className="px-3">1</span>
                    <button className="border-0 bg-white ">
                      <i class="fa-solid fa-plus text-danger button-hover"></i>
                    </button>
                  </div>
                  <div class="position-absolute top-0 end-0">
                    <i class="fa-solid fa-x p-3 button-hover"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <h4>Totale</h4>
            <h6>Spedizione</h6>
            <button>acquista ora</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
