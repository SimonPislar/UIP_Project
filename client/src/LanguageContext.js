import React, { createContext, useState, useContext } from 'react';
import en from './Languages/en.json';
import se from './Languages/se.json';

// Create a context for the language
const LanguageContext = createContext();

// The translations for the different languages
const languages = {
    en,
    se,
};

// Get the translation for the language
function getTranslation(language) {
    return languages[language] || languages.en;
}

// The provider for the language context
export const LanguageProvider = ({ children }) => {
    // The state variables for the language and translations
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState(getTranslation('en'));

    // Change the language
    const changeLanguage = (lang) => {
        setLanguage(lang);
        setTranslations(getTranslation(lang));
    };

    // The JSX to be rendered (not visible in the UI)
    return (
        <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
