import { useState, createContext, useContext } from "react";

const useLocalStorage = (key, initalValue) => {
    // Quando si và a montare la componente prova a leggere localStorage
    const [value, setValue] = useState(() => {
        // Try lo uso per non far crashare il tutto
        try {
            // Cerco
            const saved = localStorage.getItem(key);
            // Se trovo qualcosa lo converto da stringa a oggetto altrimenti uso initalValue
            return saved ? JSON.parse(saved) : initalValue;
            // Catch mi prende ggli errori
        } catch {
            // In caso di errori mi restituisce initalValue
            return initalValue;
        }
    });

    // Funzione per salvare un nuovo valore
    const saveValue = (newValue) => {
        try {
            // aggiorno lo stato di value
            setValue(newValue);
            // Salvo nel localStorage convertendo in stringa
        } catch (err) {
            console.error(`Errore nel salvare: ${err}`);
        }
    };

    return [value, saveValue]
}