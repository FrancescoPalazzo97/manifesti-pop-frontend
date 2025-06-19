import { createContext, useState, useEffect, useContext } from "react";
import useLocalStorage from "../hooks/LocalStorage"
import axios from "axios";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // Filtro di ricerca 
  const [filter, setFilter] = useState("");

  // //  Lista dei preferiti (wishlist)
  // const [wishlist, setWishlist] = useState([]);

  // // Funzione per aggiungere un poster ai preferiti
  // const addToWishlist = (poster) => {
  //   const isAlreadyIn = wishlist.find(item => item.id === poster.id);
  //   if (!isAlreadyIn) {
  //     setWishlist(prev => [...prev, poster]);
  //   }
  // };

  // // Funzione per rimuovere un poster dai preferiti
  // const removeFromWishlist = (posterId) => {
  //   setWishlist(prev => prev.filter(item => item.id !== posterId));
  // };

  const [wishlist, setWishlist] = useLocalStorage(`poster-wishlist`, []);

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
      wishlistData
      // wishlist,
      // addToWishlist,
      // removeFromWishlist
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider;
