import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/posters/")
      .then((res) => {
        setPosters(res.data);
      })
      .catch((err) => {
        console.log("Errore caricamento poster:", err);
      });
  }, []);

  return (
    <GlobalContext.Provider value={{ posters }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  return context;
};

export { GlobalProvider, useGlobalContext };
