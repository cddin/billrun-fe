export const UPDATE_FIELD_VALUE = 'UPDATE_FIELD_VALUE';
export const GOT_ITEM = 'GOT_COLLECTION_ITEMS';
export const GOT_ITEMS = 'GOT_ITEMS';
export const SAVE_FORM = 'SAVE_FORM';
export const SET_INITIAL_ITEM = 'SET_INITIAL_ITEM';
export const NEW_FIELD = 'NEW_FIELD';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const CHECK_LOGIN = 'checkLogin';
export const OPEN_LOGIN_FORM = 'openLoginPopup';
export const CLOSE_LOGIN_FORM = 'closeLoginPopup';
export const SAVE_ITEM_ERROR = 'SAVE_ITEM_ERROR';
export const SHOW_PROGRESS_BAR = 'SHOW_PROGRESS_BAR';
export const HIDE_PROGRESS_BAR = 'HIDE_PROGRESS_BAR';
export const SHOW_STATUS_MESSAGE = 'SHOW_STATUS_MESSAGE';
export const HIDE_STATUS_MESSAGE = 'HIDE_STATUS_MESSAGE';
export const UPDATE_PLAN_FIELD_VALUE = 'UPDATE_PLAN_FIELD_VALUE';
export const UPDATE_PRODUCT_PROPERTIES_VALUE = 'UPDATE_PRODUCT_PROPERTIES_VALUE';
export const ADD_PRODUCT_PROPERTIES = 'ADD_PRODUCT_PROPERTIES';
export const REMOVE_PRODUCT_PROPERTIES = 'REMOVE_PRODUCT_PROPERTIES';
export const GET_PLAN = 'GET_PLAN';
export const CLEAR_PLAN = 'CLEAR_PLAN';
export const GET_PRODUCT = 'GET_PRODUCT';
export const SAVE_PLAN = 'SAVE_PLAN';
export const GOT_CUSTOMER = 'GOT_CUSTOMER';
export const UPDATE_SUBSCRIBER_FIELD = 'UPDATE_SUBSCRIBER_FIELD';

import axios from 'axios';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function setInitialItem(page_name) {
  return {
    type: SET_INITIAL_ITEM,
    page_name
  };
}

export function updateFieldValue(path, field_value, page_name) {
  return {
    type: UPDATE_FIELD_VALUE,
    path,
    field_value,
    page_name
  };
}

export function saveConfig(options) {
  let saveUrl = '/admin/configsave';
  let form = new FormData();
  form.append("data", JSON.stringify(options));
  return dispatch => {
    let request = axiosInstance.post(saveUrl, form).then(
      response => {
        /* if(response.data){
           dispatch(fetchItem(id, collection, page_name));
           } */
      }
    );
  }
}

export function newField(path, field_type, page_name) {
  return {
    type: NEW_FIELD,
    path,
    field_type,
    page_name
  };
}

export function removeField(path, page_name) {
  return {
    type: REMOVE_FIELD,
    path,
    page_name
  };
}

function gotItem(item, collection, page_name) {
  return {
    type: GOT_ITEM,
    item,
    page_name,
    collection
  };
}

function gotItems(items, collection, page_name) {
  return {
    type: GOT_ITEMS,
    items,
    page_name,
    collection
  };
}

function fetchItem(item_id, collection, page_name) {
  let itemFetchUrl = `/api/find?collection=${collection}&query={"_id":{"$in" : ["${item_id}"]}}`;
  return dispatch => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(itemFetchUrl).then(
      response => {
        let item = _.values(response.data.details).shift();
        dispatch(gotItem(item, collection, page_name));
        dispatch(hideProgressBar());
      }
    ).catch(
      error => {
          console.log(error);
          dispatch(showStatusMessage(error.message || 'Error, please try again', 'error'));
          dispatch(hideProgressBar());
      }
    );
  }
}

function combineItem(items){
  let combineItem = [..._.values(items)];
  return combineItem;
}

