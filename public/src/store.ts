import { Store, createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { state, State } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import mySaga from './sagas';


const sagaMiddleware = createSagaMiddleware()

export const store: Store<State> = createStore(
  state,
  composeWithDevTools(
    applyMiddleware(reduxThunk, logger, sagaMiddleware)),
);

sagaMiddleware.run(mySaga)
