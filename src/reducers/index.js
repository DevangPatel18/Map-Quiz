import { combineReducers } from 'redux';
import { reducer as tooltip } from 'redux-tooltip';
import mapReducer from './mapReducers';
import dataReducer from './dataReducers';
import quizReducer from './quizReducers';

export default combineReducers({
  map: mapReducer,
  data: dataReducer,
  quiz: quizReducer,
  tooltip,
});
