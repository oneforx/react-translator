import { ReactTranslatorContext } from "@oneforx/react-translator";
import { useCallback, useContext, useMemo, useReducer, useState } from "react";
import FlagList from "../components/FlagList";
import { omit, uuid } from '../utils'

//#region types / enum / interfaces
export type ISentences = {
  [key: string]: {
    sentenceName?: string,
    sentenceTraductions: Record<string, string>
  }
}

enum TraductorConstants {
  ADD_SENTENCE,
  MODIFY_SENTENCE_NAME,
  MODIFY_SENTENCE_CONTENT,
  DELETE_SENTENCE,
  DELETE_TRADUCTION_SENTENCE,
  SELECT_FLAG_CODE,
  SELECT_SENTENCE,
  IMPORT_SENTENCES,
}

interface IInitialState {
  currentSentenceId?: string,
  currentSentenceFlagCode?: string,
  sentences: ISentences
}

type TraductorReducerPayload = {
  sentenceName?: string,
  sentenceContent?: string,
  sentenceId?: string,
  sentences?: Record<string, Record<string, string>>
}
//#endregion

const initialState: IInitialState = {
  currentSentenceId: "",
  currentSentenceFlagCode: "",
  sentences: {}
}

const deleteSentence = ( state: IInitialState, sentenceId: string ) => {
  return ({ ...state, currentSentenceId: undefined, sentences: omit(state.sentences, sentenceId) })
}

const traductorReducer = (
  state = initialState,
  action: {
    type: TraductorConstants,
    payload: TraductorReducerPayload | string
  }
): IInitialState => {
  switch ( action.type ) {
    case TraductorConstants.DELETE_SENTENCE: {
      if ( typeof action.payload === "string" )
        return deleteSentence( state, action.payload )
      else return state;
    }
    case TraductorConstants.DELETE_TRADUCTION_SENTENCE: {
      if ( typeof action.payload === "string" && state.currentSentenceId !== undefined)
        return ({
          ...state,
          sentences: {
            ...state.sentences,
            [state.currentSentenceId]: {
              ...state.sentences[state.currentSentenceId],
              sentenceTraductions: omit<Record<string, string>>(state.sentences[state.currentSentenceId].sentenceTraductions, action.payload)
            }
          }
        })
      else return state;
    }
    case TraductorConstants.ADD_SENTENCE: {
      if ( typeof action.payload !== "string" ) {
        const { sentenceName } = action.payload;
        const sentenceId = uuid.get();
        return ({
          ...state,
          currentSentenceId: sentenceId,
          sentences: {
            ...state.sentences,
            [sentenceId]: {
              sentenceName,
              sentenceTraductions: {}
            }
          }
        });
      } else return state
    }
    case TraductorConstants.MODIFY_SENTENCE_NAME: {
      if ( typeof action.payload !== "string" ) {
        const { sentenceName } = action.payload;
        if ( state.currentSentenceId ) {
          return ({
            ...state,
            sentences: {
              ...state.sentences,
              [state.currentSentenceId]: {
                ...state.sentences[state.currentSentenceId],
                sentenceName
              }
            }
          })
        } else return state;
      } else return state
    }
    case TraductorConstants.MODIFY_SENTENCE_CONTENT: {
      if ( typeof action.payload !== "string" ) {
        console.log(action.payload, typeof (action.payload.sentenceContent))
        const { sentenceContent } = action.payload;

        if ( state.currentSentenceId && state.currentSentenceFlagCode && sentenceContent !== undefined ) {
          return ({
            ...state,
            sentences: {
              ...state.sentences,
              [state.currentSentenceId]: {
                ...state.sentences[state.currentSentenceId],
                sentenceTraductions: {
                  ...state.sentences[state.currentSentenceId].sentenceTraductions,
                  [state.currentSentenceFlagCode]: sentenceContent
                }
              }
            }
          })
        } else return state;
      } else return state;
    }
    case TraductorConstants.SELECT_FLAG_CODE: {
      if (typeof action.payload === "string") {
        return ({ ...state, currentSentenceFlagCode: action.payload })
      } else return state;
    }
    case TraductorConstants.SELECT_SENTENCE: {
      if (typeof action.payload === "string") {
        return ({ ...state, currentSentenceId: action.payload })
      } else return state;
    }
    case TraductorConstants.IMPORT_SENTENCES: {
      if (typeof action.payload !== "undefined" && typeof action.payload !== "string" ) {
        if (typeof action.payload.sentences !== "undefined" && typeof action.payload.sentences === "object") {
          const newSentences: ISentences = {}
          Object.keys(action.payload.sentences).forEach((sk) => {
            if (Object.values(state.sentences).filter((sv) => sv.sentenceName === sk).length < 1) {
              const sentenceTraductions = typeof action.payload !== "string" ? typeof action.payload.sentences === "object" ? typeof action.payload.sentences[sk] : {} : {}
              newSentences[uuid.get()] = {
                sentenceName: sk,
                sentenceTraductions
              }
            }
          })
          return { ...state, sentences: {...state.sentences, ...newSentences }}
        } else return state
      } else return state
    }
    default:
      return state;
  }
}

