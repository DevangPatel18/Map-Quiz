import { combineReducers } from 'redux';
export default combineReducers({
  testObj: () => ({ testKey: 'testing message' }),
});
