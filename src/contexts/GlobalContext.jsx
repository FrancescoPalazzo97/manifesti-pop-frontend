import { createContext, useState, useEffect, useContext } from "react";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {

    return (
        <GlobalContext.Provider value={{}}>
            {children}
        </GlobalContext.Provider>
    )
}

const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    return context;
}

export { GlobalProvider, useGlobalContext };