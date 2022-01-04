import { useRequest } from '@oneforx/poseidon';
import { ReactTranslatorContext } from '@oneforx/react-translator';
import useGetLangs from 'libs/react-translator/src/lib/hooks/use-get-langs';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';

import EditorController from '../controllers/EditorController';
import MainController from '../controllers/MainController';
import AuthSignupScreen from '../screens/auth/AuthSignupScreen';
import CreateTraductionScreen from '../screens/CreateTraductionScreen';
import EditorIdScreen from '../screens/editor/EditorIdScreen';
import EditorMainScreen from '../screens/editor/EditorMainScreen';
import MainScreen from '../screens/main/MainScreen';

const IndexRouter = () => {
  const langs = useGetLangs()
  const [ response ] = useRequest( "https://flagcdn.com/en/codes.json", { mode: "cors", method: "GET" }, true );
  const [ searchLang, setSearchLang ] = useState("")
  const { setLang } = useContext(ReactTranslatorContext)


  const langOptions = useMemo(() => response.data ? Object.keys(response.data)
  .filter((v) => {
    return (searchLang.length > 0 ? v.includes(searchLang) || response.data[v].toLocaleLowerCase().includes(searchLang.toLocaleLowerCase()) : true)
    && langs.indexOf(v) !== -1
  })
  .map(
    (ctk: string, idx: number) => {
      return (
        <option value={ctk} key={idx}>{response.data[ctk]}</option>
      );
    }) : null,
    [response.data, searchLang]
  );
  
  const onSelectLanguageChange = useCallback((e) => {
    if (typeof e === "object") {
      if (typeof e.target === "object") {
        if (typeof e.target.value === "string") {
          console.log(e.target.value)
          setLang(e.target.value)
        }
      }
    }
  }, [ setLang ])

  return (
    <>
      <HashRouter>
        <Routes>
          
          <Route path="/" element={ <MainController /> }>
            <Route path="" element={ <MainScreen /> } />
            <Route path="settings" element={ <div>Settings</div> } />
            <Route path="auth/signin" element={ <div>Settings</div> } />
            <Route path="auth/signup" element={ <AuthSignupScreen /> } />
          </Route>

          <Route path="/editor" element={ <EditorController /> }>
            <Route path="" element={ <EditorMainScreen /> } />
            <Route path="last" element={ <CreateTraductionScreen /> } />
            <Route path=":id" element={ <EditorIdScreen /> } />
          </Route>
          
        </Routes>
      </HashRouter>
      
      <div className="px-10 py-4 border-t">
          <label htmlFor="inputLanguage" >Select language : </label><br/>
          <input name="inputLanguage" type="text" placeholder="language name" className="rounded px-2" value={searchLang} onChange={(e) => setSearchLang(e.target.value)}></input><br/>
          <select onChange={onSelectLanguageChange}>
            <option>Choose a language</option>
            {langOptions}
          </select>
      </div>
    </>
  );
}

export default IndexRouter
