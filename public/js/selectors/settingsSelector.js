import { createSelector } from 'reselect';
import Immutable from 'immutable';
import moment from 'moment';
import { sentenceCase } from 'change-case';
import { getFieldName, getFieldNameType, getConfig } from '../common/Util';

const getTaxation = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['taxation']);

const getPricing = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['pricing']);

const getUsageType = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('usage_types');

const getBillrun = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('billrun');

const getEntityFields = (state, props) =>
  state.settings.getIn([props.entityName, 'fields']);

const getMinEntityDate = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('minimum_entity_start_date');

const getAccountFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['subscribers', 'account', 'fields']);

const getSubscriberFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['subscribers', 'subscriber', 'fields']);

const selectSubscriberImportFields = (fields, accountfields) => {
  if (fields) {
    const importLinkers = accountfields.filter(field => (
      field.get('unique', false)
      && field.get('mandatory', false)
      && !field.get('generated', false)
      && field.get('editable', true)
    ));
    if (importLinkers.size > 0) {
      return fields.withMutations((fieldsWithMutations) => {
        importLinkers.forEach((importLinker) => {
          fieldsWithMutations.push(Immutable.Map({
            linker: true,
            field_name: importLinker.get('field_name', 'linker'),
            title: importLinker.get('title', importLinker.get('field_name', 'linker')),
          }));
        });
      });
    }
    return fields.push(Immutable.Map({
      linker: true,
      field_name: 'account_import_id',
      title: 'Account Import ID',
    }));
  }
  return fields;
};

const selectAccountImportFields = (fields) => {
  if (fields) {
    const existImportLinker = fields.findIndex(field => (
      field.get('unique', false) === true
      && field.get('generated', false) === false
      && field.get('editable', true) === true
    ));
    return (existImportLinker === -1)
      ? fields.push(Immutable.Map({
        unique: true,
        generated: false,
        mandatory: true,
        field_name: 'account_import_id',
        title: 'Account Import ID (for subscriber import)',
      }))
      : fields;
  }
  return fields;
};

const getUniqueUsageTypesFormInputProssesors = (inputProssesor) => {
  let usageTypes = Immutable.Set();
  const defaultUsaget = inputProssesor.getIn(['processor', 'default_usaget'], '');
  if (defaultUsaget !== '') {
    usageTypes = usageTypes.add(defaultUsaget);
  }
  inputProssesor
    .getIn(['processor', 'usaget_mapping'], Immutable.List())
    .forEach((usagetMapping) => {
      const usaget = usagetMapping.get('usaget', '');
      if (usaget !== '') {
        usageTypes = usageTypes.add(usaget);
      }
    });
  return usageTypes.toList();
};

const getInputProssesors = (state, props) =>  // eslint-disable-line no-unused-vars
  state.settings.get('file_types', Immutable.Map());

const selectCsiOptions = (inputProssesors) => {
  let options = Immutable.List();
  inputProssesors.forEach((inputProssesor) => {
    const usageTypes = getUniqueUsageTypesFormInputProssesors(inputProssesor);
    const customKeys = inputProssesor.getIn(['parser', 'custom_keys'], Immutable.List());
    usageTypes.forEach((usageType) => {
      options = options.push(Immutable.Map({
        fileType: inputProssesor.get('file_type', ''),
        usageType,
        customKeys,
      }));
    });
  });
  return options;
};

const selectCustomKeys = (inputProssesors) => {
  let options = Immutable.Set();
  inputProssesors.forEach((inputProssesor) => {
    const customKeys = inputProssesor.getIn(['parser', 'custom_keys'], Immutable.List());
    options = options.concat(customKeys);
  });
  return options.toList();
};

