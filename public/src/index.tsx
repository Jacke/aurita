import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { AppRouter } from './router';

ReactDOM.render(
  <AppRouter />
  , document.getElementById('aurita-app') as HTMLElement);
registerServiceWorker();
