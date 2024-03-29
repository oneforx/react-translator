import { ReactTranslatorContext } from "@oneforx/react-translator";
import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { ISentences } from "../../types";
import FlagList from "../components/FlagListComponent";
import { omit, uuid } from '../utils'

//#region types / enum / interfaces

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

const traductorReducer = (
  state = initialState,
  action: {
    type: TraductorConstants,
    payload: TraductorReducerPayload | string
  }
): IInitialState => {
  switch ( action.type ) {
    case TraductorConstants.DELETE_SENTENCE: {
      if ( typeof action.payload === "string" ) {
        if ( state.sentences[action.payload] !== undefined ) {
          const { [action.payload]: value, ...sentences } = state.sentences
          return ({
            ...state,
            currentSentenceId: state.currentSentenceId === action.payload ? undefined : state.currentSentenceId,
            sentences: sentences
          })
        } else return state;
      }
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
              sentenceTraductions: omit<Record<string, string>>({ obj: state.sentences[state.currentSentenceId].sentenceTraductions, keyName: action.payload })
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
        if ( action.payload !== "" ) {
          // SI ACTION.PAYLOAD.ID === CURRENT SENTENCE ID => undefined
          if ( action.payload === state.currentSentenceId || state.sentences[action.payload] === undefined )
            return ({ ...state, currentSentenceId: undefined })
          // ELSE
          else return ({ ...state, currentSentenceId: action.payload })
        } else return state;

      } else return state;
    }
    case TraductorConstants.IMPORT_SENTENCES: {
      if (typeof action.payload !== "undefined" && typeof action.payload !== "string" ) {
        if (typeof action.payload.sentences !== "undefined" && typeof action.payload.sentences === "object") {
          const newSentences: ISentences = {}
          Object.keys(action.payload.sentences).forEach((sk) => {
            if (Object.values(state.sentences).filter((sv) => sv.sentenceName === sk).length < 1) {
              const sentenceTraductions = typeof action.payload !== "string" ? typeof action.payload.sentences === "object" ? action.payload.sentences[sk] : {} : {}
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
  const [ pureLocalesIsShown, setPureLocalesIsShown ] = useState(false);
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
  //#endregion

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
  }, [ fileName, stringifiedParsedLocales ]);
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
            reader.onload = (e) => {
              console.log(JSON.parse(e.target?.result as string));
              dispatch({
                type: TraductorConstants.IMPORT_SENTENCES,
                payload: { sentences: JSON.parse(e.target?.result as string) }
              });
            }
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

  // const handleOnClickOnKey = useCallback((ev) => {
  //   if (ev.keyCode === 32 ) {
  //     if (Object.keys(sentences).length === 0) {
  //       addSentence("new_translate_key");
  //     }
  //   }
  // }, [ sentences, addSentence ]);

  // useEffect(() => {
  //   window.addEventListener("keydown", handleOnClickOnKey, false);
  //   return () => {
  //     window.removeEventListener("keydown", handleOnClickOnKey, false);
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const handleWriteClipboard = useCallback( () => {
    const cb = navigator.clipboard.writeText("npm install @oneforx/react-translator")
    cb.then((v) => {  console.log(v) });
    cb.catch((err) => { console.log(err)});
  }, [])

  return (
    
    <div className="h-full flex flex-1 flex-row dark:bg-gray-800">
      {/** LEFT PANE */}
      <div className="border-r border-gray-100 w-[320px] flex flex-col overflow-auto dark:border-gray-900">
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="p-2">
            <button className="p-2 mb-2 border border-teal-500 w-full text-teal-500 hover:text-white rounded hover:bg-teal-400" onClick={() => importTraductionFile()}>Import</button>
            <button className="p-2 mb-2 border border-teal-500 w-full text-teal-500 hover:text-white rounded hover:bg-teal-400" onClick={() => addSentence("translate_key")}>{translated["new_sentence_key"] || "New sentence key"}</button>
          </div>
          <div className="flex flex-col overflow-auto scrollbar scrollbar-thumb-teal-500 scrollbar-track-teal-50">
            {
              Object.keys(sentences).map((v, idx) => <li
                key={v}
                className={[ "p-2", "flex flex-row justify-between cursor-pointer dark:text-white", currentSentenceId === v ? "font-bold bg-gray-100 dark:bg-gray-900 dark:text-white" : "", idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-600" : "dark:bg-gray-700"].join(" ") }
                onClick={() => dispatch({ type: TraductorConstants.SELECT_SENTENCE, payload: v })}>
                  <span className="truncate">{sentences[v].sentenceName}</span> <button className="px-2" onClick={() => deleteSentence(v)}>x</button>
              </li>
            )}
          </div>
        </div>
        <div className="border-t p-2 border-gray-200 dark:border-gray-900">
          <div>
            <input type="text" placeholder="FileName" value={fileName} onChange={(e) => setFileName(e.target.value)} className="p-2 mb-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-800" />
            <span className="px-2 dark:text-white text-center">.json</span>
          </div>
          <button className="bg-teal-500 hover:ring ring-teal-500 hover:bg-teal-600 p-2 text-white rounded w-full " onClick={handleOnClickExport}>EXPORT</button>
        </div>
      </div>

        {
          currentSentenceId ?
          <div className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col overflow-auto">

              {/** FLAG LIST */}
              <div className="flex overflow-auto pt-16 flex-1 min-h-64 relative overscroll-auto">
                <FlagList
                  flagCodesUsedInSentence={flagCodesUsedInSentence}
                  flagSelected={currentSentenceFlagCode}
                  onClickDeleteLanguage={handleOnClickDeleteLanguage}
                  onClickFlag={ handleOnClickFlag }
                />
              </div>

              <div className="flex flex-row flex-1">
                <div className="p-2 flex flex-1 flex-col">
                  <label htmlFor="sentenceKey" className="dark:text-white">
                    {translated["sentence_key"] || "Sentence Key"}
                  </label>
                  <input
                    name="sentenceKey"
                    className="border p-2 rounded-md mb-2 dark:bg-gray-900 dark:text-white dark:border-gray-800"
                    type="text"
                    value={typeof currentSentenceId !== "undefined" && typeof sentences[currentSentenceId] !== "undefined" ? sentences[currentSentenceId].sentenceName : "" }
                    onChange={handleOnChangeSentenceName}
                    placeholder="hello_world"
                  />
                  <textarea
                    disabled={ !currentSentenceFlagCode }
                    value={ typeof currentSentenceId !== "undefined" && typeof sentences[currentSentenceId] !== "undefined" && currentSentenceFlagCode !== undefined && typeof sentences[currentSentenceId].sentenceTraductions !== "undefined" ? sentences[currentSentenceId].sentenceTraductions[currentSentenceFlagCode] : ""}
                    onChange={handleOnChangeSentenceContent}
                    style={{ width: "100%" }}
                    className="disabled:bg-gray-200 border border-gray-200 dark:bg-gray-900 dark:border-gray-800 rounded-md disabled:border-gray-300 flex-1 p-2 disabled:p-16 disabled:text-xl disabled:font-bold focus:outline-none"
                    placeholder={currentSentenceFlagCode ? "Salut le monde" : "Please select a flag to edit"}>
                  </textarea>
                </div>
                <div className="flex flex-col flex-1 p-2" style={{ maxHeight: "320px" }}>
                  <div className="">
                    <button className={"p-1 border-t-2 border-l-2 rounded-tl border-gray-200 dark:border-gray-700 dark:text-white ".concat(!pureLocalesIsShown ? "bg-gray-700" : "") } onClick={() => setPureLocalesIsShown(false)}>Parsed</button>
                    <button className={"p-1 border-t-2 border-r-2 rounded-tr border-gray-200 dark:border-gray-700 dark:text-white ".concat(pureLocalesIsShown ? "bg-gray-700" : "") } onClick={() => setPureLocalesIsShown(true)}>Pure</button>
                  </div>
                  <div className="border flex-1 dark:border-gray-800 dark:bg-gray-900 dark:text-white rounded">
                    { pureLocalesIsShown ? 
                      <pre
                        lang="json"
                        className={"p-2 overflow-auto"}>
                        {stringifiedLocales}
                      </pre>
                      : <pre
                        lang="json"
                        className={"p-2 overflow-auto"}>
                        {stringifiedParsedLocales}
                      </pre>
                    }
                  </div>
                </div>
              </div>
              
            </div>

          </div> :
          <div className="flex-1 flex flex-col items-center content-center justify-items-center justify-self-center justify-center">
            <h1 className="text-9xl py-10 text-center dark:text-white">React Translator</h1>

            <div className="bg-gray-700 text-white rounded px-2 py-2 flex">
              <pre lang="bash" className="text-xl">
                npm install @oneforx/react-translator
              </pre>
              <div className="px-2 hover:cursor-pointer" onClick={handleWriteClipboard}>
                <i className="fad fa-copy"></i>
              </div>
            </div>

            <div className="text-gray-500 italic my-10">
              {translated["how_to_start_key"] || "Click on new sentence key button to start"}
            </div>
          </div>
        }
    </div>
  );
}
