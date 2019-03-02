import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
const middleware = [thunk];

const windowGlobal = typeof window !== 'undefined' && window;

const devtools = windowGlobal.devToolsExtension
  ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  : f => f;

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middleware),
    devtools
  )
);
export default store;
