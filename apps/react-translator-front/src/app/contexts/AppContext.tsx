import { useLocalState } from "@oneforx/poseidon";
import { createContext, useEffect } from "react";

interface IAppStates {
  darkTheme?: boolean,
  setDarkTheme: ((newValue: boolean) => void)
}

interface IAppProps {
  children: React.ReactNode
}

const AppContext = createContext<IAppStates>({
  darkTheme: false,
  setDarkTheme: (newValue: boolean) => {}
});

const AppContextProvider = ({ children }: IAppProps) => {
    const [ darkTheme, setDarkTheme ] = useLocalState("dark", false);

    useEffect(() => {
      if (darkTheme || (!('dark' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }, [darkTheme]);
    
    return (
        <AppContext.Provider value={{
          darkTheme,
          setDarkTheme
        }}>
            { children }
        </AppContext.Provider>
    );
}


export default AppContextProvider
