import Immutable from 'immutable';
import { actions } from '../actions/entityActions';

const defaultState = Immutable.Map();

export default function (state = defaultState, action) {
  const { collection, path, value, type, entity } = action;
  switch (type) {

    case actions.GOT_ENTITY: {
      if (collection !== 'reports') {
        entity.originalValue = entity.from;
      }
      return state.set(collection, Immutable.fromJS(entity));
    }

    case actions.UPDATE_ENTITY_FIELD:
      if (Array.isArray(path)) {
        return state.setIn([collection, ...path], value);
      }
      return state.setIn([collection, path], value);

    case actions.DELETE_ENTITY_FIELD:
      if (Array.isArray(path)) {
        return state.deleteIn([collection, ...path]);
      }
      return state.deleteIn([collection, path]);

    case actions.CLONE_RESET_ENTITY: {
      const keysToDeleteOnClone = ['_id', 'from', 'to', 'originalValue', 'creation_time'];
      if (typeof action.uniquefields === 'string') {
        keysToDeleteOnClone.push(action.uniquefields);
      } else if (Array.isArray(action.uniquefields)) {
        keysToDeleteOnClone.push(...action.uniquefields);
      }
      return state.withMutations((itemWithMutations) => {
        keysToDeleteOnClone.forEach((keyToDelete) => {
          itemWithMutations.deleteIn([collection, keyToDelete]);
        });
      });
    }

    case actions.CLEAR_ENTITY:
      if (collection) {
        return state.set(collection, Immutable.Map());
      }
      return defaultState;

    default:
      return state;
  }
}
