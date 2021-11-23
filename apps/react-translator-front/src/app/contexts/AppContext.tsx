import { useLocalState } from "@oneforx/poseidon";
import { createContext } from "react";

interface IAppStates {
  hi: ""
}

interface IAppProps {
    children: React.ReactNode
}

const AppContext = createContext<IAppStates>({
  hi: ""
});

const AppContextProvider = ({ children }: IAppProps) => {
    const [ lang, setLang ] = useLocalState("lang", "fr")
    return (
        <AppContext.Provider value={{ hi: "" }}>
            { children }
        </AppContext.Provider>
    );
}


export default AppContextProvider
