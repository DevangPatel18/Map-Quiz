import { combineReducers } from 'redux';
import mapReducer from './mapReducers';

export default combineReducers({
  map: mapReducer,
});