const sortFieldOption = (optionsA, optionB) => {
  const a = optionsA.get('title', '').toUpperCase(); // ignore upper and lowercase
  const b = optionB.get('title', '').toUpperCase(); // ignore upper and lowercase
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const selectLinesFields = (customKeys) => {
  const predefinedFileds = getConfig(['reports', 'fields', 'lines'], Immutable.List());
  return Immutable.List().withMutations((optionsWithMutations) => {
    // Set predefined fields
    predefinedFileds.forEach((predefinedFiled) => {
      if (predefinedFiled.has('title')) {
        optionsWithMutations.push(predefinedFiled);
      } else {
        const fieldName = getFieldName(predefinedFiled.get('id', ''), 'lines');
        const title = fieldName === predefinedFiled.get('id', '') ? sentenceCase(fieldName) : fieldName;
        optionsWithMutations.push(predefinedFiled.set('title', title));
      }
    });
    // Set custom fields
    customKeys.forEach((customKey) => {
      if (predefinedFileds.findIndex(predefinedFiled => predefinedFiled.get('id', '') === customKey) === -1) {
        const fieldName = getFieldName(customKey, 'lines');
        const title = fieldName === customKey ? sentenceCase(fieldName) : fieldName;
        optionsWithMutations.push(Immutable.Map({
          id: `uf.${customKey}`,
          title: `${title}`,
          filter: true,
          display: true,
        }));
      }
    });
  })
  .sort(sortFieldOption);
};


export const inputProssesorCsiOptionsSelector = createSelector(
  getInputProssesors,
  selectCsiOptions,
);

export const inputProssesorCustomKeysSelector = createSelector(
  getInputProssesors,
  selectCustomKeys,
);

export const linesFiledsSelector = createSelector(
  inputProssesorCustomKeysSelector,
  selectLinesFields,
);


export const taxationSelector = createSelector(
  getTaxation,
  taxation => taxation,
);

export const pricingSelector = createSelector(
  getPricing,
  pricing => pricing,
);

export const billrunSelector = createSelector(
  getBillrun,
  billrun => billrun,
);

export const minEntityDateSelector = createSelector(
  getMinEntityDate,
  minEntityDate => (minEntityDate ? moment.unix(minEntityDate) : minEntityDate),
);

export const currencySelector = createSelector(
  pricingSelector,
  (pricing = Immutable.Map()) => pricing.get('currency'),
);

export const chargingDaySelector = createSelector(
  billrunSelector,
  (billrun = Immutable.Map()) => {
    const chargingDay = billrun.get('charging_day');
    return (isNaN(chargingDay)) ? chargingDay : Number(chargingDay);
  },
);

export const usageTypeSelector = createSelector(
  getUsageType,
  usageTypes => usageTypes,
);

export const entityFieldSelector = createSelector(
  getEntityFields,
  fields => fields,
);

export const accountFieldsSelector = createSelector(
  getAccountFields,
  accountFields => accountFields,
);

export const accountImportFieldsSelector = createSelector(
  accountFieldsSelector,
  selectAccountImportFields,
);

export const subscriberFieldsSelector = createSelector(
  getSubscriberFields,
  subscriberFields => subscriberFields,
);

export const subscriberImportFieldsSelector = createSelector(
  subscriberFieldsSelector,
  accountImportFieldsSelector,
  selectSubscriberImportFields,
);

export const formatFieldOptions = (fields, item = Immutable.Map()) => {
  const type = getFieldNameType(item.get('entity', ''));
  if (fields) {
    return fields.map(field => ({
      value: field.get('field_name', ''),
      label: field.get('title', getFieldName(field.get('field_name', ''), type)),
      editable: field.get('editable', true),
      generated: field.get('generated', false),
      unique: field.get('unique', false),
      mandatory: field.get('mandatory', false),
      linker: field.get('linker', false),
    }));
  }
  return undefined;
};

export const addDefaultFieldOptions = (formatedFields) => {
  if (formatedFields) {
    const defaultFieldsForAllEntities = [{
      value: 'from',
      label: 'From',
      editable: true,
      generated: false,
      unique: false,
      mandatory: true,
    }, {
      value: 'to',
      label: 'To',
      editable: true,
      generated: false,
      unique: false,
      mandatory: true,
    }];
    return formatedFields.withMutations((fieldsWithMutations) => {
      defaultFieldsForAllEntities
        .filter(defaultField =>
          formatedFields.findIndex(field => field.value === defaultField.value) === -1)
        .forEach((defaultField) => {
          fieldsWithMutations.push(defaultField);
        });
    });
  }
  return undefined;
};