export default function CreateTraductionScreen () {
  //#region STATES
  const [
    { currentSentenceId, sentences, currentSentenceFlagCode },
    dispatch
  ] = useReducer(traductorReducer, initialState);
  const [ fileName, setFileName ] = useState("traductions")
  const flagCodesUsedInSentence = useMemo(() => {
    return typeof currentSentenceId !== "undefined" && typeof sentences[currentSentenceId] !== "undefined" ? Object.keys(sentences[currentSentenceId].sentenceTraductions) : []
  }, [ currentSentenceId, sentences ])
  const { translated } = useContext(ReactTranslatorContext)
  //#endregion


  //#region CALLBACKS
  const addSentence = useCallback(( sN: string ) => {
    dispatch({
      type: TraductorConstants.ADD_SENTENCE,
      payload: { sentenceName: sN }
    })
  }, []);

  const deleteSentence = useCallback(( sentenceId: string ) => {
    if ( sentenceId ) {
      dispatch({
        type: TraductorConstants.DELETE_SENTENCE,
        payload: sentenceId
      })
    } else {
      console.error("function.deleteSentence() missing arguments");
    }
  }, []);

  const handleOnChangeSentenceName = useCallback((e) => {
    const sentenceId = uuid.get()
    dispatch({
      type: TraductorConstants.MODIFY_SENTENCE_NAME,
      payload: { sentenceId, sentenceName: e.target.value }
    })
  }, []);

  const handleOnChangeSentenceContent = useCallback((e) => {
    dispatch({
      type: TraductorConstants.MODIFY_SENTENCE_CONTENT,
      payload: { sentenceContent: e.target.value }
    })
  }, []);

  //#region OTHERS
  const handleOnClickFlag = useCallback(( ctk: string ) => {
    dispatch({ type: TraductorConstants.SELECT_FLAG_CODE, payload: ctk })
  }, []);

  const pipeToContext = useCallback(( tradFromReducer: ISentences ) => {
    let obj = {}
    Object.values(tradFromReducer).forEach(( o ) => {
      if ( typeof o.sentenceName === "string" )
        obj = { ...obj, [o.sentenceName]: o.sentenceTraductions }
    })
    return obj
  }, [])

  const stringifiedLocales = useMemo(() => JSON.stringify( sentences, null, 4), [ sentences ]);
  const stringifiedParsedLocales = useMemo(() => JSON.stringify(pipeToContext( sentences )), [pipeToContext, sentences]);

  const handleOnClickExport = useCallback(() => {
    const file = document.createElement("a");
    file.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(stringifiedParsedLocales))
    file.setAttribute('download', fileName + ".json")
    file.click();
  }, [fileName, stringifiedParsedLocales]);
  //#endregion

  const importTraductionFile = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.json');

    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      if (target) {
        if (target.files) {
          if (target.files.length > 0) {
            const file = target.files[0]
            const reader = new FileReader()
            reader.onload = (e) => dispatch({
              type: TraductorConstants.IMPORT_SENTENCES,
              payload: { sentences: JSON.parse(e.target?.result as string) }
            });
            reader.readAsText(file, "utf-8");
          }
        }
      }
    })

    input.click()
  }, []);

  const handleOnClickDeleteLanguage = useCallback(( ctk: string ) => {
    return dispatch({
      type: TraductorConstants.DELETE_TRADUCTION_SENTENCE,
      payload: ctk
    });
  }, []);

  return (
    <div className="h-full flex flex-row">
      {/** LEFT PANE */}
      <div className="border-r border-gray-100 w-[320px] flex flex-col overflow-auto">
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="p-2">
            <button className="p-2 mb-2 border border-gray-50 bg-gray-500 w-full text-white rounded" onClick={() => importTraductionFile()}>Import</button>
            <button className="p-2 mb-2 border border-gray-50 bg-gray-500 w-full text-white rounded" onClick={() => addSentence("translate_key")}>{translated["new_sentence_key"]}</button>
          </div>
          <div className="flex flex-col overflow-auto scrollbar scrollbar-thumb-teal-500 scrollbar-track-teal-50">
            {
              Object.keys(sentences).map((v, idx) => <li
                key={v}
                className={[ "p-2", "flex flex-row justify-between cursor-pointer", currentSentenceId === v ? "font-bold bg-gray-100" : "", idx % 2 === 0 ? "bg-gray-50" : ""].join(" ") }
                onClick={() => dispatch({ type: TraductorConstants.SELECT_SENTENCE, payload: currentSentenceId === v ? "" : v })}>
                  <span className="truncate">{sentences[v].sentenceName}</span> <button className="px-2" onClick={() => deleteSentence(v)}>x</button>
              </li>
            )}
          </div>
        </div>
        <div className="border-t p-2 border-gray-100">
          <div>
            <input type="text" placeholder="FileName" value={fileName} onChange={(e) => setFileName(e.target.value)} className="p-2 mb-2 rounded border" />
            <span className="px-2">.json</span>
          </div>
          <button className="bg-teal-600 p-2 text-white rounded w-full" onClick={handleOnClickExport}>EXPORT</button>
        </div>
      </div>

        {
          currentSentenceId ?
          <div className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col overflow-auto">

            {/** FLAG LIST */}
            <div className="flex overflow-auto pt-16 relative h-[195px] overscroll-auto">
              <FlagList
                flagCodesUsedInSentence={flagCodesUsedInSentence}
                flagSelected={currentSentenceFlagCode}
                onClickDeleteLanguage={handleOnClickDeleteLanguage}
                onClickFlag={ handleOnClickFlag }
              />
            </div>

            <div className="flex flex-row border-b border-gray-100">
              <div className="p-2 flex flex-1 flex-col">
                <label htmlFor="sentenceKey">
                  {translated["sentence_key"]}
                </label>
                <input
                  name="sentenceKey"
                  className="border p-2 rounded"
                  type="text"
                  value={typeof currentSentenceId !== "undefined" && typeof sentences[currentSentenceId] !== "undefined" ? sentences[currentSentenceId].sentenceName : "" }
                  onChange={handleOnChangeSentenceName}
                  placeholder="hello_world"
                />
              </div>
            </div>

            <textarea
              disabled={ !currentSentenceFlagCode }
              value={ typeof currentSentenceId !== "undefined" && typeof sentences[currentSentenceId] !== "undefined" && currentSentenceFlagCode !== undefined && typeof  sentences[currentSentenceId].sentenceTraductions !== "undefined" ? sentences[currentSentenceId].sentenceTraductions[currentSentenceFlagCode] : ""}
              onChange={handleOnChangeSentenceContent}
              style={{ width: "100%", padding: "2px" }}
              className="disabled:bg-gray-200 p-4 flex-1 border-none active:border-none  focus:outline-none"
              placeholder={currentSentenceFlagCode ? "Salut le monde" : "Please select a flag to edit"}>
            </textarea>
            </div>

            <pre
            lang="json"
            className={"border-t p-2 border-gray-100 h-64 overflow-auto"}
            style={{ height: `320px` }}>
            {stringifiedLocales}
            </pre>
          </div> :
          <div className="flex-1 flex flex-col items-center">
            <h1 className="text-3xl">React Traductor</h1>

            <div className="bg-blue-400 text-white rounded px-2 py-1">
              <pre lang="bash">
                npm install @oneforx/react-traductor
              </pre>
              <div>
                <i className="fad fa-copy"></i>
              </div>
            </div>
          </div>
        }
    </div>
  );
}
