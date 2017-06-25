import moment from 'moment';
import Immutable from 'immutable';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { getEntityByIdQuery, apiEntityQuery } from '../common/ApiQueries';
import { getItemDateValue, getConfig } from '../common/Util';
import { startProgressIndicator } from './progressIndicatorActions';


const apiTimeOutMessage = 'Oops! Something went wrong. Please try again in a few moments.';

export const actions = {
  GOT_ENTITY: 'GOT_ENTITY',
  UPDATE_ENTITY_FIELD: 'UPDATE_ENTITY_FIELD',
  DELETE_ENTITY_FIELD: 'DELETE_ENTITY_FIELD',
  CLEAR_ENTITY: 'CLEAR_ENTITY',
  CLONE_RESET_ENTITY: 'CLONE_RESET_ENTITY',
};

export const updateEntityField = (collection, path, value) => ({
  type: actions.UPDATE_ENTITY_FIELD,
  collection,
  path,
  value,
});

export const deleteEntityField = (collection, path) => ({
  type: actions.DELETE_ENTITY_FIELD,
  collection,
  path,
});

export const gotEntity = (collection, entity) => ({
  type: actions.GOT_ENTITY,
  collection,
  entity,
});

export const setCloneEntity = (collection, entityName) => ({
  type: actions.CLONE_RESET_ENTITY,
  collection,
  uniquefields: getConfig(['systemItems', entityName, 'uniqueField'], []),
});

export const clearEntity = collection => ({
  type: actions.CLEAR_ENTITY,
  collection,
});

const buildRequestData = (item, action) => {
  const apiDateFormat = getConfig('apiDateFormat', 'YYYY-MM-DD');
  switch (action) {

    case 'move': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      const update = (item.has('from'))
        ? { from: getItemDateValue(item, 'from').format(apiDateFormat) }
        : { to: getItemDateValue(item, 'to').format(apiDateFormat) };
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'close': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      const update = { to: getItemDateValue(item, 'to').format(apiDateFormat) };
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'delete': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      return formData;
    }

    case 'create': {
      const formData = new FormData();
      const newFrom = getItemDateValue(item, 'from').format(apiDateFormat);
      const update = item.withMutations((itemwithMutations) => {
        itemwithMutations
          .set('from', newFrom)
          .delete('originalValue');
      });
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'import': {
      const formData = new FormData();
      formData.append('update', JSON.stringify(item));
      return formData;
    }

    case 'update': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      const update = item.withMutations((itemwithMutations) => {
        itemwithMutations
          .delete('_id')
          .delete('originalValue');
      });
      formData.append('query', JSON.stringify(query));
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'closeandnew': {
      const formData = new FormData();
      const update = item.withMutations((itemwithMutations) => {
        const originalFrom = getItemDateValue(item, 'originalValue', null);
        if (originalFrom !== null) {
          if (originalFrom.isSame(getItemDateValue(item, 'from', moment(0)), 'days')) {
            itemwithMutations.delete('from');
          }
        }
        itemwithMutations
          .delete('_id')
          .delete('originalValue');
      });
      formData.append('update', JSON.stringify(update));
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      return formData;
    }

    default:
      return new FormData();
  }
};

const requestActionBuilder = (collection, item, action) => {
  if (action === 'closeandnew' && getItemDateValue(item, 'from').isSame(getItemDateValue(item, 'originalValue', moment(0)), 'day')) {
    return 'update';
  }
  if (action === 'clone') {
    return 'create';
  }
  return action;
};

const requestDataBuilder = (collection, item, action) => {
  switch (collection) {
    default:
      return buildRequestData(item, action);
  }
};

export const saveEntity = (collection, item, action) => (dispatch) => {
  dispatch(startProgressIndicator());
  const apiAction = requestActionBuilder(collection, item, action);
  const body = requestDataBuilder(collection, item, apiAction);
  const query = apiEntityQuery(collection, apiAction, body);
  return apiBillRun(query, { timeOutMessage: apiTimeOutMessage })
    .then(success => dispatch(apiBillRunSuccessHandler(success)))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error saving Entity')));
};

export const importEntities = (collection, items) => (dispatch) => {
  dispatch(startProgressIndicator());
  const body = requestDataBuilder(collection, items, 'import');
  const query = apiEntityQuery(collection, 'import', body);
  return apiBillRun(query, { timeOutMessage: apiTimeOutMessage })
    .then(success => dispatch(apiBillRunSuccessHandler(success)))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error saving Entities')));
};

const fetchEntity = (collection, query) => (dispatch) => {
  dispatch(startProgressIndicator());
  return apiBillRun(query, { timeOutMessage: apiTimeOutMessage })
    .then((success) => {
      dispatch(gotEntity(collection, success.data[0].data.details[0]));
      return dispatch(apiBillRunSuccessHandler(success));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving Entity')));
};

export const getEntity = (collection, query) => dispatch =>
  dispatch(fetchEntity(collection, query));

export const getEntityById = (name, collection, id) => (dispatch) => {
  const query = getEntityByIdQuery(collection, id);
  return dispatch(fetchEntity(name, query));
};

export const deleteEntity = (collection, item) => dispatch =>
  dispatch(saveEntity(collection, item, 'delete'));

export const closeEntity = (collection, item) => dispatch =>
  dispatch(saveEntity(collection, item, 'close'));

export const moveEntity = (collection, item, type) => (dispatch) => {
  const hackedItem = Immutable.Map().withMutations((itemWithMutations) => {
    itemWithMutations.set('_id', item.get('_id'));
    if (type === 'to') {
      itemWithMutations.set('to', item.get('to'));
    } else {
      itemWithMutations.set('from', item.get('from'));
    }
  });
  return dispatch(saveEntity(collection, hackedItem, 'move'));
};
