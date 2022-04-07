import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { ISentences, TProject } from "../../types";

interface IEditorProviderStates {
  currentProjectId: string, // Openned
  projects: Record<string, TProject>,
  addProject: ( (projectId: string, projectData?: {
    currentSentenceId?: string,
    currentSentenceFlagCode?: string,
    sentences?: ISentences
  } ) => void ),
  selectProjectId: (( projectId: string) => void)
  deleteProject: ( (projectId: string) => void ),
  modifyProject: ( (projectId: string, projectData: TProject ) => void )
}

interface IEditorProps {
  children: React.ReactNode
}

const editorInitialState: IEditorProviderStates = {
  projects: {},
  currentProjectId: "",
  addProject: ( (projectId: string, projectData?: {
    currentSentenceId?: string,
    currentSentenceFlagCode?: string,
    sentences?: ISentences
  } ) => {}),
  selectProjectId: ( (projectId: string) => {}),
  deleteProject: ( (projectId: string) => {}),
  modifyProject: ( (projectId: string, projectData: TProject ) => {})
}

export const EditorContext = createContext<IEditorProviderStates>(editorInitialState);

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
  state = editorInitialState,
  action: {
    type: EditorActionTypes,
    payload: TEditorActionPayload
  }
): IEditorProviderStates => {
  switch ( action.type ) {
    case EditorActionTypes.SET_PROJECT_ID: {
      if ( typeof action.payload.projectId === "string") {
        return {
          ...state,
          currentProjectId: action.payload.projectId,
        };
      } else return state;
    }
    case EditorActionTypes.ADD_PROJECT: {
      if ( typeof action.payload.projectId === "string") {
        return {
          ...state,
          projects: {
            ...state.projects,
            [action.payload.projectId]: action.payload.projectData || {
              currentSentenceId: "",
              currentSentenceFlagCode: "",
              sentences: {}
            }
          }
        }
      } else return state;
    }
    case EditorActionTypes.MODIFY_PROJECT: {
      if ( typeof action.payload.projectId === "string") {
        return {
          ...state,
          projects: {
            ...state.projects,
            [action.payload.projectId]: action.payload.projectData || {
              currentSentenceId: "",
              currentSentenceFlagCode: "",
              sentences: {}
            }
          }
        }
      } else return state;
    }
    default:
      return state;
  }
}


const EditorContextProvider = ({ children }: IEditorProps) => {
  const [ editorState, editorDispatch ] = useReducer(editorReducer, editorInitialState);

  const addProject = useCallback(( projectId, projectData? ) => {
    if (projectId) {
      editorDispatch({ type: EditorActionTypes.ADD_PROJECT, payload: { projectId,  projectData: projectData ? projectData : {
        currentSentenceId: "",
        currentSentenceFlagCode: "",
        sentences: {}
      }} })
    }
  }, []);

  const deleteProject = useCallback(( projectId: string ) => {
    editorDispatch({ type: EditorActionTypes.DELETE_PROJECT, payload: { projectId } })
  }, []);

  const modifyProject = useCallback(( projectId: string, projectData: TProject ) => {
    editorDispatch({ type: EditorActionTypes.MODIFY_PROJECT, payload: { projectId, projectData } })
  }, []);

  const selectProjectId = useCallback((projectId: string) => {
    editorDispatch({ type: EditorActionTypes.SET_PROJECT_ID, payload: { projectId }})
  }, [])

  useEffect(() => {
    console.log(editorState.projects)
  }, [ editorState.projects])

  return (
    <EditorContext.Provider value={{
      currentProjectId: editorState.currentProjectId,
      projects: editorState.projects,
      addProject,
      modifyProject,
      selectProjectId,
      deleteProject
    }}>{ children }</EditorContext.Provider>
  );
}

export default EditorContextProvider
