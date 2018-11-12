import {
  apiBillRun,
  apiBillRunErrorHandler,
  apiBillRunSuccessHandler,
} from '../common/Api';
import {
  saveEntity,
  getEntityById,
  gotEntity,
  setCloneEntity,
  actions,
} from './entityActions';
import {
  getEntityByIdQuery,
  getRebalanceAccountQuery,
  getCollectionDebtQuery,
  getPlaysQuery,
} from '../common/ApiQueries';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';


export const getCustomer = id => getEntityById('customer', 'accounts', id);

export const getSubscription = id => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = getEntityByIdQuery('subscribers', id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      item.originalValue = item.from;
      dispatch(gotEntity('subscription', item));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving subscriber')));
};

export const saveCustomer = (customer, action) => saveEntity('accounts', customer, action);

export const setCloneSubscription = () => setCloneEntity('subscription', 'subscription');

export const saveSubscription = (subscription, action) => dispatch =>
  dispatch(saveEntity('subscribers', subscription, action))
    .then(response => Object.assign(response, { subscription, action }));


export const updateCustomerField = (path, value) => ({
  type: actions.UPDATE_ENTITY_FIELD,
  collection: 'customer',
  path,
  value,
});

export const clearCustomer = () => ({
  type: actions.CLEAR_ENTITY,
  collection: 'customer',
});

export const rebalanceAccount = (aid, billrunKeys) => (dispatch) => {
  dispatch(startProgressIndicator());
  const queries = [];
  for (const billrunKey of billrunKeys.split(',')) {
    queries.push(getRebalanceAccountQuery(aid, billrunKey));
  }

  return apiBillRun(queries)
    .then(success => dispatch(apiBillRunSuccessHandler(success, 'Customer rebalance request sent')))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error rebalancing customer')));
};

export const getCollectionDebt = aid => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = getCollectionDebtQuery(aid);
  return apiBillRun(query)
    .then(response => dispatch(apiBillRunSuccessHandler(response)))
    .catch(error => dispatch(apiBillRunErrorHandler(error)));
};

export const getPlaysInUse = () => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = getPlaysQuery();
  return apiBillRun(query)
    .then((response) => {
      const playsInUse = [];
      response.data[0].data.details.forEach((sub) => {
        if (typeof sub.play !== 'undefined' && !playsInUse.includes(sub.play)) {
          playsInUse.push(sub.play);
        }
      });
      dispatch(finishProgressIndicator());
      return ({ status: 1, data: playsInUse });
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving plays in use')));
};
