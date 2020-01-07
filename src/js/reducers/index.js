import { combineReducers } from 'redux';
//import { routerReducer } from 'react-router-redux'
import reminderReducer from './reminderReducer';
import commonReducer from './commonReducer';


// const playAudio = function reducer(state={}, action) {
//     switch (action.type) {
//       case "PLAY_AUDIO": {
//       	 return action.payload;
//       }
//     }
//     return state;
// };

export default combineReducers({
	reminderReducer,
	commonReducer
})