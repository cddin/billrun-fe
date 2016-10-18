export const SET_COLLECTION_NAME = 'SET_COLLECTION_NAME';
export const SET_COLLECTION_DAYS = 'SET_COLLECTION_DAYS';
export const SET_COLLECTION_ACTIVE = 'SET_COLLECTION_ACTIVE';
export const SET_COLLECTION_MAIL_SUBJECT = 'SET_COLLECTION_MAIL_SUBJECT';
export const SET_COLLECTION_MAIL_BODY = 'SET_COLLECTION_MAIL_BODY';

export function setCollectionName(name) {
  return {
    type: SET_COLLECTION_NAME,
    name
  };
}

export function setCollectionDays(days) {
  return {
    type: SET_COLLECTION_DAYS,
    days
  };
}

export function setCollectionActive(active) {
  return {
    type: SET_COLLECTION_ACTIVE,
    active
  };
}

export function setCollectionMailSubject(subject) {
  return {
    type: SET_COLLECTION_MAIL_SUBJECT,
    subject
  };
}

export function setCollectionMailBody(body) {
  return {
    type: SET_COLLECTION_MAIL_BODY,
    body
  };
}

