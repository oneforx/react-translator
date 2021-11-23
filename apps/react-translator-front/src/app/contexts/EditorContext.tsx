import { createContext } from "react";

interface IEditorStates {

}

interface IEditorProps {
    children: React.ReactNode
}

const EditorContext = createContext<IEditorStates>({});

const EditorContextProvider = ({ children }: IEditorProps) => {
    return (
        <EditorContext.Provider value={{}}>
            { children }
        </EditorContext.Provider>
    );
}

export default EditorContextProvider