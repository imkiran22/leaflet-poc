export default function reducer(state={}, action) {

    switch (action.type) {
      case "FETCH_REMINDERS": {
        return action.payload;
      }
      case 'ADD_REMINDERS': {
      	return action.payload;
      }
    }

    return state
}