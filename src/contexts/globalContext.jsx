import { createContext, useState, useEffect, useContext, Children } from "react";

const GlobalContext = createContext();

const GlobalProvider = ({ Children }) => {

    return <GlobalContext.Provider value={{}}>
        {Children}
    </GlobalContext.Provider>
}

const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    return context;
}

export { GlobalProvider, useGlobalContext };