import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import HomePage from "./pages/HomePage";
import { GlobalProvider } from "./contexts/GlobalContext";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<HomePage />} />
             <Route path="product" element={<ProductDetail />} /> {/* qui la rotta dettaglio prodotti */}
            
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>

  );
}

export default App;
