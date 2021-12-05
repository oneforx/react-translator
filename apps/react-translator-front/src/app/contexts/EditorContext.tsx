import { createContext, useCallback, useReducer, useState } from "react";
import { TProject } from "../../types";

interface IEditorProviderStates {
  currentProjectsId: Array<string>,
  projects?: Record<string, TProject>,
  addProject?: ( (projectId: string, projectData: TProject) => void )
  deleteProject?: ( (projectId: string) => void ),
  modifyProject?: ( (projectId: string) => void )
}

interface IEditorProps {
  children: React.ReactNode
}

const editorInitialState: IEditorProviderStates = {
  currentProjectsId: []
}

const EditorContext = createContext<IEditorProviderStates>(editorInitialState);

enum EditorActionTypes {
  SET_PROJECT_ID,
  REMOVE_PROJECT_ID,
  ADD_PROJECT,
  MODIFY_PROJECT,
  DELETE_PROJECT
}

type TEditorActionPayload = {
  projectId?: string,
  projectData?: TProject
};

const editorReducer = (
  state: IEditorProviderStates = editorInitialState,
  action: {
    type: EditorActionTypes,
    payload: TEditorActionPayload
  }
) => {
  switch ( action.type ) {
    case EditorActionTypes.SET_PROJECT_ID: {
      if ( typeof action.payload.projectId === "string") {
        return {
          ...state,
          currentProjectsId: [ ...state.currentProjectsId, action.payload.projectId],
        };
      } else return state;
    }
    case EditorActionTypes.REMOVE_PROJECT_ID: {
      if ( typeof action.payload.projectId === "string") {
        return {
          ...state,
          currentProjectsId: state.currentProjectsId.filter( cp => cp !== action.payload.projectId ),
        };
      } else return state;
    }
    default:
      return state;
  }
}


const EditorContextProvider = ({ children }: IEditorProps) => {
  const [ editorState, editorDispatch ] = useReducer(editorReducer, editorInitialState);

  const addProject = useCallback(( projectData ) => {
    if (projectData as TProject) {
      editorDispatch({ type: EditorActionTypes.ADD_PROJECT, payload: { projectData } })
    }
  }, []);

  const deleteProject = useCallback(( projectId: string ) => {
    editorDispatch({ type: EditorActionTypes.DELETE_PROJECT, payload: { projectId } })
  }, []);

  const modifyProject = useCallback(( projectData ) => {
    if (projectData as TProject) {
      editorDispatch({ type: EditorActionTypes.ADD_PROJECT, payload: { projectData } })
    }
  }, []);


  return (
    <EditorContext.Provider value={{
      currentProjectsId: editorState.currentProjectsId,
      projects: editorState.projects,
      addProject,
      modifyProject,
      deleteProject
    }}>{ children }</EditorContext.Provider>
  );
}

export default EditorContextProvider
