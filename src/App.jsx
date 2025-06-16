import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<HomePage />} />
             <Route path="product" element={<ProductDetail />} /> {/* qui la rotta dettaglio prodotti */}
            
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
