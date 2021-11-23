import { useLocalState } from "@oneforx/hooks-contexts"
import React, { createContext, useCallback, useMemo, useState } from "react"

interface ReactTranslatorContextProps {
  lang: string,
  currentLocale?: Record<string, string>,
  setLang?: (lang: string) => void,
  translatePhraseKey: ( phraseKey: string, locales: ILocales ) => string | null,
  translated: Record<string, string>
}

const InitialReactTranslatorContextState: ReactTranslatorContextProps = {
  lang: "fr",
  translatePhraseKey: ( phraseKey: string, locales?: ILocales, lang?: string ) => {
    if (locales !== undefined && lang !== undefined) {
      return locales[phraseKey][lang]
    }  return null
  },
  translated: {}
}

export const ReactTranslatorContext = createContext<ReactTranslatorContextProps>(InitialReactTranslatorContextState)

type ILocales = {
  [key: string]: Record<string, string>
}

interface IReactTranslatorContextProviderProps {
  locales: ILocales,
  children:  React.ReactNode
}

export const ReactTranslatorContextProvider = ({ locales, children }: IReactTranslatorContextProviderProps) => {
  const [ lang, setLang ] = useState("fr");
  const [ traductionPerComponent, setTraductionPerComponent ] = useLocalState("tradPerComponent", false);

  const translatePhraseKey = useCallback(( phraseKey: string ): string => {
    return locales[phraseKey]["fr"];
  }, [ locales, lang ]);

  const translated = useMemo((): Record<string, string > => {
    let newObj: Record<string, string> = {}
    Object.keys(locales).forEach( lk => {
      newObj[lk] = translatePhraseKey(lk);
    })
    return newObj
  }, [ locales, translatePhraseKey ])

  return (
    <ReactTranslatorContext.Provider value={{ lang, setLang, translated, translatePhraseKey }}>{children}</ReactTranslatorContext.Provider>
  );
}

export default ReactTranslatorContext
