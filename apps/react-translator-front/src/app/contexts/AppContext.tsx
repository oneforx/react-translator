import { useLocalState } from "@oneforx/poseidon";
import { createContext } from "react";

interface IAppStates {

}

interface IAppProps {
    children: React.ReactNode
}

const AppContext = createContext<IAppStates>({});

const AppContextProvider = ({ children }: IAppProps) => {
    const [ lang, setLang ] = useLocalState("lang", "fr")
    return (
        <AppContext.Provider value={{}}>
            { children }
        </AppContext.Provider>
    );
}


export default AppContextProvider