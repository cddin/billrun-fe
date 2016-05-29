import aja from 'aja';

export const UPDATE_FIELD_VALUE = 'UPDATE_FIELD_VALUE';
export const GOT_ITEM = 'GOT_COLLECTION_ITEMS';
export const SAVE_FORM = 'SAVE_FORM';
export const SET_INITIAL_ITEM = 'SET_INITIAL_ITEM';
export const NEW_FIELD = 'NEW_FIELD';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const CHECK_LOGIN = 'checkLogin';

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

function updateItem(item, collection, page_name, router){
  return dispatch => {
    let queryString = '/admin/save';
    if(globalSetting.serverApiDebug && globalSetting.serverApiDebug == true){
        queryString += '?' + globalSetting.serverApiDebugQueryString;
    }

    let entity = Object.assign({}, item);
    let id = entity._id['$id'];
    delete entity['_id'];
    delete entity['from'];
    delete entity['name'];
    let data = {
      id : id,
      coll : collection,
      type : 'update',
      data : JSON.stringify(entity)
    }

    aja()
      .url(globalSetting.serverUrl + queryString)
      .method('POST')
      .data(data)
      .on('success', response => {
        router.push(`${page_name}/${collection}/edit/${tmp}`);
      }).go()
  }
}

function fetchItem(item_id, collection, page_name) {
  return dispatch => {
    let queryString = `/api/find?collection=${collection}&query={"_id":{"$in" : ["${item_id}"]}}`;
    if(globalSetting.serverApiDebug && globalSetting.serverApiDebug == true){
        queryString += '&' + globalSetting.serverApiDebugQueryString;
    }
    aja()
      .url(globalSetting.serverUrl + queryString)
      .on('success', response => {
        let item = _.values(response.details).shift();
        dispatch(gotItem(item, collection, page_name));
      })
      .go();
  };
}

export function getCollectionEntity(entity_id, collection, page_name) {
  return dispatch => {
    return dispatch(fetchItem(entity_id, collection, page_name));
  };
}

export function saveCollectionEntity(item, collection, page_name, router) {
  return dispatch => {
    return dispatch(updateItem(item, collection, page_name, router));
  };
}

export function userCheckLogin(){
  let request = axiosInstance.get('/api/auth');
  return {
    type: CHECK_LOGIN,
    data: request
  }
}

export function userDoLogin({username, password}){
  let url = `/api/auth?username=${username}&password=${password}`;
  let request = axiosInstance.get(url);
  return {
    type: LOGIN,
    data: request
  }
}

export function userDoLogout(){
  return dispatch => {
    console.log("userDoLogout action args : ", arguments);
    let request = axiosInstance.get('/api/auth?action=logout').then(
      response => {
        dispatch({type: LOGOUT});
      }
    );
  }
}
