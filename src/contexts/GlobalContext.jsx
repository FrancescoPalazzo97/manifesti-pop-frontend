import { createContext, useState, useEffect, useContext } from "react";
import useLocalStorage from "../hooks/LocalStorage";
import axios from "axios";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // Wishlist
  const [wishlist, setWishlist] = useLocalStorage(`poster-wishlist`, []);

  // cart
  const [cart, setCart] = useLocalStorage(`poster-cart`, []);

  // Filtro di ricerca
  const [filter, setFilter] = useState("");

  // Dati inseriti per l'ordine
  const [orderData, setOrderData] = useState(null);

  const isInCart = (posterId) => {
    return cart.some((item) => item.id === posterId);
  };

  // Aggiungi o incrementa quantità
  const addCart = (poster) => {
    const existingItemIndex = cart.findIndex((item) => item.id === poster.id);

    if (existingItemIndex === -1) {
      // Se il poster non esiste nel carrello, aggiungilo con la quantità richiesta (se presente)
      const newPoster = {
        ...poster,
      };
      const newCart = [...cart, newPoster];
      setCart(newCart);
    } else {
      // Se il poster esiste già, aumenta la quantità (solo se non forzato)
      const newCart = cart.map((cartItem, index) => {
        if (index === existingItemIndex) {
          return {
            ...cartItem,
            quantity: poster.forceQuantity
              ? cartItem.quantity // non modificare se già presente
          };
        }
        return cartItem;
      });
      setCart(newCart);
    }
  };

  const updateQuantity = (posterId, newQuantity) => {
    if (newQuantity <= 0) {
      // Se la quantità è 0 o negativa, rimuovi il prodotto
      removeFromCart(posterId);
      return;
    }

    const newCart = cart.map((cartItem) => {
      if (cartItem.id === posterId) {
        return {
          ...cartItem,
          quantity: newQuantity,
        };
      }
      return cartItem;
    });
    setCart(newCart);
  };

  const increaseQuantity = (posterId, maxStock) => {
    const item = cart.find((cartItem) => cartItem.id === posterId);
    if (item && item.quantity < maxStock) {
      updateQuantity(posterId, item.quantity + 1);
    }
  };

  const decreaseQuantity = (posterId) => {
    const item = cart.find((cartItem) => cartItem.id === posterId);
    if (item && item.quantity > 1) {
      updateQuantity(posterId, item.quantity - 1);
    }
  };

  //funzione per rimuovere i poster dal carrello
  const removeFromCart = (posterId) => {
    const newCart = cart.filter((item) => item.id !== posterId);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.length;

  const cartData = {
    cart,
    addCart,
    removeFromCart,
    clearCart,
    isInCart,
    cartCount,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
  };

  // Funzione di aggiunta
  const addToWishlist = (poster) => {
    const exist = wishlist.find((item) => item.id === poster.id);

    if (exist) {
      alert(`Questo poster è già nella tua wishlist`);
      return;
    }

    const newWishlist = [...wishlist, poster];
    setWishlist(newWishlist);

    //alert(`${poster.title} aggiunto alla wishlist`)
  };

  // Funzione di elimina
  const removeFromWishlist = (posterId) => {
    const newWishlist = wishlist.filter((item) => item.id !== posterId);
    setWishlist(newWishlist);

    //alert(`poster rimosso`);
  };

  const isInWishlist = (posterId) => {
    return wishlist.some((item) => item.id === posterId);
  };

  const clearWishlist = () => {
    if (window.confirm("Vuoi davvero svuotare la wishlist?")) {
      setWishlist([]);
      //alert('Wishlist svuotata!');
    }
  };

  const wishlistCount = wishlist.length;

  // Calcola il prezzo scontato di un poster
  const getDiscountedPrice = (poster) => {
    if (poster.discount && poster.discount > 0) {
      return poster.price * (1 - poster.discount / 100);
    }
    return poster.price;
  };

  // Metto tutti i dati e le funzioni in un oggetto
  const wishlistData = {
    wishlist, // Array di tutti i poster nella wishlist
    addToWishlist, // Funzione per aggiungere
    removeFromWishlist, // Funzione per rimuovere
    isInWishlist, // Funzione per controllare se esiste
    clearWishlist, // Funzione per svuotare tutto
    wishlistCount, // Numero di poster nella wishlist
  };

  return (
    <GlobalContext.Provider
      value={{
        filter,
        setFilter,
        cartData,
        wishlistData,
        getDiscountedPrice,
        orderData,
        setOrderData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider;
