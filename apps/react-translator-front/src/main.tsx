import { ReactTranslatorContextProvider } from '@oneforx/react-translator';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import App from './app/app';
import locales from './locales.json'

ReactDOM.render(
  <StrictMode>
    <ReactTranslatorContextProvider locales={locales}>
      <App />
    </ReactTranslatorContextProvider>
  </StrictMode>,
  document.getElementById('root')
);
