import {createStore, applyMiddleware, compose} from 'redux';
//import {routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import createHistory from 'history/createBrowserHistory';
//import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import rootReducer from './reducers';

export const history = createHistory();


console.log(history);

const initialState = {}
const enhancers = []
const middleware = applyMiddleware(thunk, logger, promise())

// if (process.env.NODE_ENV === 'development') {
//   const devToolsExtension = window.devToolsExtension

//   if (typeof devToolsExtension === 'function') {
//     enhancers.push(devToolsExtension())
//   }
// }

// const composedEnhancers = compose(
//   applyMiddleware(...middleware),
//   ...enhancers
// )


const store = createStore(
  rootReducer,
  initialState,
  middleware
)
//console.log(store.getState())

export default store