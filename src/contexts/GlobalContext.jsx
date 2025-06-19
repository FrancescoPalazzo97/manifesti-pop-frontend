import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";




const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // Filtro di ricerca 
  const [filter, setFilter] = useState("");

  //  Lista dei preferiti (wishlist)
  const [wishlist, setWishlist] = useState([]);

  //lista i poster nel carrello
  const [cart, setCart] = useState([]);

  //funzione per aggiungere un poster al carrello
  const addCart = (poster) => {
    const isAlreadyIn = cart.find(item => item.id === poster.id);
    if (!isAlreadyIn) {
      setCart(prev => [...prev, poster]);
    }
  }

  //funzione per rimuovere i poster dal carrello
  const removeFromCart = (posterId) => {
    setCart(prev => prev.filter(item => item.id !== posterId));
  };

  // Funzione per svuotare il carrello
  const clearCart = () => {
    setCart([]);
  };

  // Funzione per aggiungere un poster ai preferiti
  const addToWishlist = (poster) => {
    const isAlreadyIn = wishlist.find(item => item.id === poster.id);
    if (!isAlreadyIn) {
      setWishlist(prev => [...prev, poster]);
    }
  };

  // Funzione per rimuovere un poster dai preferiti
  const removeFromWishlist = (posterId) => {
    setWishlist(prev => prev.filter(item => item.id !== posterId));
  };

  return (
    <GlobalContext.Provider value={{
      filter,
      setFilter,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      cart,
      addCart,
      removeFromCart,
      clearCart, // aggiunto qui
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalProvider, useGlobalContext };
