import { createSelector } from 'reselect';
import { List, Map } from 'immutable'; // eslint-disable-line no-unused-vars
import {
  accountFieldsSelector,
  subscriberFieldsSelector,
  productFieldsSelector,
  seriveceFieldsSelector,
  planFieldsSelector,
  linesFieldsSelector,
} from './settingsSelector';
import { titleCase } from 'change-case';
import {
  getConfig,
  getFieldName,
  onlyLineForeignFields,
  getFieldEntityKey,
  parseConfigSelectOptions,
} from '../common/Util';

const getCustomFieldsConfig = () => getConfig('customFields', Map());

export const foreignLinesFieldsSelector = createSelector(
  linesFieldsSelector,
  (lineFields = List()) => lineFields.filter(onlyLineForeignFields),
);

export const customFieldsEntityFieldsSelector = createSelector(
  (state, props, entity) => entity,
  accountFieldsSelector,
  subscriberFieldsSelector,
  productFieldsSelector,
  seriveceFieldsSelector,
  planFieldsSelector,
  foreignLinesFieldsSelector,
  (entity, accountFields, subscriberFields, productFields, serviceFields, planFields, usageField) => {
    const fields = Map({
      customer: accountFields,
      account_subscribers: subscriberFields,
      subscription: subscriberFields,
      product: productFields,
      service: serviceFields,
      plan: planFields,
      usage: usageField,
    });
    if (typeof entity === 'undefined' || entity === 'all') {
      return fields;
    }
    return fields.get(entity);
  },
);

export const isFieldPrintable = createSelector(
  field => field.get('field_name', ''),
  field => field.get('generated', false),
  (field, fieldsSettings) => fieldsSettings.get('hiddenFields', List()),
  (fieldName, isGenerated, hiddenFields) => (!isGenerated && !hiddenFields.includes(fieldName)),
);

export const isFieldSortable = createSelector(
  field => field.get('field_name', ''),
  (field, fieldsSettings) => fieldsSettings.get('unReorderFields', List()),
  (fieldName, unReorderFields) => (!unReorderFields.includes(fieldName)),
);

export const isFieldEditable = createSelector(
  field => field.get('field_name', ''),
  field => field.get('system', false),
  (field, fieldsSettings) => fieldsSettings.get('disabledFields', List()),
  (fieldName, isSystem, disabledFields) => (!isSystem && !disabledFields.includes(fieldName)),
);

export const foreignEntityNameSelector = createSelector(
  foreignEntity => foreignEntity,
  foreignEntity => titleCase(getConfig(
    ['systemItems', getFieldEntityKey(foreignEntity), 'itemName'],
    getFieldName(foreignEntity, 'foreign'),
  )),
);

export const foreignEntityFieldNameSelector = createSelector(
  field => field.getIn(['foreign', 'field'], ''),
  (field, entitiesFieldsConfig) => entitiesFieldsConfig.get(getFieldEntityKey(field.getIn(['foreign', 'entity'], '')), List()),
  (foreignField, entityFields) => entityFields.reduce((acc, f) =>
    (f.get('field_name', '') === foreignField ? f.get('title', foreignField) : acc),
    foreignField,
  ),
);

export const foreignFieldsConfigSelector = createSelector(
  getCustomFieldsConfig,
  (config = Map()) => config.get('foreignFields', Map()),
);

export const foreignFieldsConditionsOperatorsSelector = createSelector(
  foreignFieldsConfigSelector,
  (config = Map()) => config.get('conditions', List()),
);

export const customFieldsConditionsOperatorsSelectOptionsSelector = createSelector(
  foreignFieldsConditionsOperatorsSelector,
  (operators = Map()) => operators
    .map(parseConfigSelectOptions)
    .toArray(),
);
