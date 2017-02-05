import Immutable from 'immutable';
import { actions } from '../../actions/entityListActions';

const defaultState = Immutable.Map();

const sortReducer = (state = defaultState, action) => {
  switch (action.type) {

    case actions.CLEAR_LIST: {
      if (action.collection && action.collection.length > 0) {
        return state.delete(action.collection);
      }
      return state;
    }

    case actions.SET_SORT: {
      if (action.collection && action.collection.length > 0) {
        return state.set(action.collection, Immutable.fromJS(action.sort));
      }
      return state;
    }

    default:
      return state;
  }
};

export default sortReducer;
