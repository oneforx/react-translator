import AppContextProvider from './contexts/AppContext';
import EditorContextProvider from './contexts/EditorContext';
import IndexRouter from './routers/IndexRouter';

export function app() {
  return (
    <AppContextProvider>
      <EditorContextProvider>
        <IndexRouter />
      </EditorContextProvider>
    </AppContextProvider>
  );
}

export default app;
