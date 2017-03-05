import { startProgressIndicator } from './progressIndicatorActions';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { fetchPrepaidIncludeByIdQuery } from '../common/ApiQueries';
import { saveEntity, gotEntity, clearEntity, updateEntityField } from './entityActions';


export const clearPrepaidInclude = () => clearEntity('prepaid_include');

export const savePrepaidInclude = (prepaidInclude, action) => saveEntity('prepaidincludes', prepaidInclude, action);

export const updatePrepaidInclude = (path, value) => updateEntityField('prepaid_include', path, value);

export const getPrepaidInclude = id => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = fetchPrepaidIncludeByIdQuery(id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      item.originalValue = item.from;
      dispatch(gotEntity('prepaid_include', item));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving prepaid bucket')));
};
