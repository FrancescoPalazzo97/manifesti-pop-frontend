import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [filter, setFilter] = useState("");
  return <GlobalContext.Provider value={{ filter, setFilter }}>{children}</GlobalContext.Provider>;
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  return context;
};

export { GlobalProvider, useGlobalContext };
