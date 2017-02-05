import Immutable from 'immutable';
import { actions } from '../../actions/entityListActions';

const defaultState = Immutable.Map();

const filterReducer = (state = defaultState, action) => {
  switch (action.type) {

    case actions.CLEAR_LIST: {
      if (action.collection && action.collection.length > 0) {
        return state.delete(action.collection);
      }
      return state;
    }

    case actions.SET_FILTER: {
      console.log(actions);
      if (action.collection && action.collection.length > 0) {
        return state.set(action.collection, Immutable.fromJS(action.filter));
      }
      return state;
    }

    default:
      return state;
  }
};

export default filterReducer;
