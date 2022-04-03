import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import "@fortawesome/fontawesome-pro/js/duotone"
import "@fortawesome/fontawesome-pro/js/fontawesome"

import App from './app/app';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
