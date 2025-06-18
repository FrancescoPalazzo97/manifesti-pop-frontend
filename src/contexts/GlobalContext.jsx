import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";




const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // Filtro di ricerca 
  const [filter, setFilter] = useState("");

  //  Lista dei preferiti (wishlist)
  const [wishlist, setWishlist] = useState([]);

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
      removeFromWishlist
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalProvider, useGlobalContext };
