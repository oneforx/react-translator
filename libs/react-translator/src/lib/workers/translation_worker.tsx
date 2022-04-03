
export type ILocales = {
    [key: string]: Record<string, string>
}

export default function () {
  let locales: ILocales | { [key: string]: Record<string, string> },
      lang: string;

    const availableLangs = () => {
        // eslint-disable-next-line prefer-const
        let langs: string[] = []
        
        Object.values(locales).forEach((locale) => {
          Object.keys(locale).forEach((lang) => {
            if (langs.indexOf(lang) === -1) langs.push(lang);
          })
        })
    
        return langs
    };

    const translatePhraseKey = ( phraseKey: string ): string | undefined => {
        if ( typeof locales === "object" ) {
          if ( locales[phraseKey] !== undefined ) {
            if (lang !== undefined) {
              if (locales[phraseKey][lang] !== undefined) {
                return locales[phraseKey][lang];
              } else {
                return undefined
              }
            } else return undefined
          } else {
            return undefined
          }
        } else return undefined
      };

    const translate = () => {
      const newObj: Record<string, string> = {}
    
      Object.keys(locales).forEach( lk => {
        const result = translatePhraseKey(lk)
        if (typeof result === "string") {
          newObj[lk] = result;
        }
      })
      return newObj;
    }
    
    self.onmessage = (message) => {
      if (typeof(message.data) === "object") {
        switch (message.data.title) {
          case "init": {
            locales = message.data.data[0],
            lang = message.data.data[1]
            postMessage({ title: "onTranslated", data: translate() })
            break;
          }
          case "translate": {
            lang = message.data.lang;
            postMessage({ title: "onTranslated", data: translate() })
            break;
          }
          default: break;
        };
      }
    }
}