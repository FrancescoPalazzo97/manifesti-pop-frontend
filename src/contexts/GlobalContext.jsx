import { createContext, useState, useEffect, useContext } from "react";
import useLocalStorage from "../hooks/LocalStorage"
import axios from "axios";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // Wishlist
  const [wishlist, setWishlist] = useLocalStorage(`poster-wishlist`, []);
  const [filter, setFilter] = useState("");
  const [cart, setCart] = useState([]);

  // Aggiungi o incrementa quantità
  const addCart = (poster) => {
    const isAlreadyIn = cart.find(item => item.id === poster.id);
    if (!isAlreadyIn) {
      setCart(prev => [...prev, { ...poster, quantity: 1 }]);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === poster.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    }
  };

  // Decrementa quantità o rimuovi se 1
  const decrementCart = (posterId) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === posterId
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // Aggiorna quantità direttamente
  const updateCartQuantity = (posterId, newQuantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === posterId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Rimuovi dal carrello
  const removeFromCart = (posterId) => {
    setCart(prev => prev.filter(item => item.id !== posterId));
  };

  const clearCart = () => {
    setCart([]);
  };

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

  // Calcola il prezzo scontato di un poster
  const getDiscountedPrice = (poster) => {
    if (poster.discount && poster.discount > 0) {
      return (poster.price * (1 - poster.discount / 100));
    }
    return poster.price;
  };

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
      cart,
      addCart,
      decrementCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      wishlistData,
      getDiscountedPrice
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider;
