import { ILocales, ReactTranslatorContextProvider } from '@oneforx/react-translator';
import AppContextProvider from './contexts/AppContext';
import EditorContextProvider from './contexts/EditorContext';
import IndexRouter from './routers/IndexRouter';

import locales from './app.locales.json'
const AppLocales: ILocales = locales as ILocales;

export function app() {
  return (
    <ReactTranslatorContextProvider locales={AppLocales}>
      <AppContextProvider>
        <EditorContextProvider>
          <IndexRouter />
        </EditorContextProvider>
      </AppContextProvider>
    </ReactTranslatorContextProvider>
  );
}

export default app;
