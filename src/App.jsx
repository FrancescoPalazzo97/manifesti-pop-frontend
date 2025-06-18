import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import HomePage from "./pages/HomePage";
import { GlobalProvider } from "./contexts/GlobalContext";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import PostersPage from "./pages/PostersPage";
import WishlistPage from "./pages/WishlistPage";


function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/posters/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/posters-list" element={<PostersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
