import * as React from 'react';
import { Route } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { HashRouter } from 'react-router-dom'



export const AppRouter: React.StatelessComponent<{}> = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Route path="/" component={App} >
        </Route>
      </HashRouter>
    </Provider>
  );
}