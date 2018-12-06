import { createSelector } from 'reselect';
// import { titleCase, sentenceCase, upperCaseFirst } from 'change-case';
import Immutable from 'immutable';
import {
  getConfig,
  parseConfigSelectOptions,
  sortFieldOption,
  setFieldTitle,
  onlyLineForeignFields,
  foreignFieldWithoutDates,
} from '../common/Util';
import {
  linesFieldsSelector,
  inputProssesorUsageTypesOptionsSelector,
} from './settingsSelector';
import {
  getPropsItem,
} from './entitySelector';


/* Helpers */

const formatEventConditionsFilter = (evetntConfigFields = Immutable.List(), billrunFields = Immutable.List()) =>
  Immutable.List().withMutations((optionsWithMutations) => {
    // Set fields from billrun settings
    billrunFields.forEach((billrunField) => {
      billrunField.withMutations((billrunFieldWithMutations) => {
        billrunFieldWithMutations.set('title', setFieldTitle(billrunField).get('title', ''));
        billrunFieldWithMutations.set('type', 'string');
        billrunFieldWithMutations.set('id', billrunField.get('field_name'));
        optionsWithMutations.push(billrunFieldWithMutations);
      });
    });
    // set fields from event config
    evetntConfigFields.forEach((evetntConfigField) => {
      optionsWithMutations.push(setFieldTitle(evetntConfigField, null, 'id'));
    });
  });

/* Getters */
const getEventConfig = () => getConfig('events', Immutable.Map());

export const eventConditionsOperatorsSelector = createSelector(
  getEventConfig,
  (state, props) => props.eventType,
  (config = Immutable.Map(), eventType) => config.getIn(['operators', eventType, 'conditions'], Immutable.List()),
);
export const eventConditionsOperatorsSelectOptionsSelector = createSelector(
  eventConditionsOperatorsSelector,
  (operators = Immutable.Map()) => operators
    .map(parseConfigSelectOptions)
    .toArray(),
);

export const eventConditionsConfigFieldsSelector = createSelector(
  getEventConfig,
  (config = Immutable.Map()) => config.get('conditionsFields', Immutable.List()),
);
export const foreignLinesFieldsSelector = createSelector(
  linesFieldsSelector,
  (lineFields = Immutable.List()) => lineFields
    .filter(onlyLineForeignFields)
    .filter(foreignFieldWithoutDates),
);
export const eventConditionsFilterOptionsSelector = createSelector(
  eventConditionsConfigFieldsSelector,
  foreignLinesFieldsSelector,
  formatEventConditionsFilter,
);
export const eventConditionsFieldsSelectOptionsSelector = createSelector(
  eventConditionsFilterOptionsSelector,
  (state, props) => props.condition.get('field'),
  (state, props) => props.usedFields,
  (conditionsFilter = Immutable.List(), conditionIndexField, usedFields) => conditionsFilter
    .filter(fieldOption => (fieldOption.get('id', '') === conditionIndexField
      ? true // parsing current selected option for index
      : !usedFields.includes(fieldOption.get('id', ''))
    ))
    .sort(sortFieldOption)
    .map(parseConfigSelectOptions)
    .toArray(),
);

export const eventThresholdOperatorsSelector = createSelector(
  getEventConfig,
  (state, props) => props.eventType,
  (config = Immutable.Map(), eventType) => config.getIn(['operators', eventType, 'threshold'], Immutable.List()),
);
export const eventThresholdOperatorsSelectOptionsSelector = createSelector(
  eventThresholdOperatorsSelector,
  (operators = Immutable.Map()) => operators
      .map(parseConfigSelectOptions)
      .toArray(),
);

export const eventTresholdFieldsSelector = createSelector(
  getEventConfig,
  (config = Immutable.Map()) => config.get('thresholdFields', Immutable.List())
    .map(field => setFieldTitle(field, null, 'id')),
);

export const effectOnEventUsagetFieldsSelector = createSelector(
  eventConditionsFilterOptionsSelector,
  (fields = Immutable.Map()) => fields
    .filter(field => field.get('effectOnUsaget', false))
    .map(field => field.get('id', '')),
);

export const getItemEventUsageType = createSelector(
  getPropsItem,
  (item = Immutable.Map()) => item.getIn(['ui_flags', 'eventUsageType'], Immutable.Map()),
);

export const eventUsagetFieldUsateTypesSelector = createSelector(
  getItemEventUsageType,
  (eventUsageType = Immutable.Map()) => eventUsageType.get('usaget', Immutable.List()),
);

export const eventTypeFieldUsateTypesSelector = createSelector(
  getItemEventUsageType,
  inputProssesorUsageTypesOptionsSelector,
  (types = Immutable.List(), inputProssesorUsageTypes = Immutable.List()) => Immutable.Set()
    .withMutations((allTypeWithMutations) => {
      inputProssesorUsageTypes
        .filter((ip, name) => types.includes(name))
        .forEach((ipTypes) => { allTypeWithMutations.union(ipTypes); });
    }),
);

export const eventUsateTypesSelector = createSelector(
  eventTypeFieldUsateTypesSelector,
  eventUsagetFieldUsateTypesSelector,
  () => Immutable.List(),
  (type = Immutable.List(), usaget = Immutable.List(), arate_key = Immutable.List()) =>
    Immutable.Set().withMutations((allTypeWithMutations) => {
      allTypeWithMutations.union(type); // field type
      allTypeWithMutations.union(usaget); // field usaget
    }),
);

export const eventThresholdFieldsSelectOptionsSelector = createSelector(
  eventTresholdFieldsSelector,
  eventUsateTypesSelector,
  (fields = Immutable.Map(), usateTypes = Immutable.set()) => fields
    .filter((field) => {
      const fieldUsageList = field.get('allowedWithUsage', Immutable.List());
      if (fieldUsageList.isEmpty()) { // ["multiple", "empty", "single"]
        return true;
      }
      if (usateTypes.isEmpty()) {
        return fieldUsageList.includes('empty');
      }
      if (usateTypes.size === 1) {
        return fieldUsageList.includes('single');
      }
      return fieldUsageList.includes('multiple');
    })
    .sort(sortFieldOption)
    .map(parseConfigSelectOptions)
    .toArray(),
);
