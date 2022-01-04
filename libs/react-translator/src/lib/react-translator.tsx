import { useLocalState } from "@oneforx/poseidon"
import React, { createContext, useCallback, useMemo, useState } from "react"

interface ReactTranslatorContextProps {
  lang: string,
  currentLocale?: Record<string, string>,
  setLang: (lang: string) => void,
  translatePhraseKey: ( phraseKey: string, lang: string, locales: ILocales ) => string | undefined,
  translated: Record<string, string>,
  availableLangs: string[]
}

const InitialReactTranslatorContextState: ReactTranslatorContextProps = {
  lang: "fr",
  setLang: (lang: string) => { return; },
  translatePhraseKey: ( phraseKey: string, lang: string, locales?: ILocales): string | undefined => {
    if ( typeof locales === "object" ) {
      if ( locales[phraseKey] !== undefined ) {
        return locales[phraseKey][lang];
      } else {
        return undefined
      }
    } else return undefined
  },
  translated: {},
  availableLangs: []
}

export const ReactTranslatorContext = createContext<ReactTranslatorContextProps>(InitialReactTranslatorContextState)

export type ILocales = {
  [key: string]: Record<string, string>
}

interface IReactTranslatorContextProviderProps {
  locales: ILocales | { [key: string]: Record<string, string> },
  children:  React.ReactNode
}

export const ReactTranslatorContextProvider = ({ locales, children }: IReactTranslatorContextProviderProps) => {
  const [ lang, setLang ] = useState("fr");

  const availableLangs = useMemo(() => {
    // eslint-disable-next-line prefer-const
    let langs: string[] = []
    
    Object.values(locales).forEach((locale) => {
      Object.keys(locale).forEach((lang) => {
        if (langs.indexOf(lang) === -1) langs.push(lang);
      })
    })

    return langs
  }, [locales])

  const translatePhraseKey = useCallback(( phraseKey: string ): string | undefined => {
    if ( typeof locales === "object" ) {
      if ( locales[phraseKey] !== undefined ) {
        if (locales[phraseKey][lang] !== undefined) {
          return locales[phraseKey][lang];
        } else {
          return undefined
        }
      } else {
        return undefined
      }
    } else return undefined
  }, [ locales, lang ]);

  const translated = useMemo((): Record<string, string> => {
    const newObj: Record<string, string> = {}
    Object.keys(locales).forEach( lk => {
      const result = translatePhraseKey(lk)
      if (typeof result === "string") {
        newObj[lk] = result;
      }
    })
    return newObj
  }, [ locales, translatePhraseKey ])


  return (
    <ReactTranslatorContext.Provider value={{ lang, setLang, translated, translatePhraseKey, availableLangs }}>{children}</ReactTranslatorContext.Provider>
  );
}

export default ReactTranslatorContext
