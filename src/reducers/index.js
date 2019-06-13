import { combineReducers } from 'redux';
import mapReducer from './mapReducers';
import dataReducer from './dataReducers';

export default combineReducers({
  map: mapReducer,
  data: dataReducer,
});
