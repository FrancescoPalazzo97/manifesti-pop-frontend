import { createContext, useState, useEffect, useContext } from "react";
import useLocalStorage from "../hooks/LocalStorage"
import axios from "axios";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // Wishlist
  const [wishlist, setWishlist] = useLocalStorage(`poster-wishlist`, []);

  // cart
  const [cart, setCart] = useLocalStorage(`poster-cart`, []);

  // Filtro di ricerca 
  const [filter, setFilter] = useState("");

  //funzione per aggiungere un poster al carrello
  const addCart = (poster) => {
    const newCart = [...cart, poster];
    setCart(newCart);
  }

  //funzione per rimuovere i poster dal carrello
  const removeFromCart = (posterId) => {
    const newCart = cart.filter(item => item.id !== posterId);
    setCart(newCart);
  };

  // Funzione per svuotare il carrello
  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (posterId) => {
    return cart.some(item => item.id === posterId);
  }

  const cartCount = cart.length;

  const cartData = {
    cart,
    addCart,
    removeFromCart,
    clearCart,
    isInCart,
    cartCount
  }

  // Funzione di aggiunta
  const addToWishlist = (poster) => {

    const exist = wishlist.find(item => item.id === poster.id);

    if (exist) {
      alert(`Questo poster è già nella tua wishlist`);
      return;
    }

    const newWishlist = [...wishlist, poster];
    setWishlist(newWishlist);

    alert(`${poster.title} aggiunto alla wishlist`)
  }

  // Funzione di elimina
  const removeFromWishlist = (posterId) => {
    const newWishlist = wishlist.filter(item => item.id !== posterId);
    setWishlist(newWishlist);

    alert(`poster rimosso`);
  }

  const isInWishlist = (posterId) => {
    return wishlist.some(item => item.id === posterId);
  };

  const clearWishlist = () => {
    if (window.confirm('Vuoi davvero svuotare la wishlist?')) {
      setWishlist([]);
      alert('Wishlist svuotata!');
    }
  };

  const wishlistCount = wishlist.length;

  // Metto tutti i dati e le funzioni in un oggetto
  const wishlistData = {
    wishlist,           // Array di tutti i poster nella wishlist
    addToWishlist,      // Funzione per aggiungere
    removeFromWishlist, // Funzione per rimuovere
    isInWishlist,       // Funzione per controllare se esiste
    clearWishlist,      // Funzione per svuotare tutto
    wishlistCount       // Numero di poster nella wishlist
  };

  return (
    <GlobalContext.Provider value={{
      filter,
      setFilter,
      cartData,
      wishlistData
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider;