function fetchItems(item_ids, collection, page_name) {
  item_ids = item_ids.replace(new RegExp(',', 'g'), '","');
  let itemFetchUrl = `/api/find?collection=${collection}&query={"_id":{"$in" : ["${item_ids}"]}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(itemFetchUrl).then(
      response => {
        let combinedItem = combineItem(response.data.details);
        dispatch(gotItems(combinedItem, collection, page_name));
        dispatch(hideProgressBar());
      }
    ).catch(
      error => {
          console.log(error);
          dispatch(showStatusMessage(error.message || 'Error, please try again', 'error'));
          dispatch(hideProgressBar());
      }
    );
  }
}

export function getCollectionEntity(entity_id, collection, page_name) {
  return dispatch => {
    return dispatch(fetchItem(entity_id, collection, page_name));
  };
}

export function getCollectionEntites(entity_ids, collection, page_name) {
  return dispatch => {
    return dispatch(fetchItems(entity_ids, collection, page_name));
  };
}

function gotCustomer(customer) {
  return {
    type: GOT_CUSTOMER,
    customer
  }
}

function fetchCustomer(customer_id) {
  /** TODO: REMOVE **/
  let customer = {
    first_name: "Lewis",
    last_name: "Nitzberg",
    aid: 123123,
    subs: [
      {
        sid: 321321,
        plan: "Fish o' the month"
      }
    ]
  };

  let convert = (customer) => {
    return {
      FirstName: customer.first_name,
      LastName: customer.last_name,
    }
  };
  
  let fetchUrl = `/api/find?collection=customers&query={"_id": {"$in": ["${customer_id}"]}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      response => {
        dispatch(gotCustomer(convert(customer)));
        dispatch(hideProgressBar());
        //dispatch(gotSubscriber(response.data.details));
      }
    ).catch(error => {
      /** TODO: Remove and error handle **/
      dispatch(gotCustomer(convert(customer)));
      dispatch(hideProgressBar());
    });
  };
}

export function getCustomer(customer_id) {
  return dispatch => {
    return dispatch(fetchCustomer(customer_id));
  };
}

export function updateCustomerField(field_id, value) {
  return {
    type: UPDATE_SUBSCRIBER_FIELD,
    field_id,
    value
  };
}

export function saveCollectionEntity(item, collection, page_name, action) {
  let saveUrl = '/admin/save';
  let entity = Object.assign({}, item);

  let id = (!_.isEmpty(entity._id) ? entity._id['$id'] : null);

  if(action === 'bulk_update'){
    id = entity['ids'];
    delete entity['ids'];
  } else {
    delete entity['_id'];
    delete entity['from'];
    delete entity['name'];
  }

  var formData = new FormData();
  if (id) formData.append("id", id);
  formData.append("coll", collection);
  formData.append("type", action);
  formData.append("data", JSON.stringify(entity));

  return dispatch => {
    let request = axiosInstance.post(saveUrl, formData).then(
      response => {
        if(response.data){
          dispatch(fetchItem(id, collection, page_name));
        } else {
          dispatch(showStatusMessage('Error, please try again', 'error'));
        }
      }
    );
  }
}

export function openLoginPopup(){
  return { type: OPEN_LOGIN_FORM }
}

export function closeLoginPopup(){
  return { type: CLOSE_LOGIN_FORM }
}

export function showProgressBar(){
  return { type: SHOW_PROGRESS_BAR }
}

export function hideProgressBar(){
  return { type: HIDE_PROGRESS_BAR }
}

export function showStatusMessage(message, messageType){
  return { type: SHOW_STATUS_MESSAGE, message, messageType }
}

export function hideStatusMessage(){
  return { type: HIDE_STATUS_MESSAGE}
}

export function userCheckLogin(){
  let checkLoginUrl = '/api/auth';
  let request = axiosInstance.get(checkLoginUrl);
  return {
    type: CHECK_LOGIN,
    data: request
  }
}

export function userDoLogin({username, password}){
  let loginUrl = `/api/auth?username=${username}&password=${password}`;
  let request = axiosInstance.get(loginUrl);
  return {
    type: LOGIN,
    data: request
  }
}

export function userDoLogout(){
  let logoutUrl = '/api/auth?action=logout';
  return dispatch => {
    let request = axiosInstance.get(logoutUrl).then(
      response => {
        dispatch({type: LOGOUT});
      }
    );
  }
}

export function updatePlanField(section, field_name, field_value) {
  return {
    type: UPDATE_PLAN_FIELD_VALUE,
    section,
    field_name,
    field_value
  };
}

export function updateProductPropertiesField(field_name, field_idx, field_value) {
  return {
    type: UPDATE_PRODUCT_PROPERTIES_VALUE,
    field_name,
    field_idx,
    field_value
  }
}

export function addProductProperties() {
  return {
    type: ADD_PRODUCT_PROPERTIES    
  }
}

export function removeProductProperties(idx) {
  return {
    type: REMOVE_PRODUCT_PROPERTIES,
    idx
  }
}

export function getPlan(plan_id) {
  return {
    type: GET_PLAN,
    plan_id
  }
}

export function clearPlan() {
  return {
    type: CLEAR_PLAN
  };
}

export function getProduct(product_id) {
  return {
    type: GET_PRODUCT,
    product_id
  };
}

export function savePlan() {
  return {
    type: SAVE_PLAN
  };
}
