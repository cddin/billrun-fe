import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Col, ControlLabel, InputGroup } from 'react-bootstrap';
import Field from '@/components/Field';
import UsageTypesSelector from '../../UsageTypes/UsageTypesSelector';
import { getGroupsOptions } from '@/actions/reportsActions';
import { groupsOptionsSelector, groupsDataSelector } from '@/selectors/listSelectors';
import { currencySelector } from '@/selectors/settingsSelector';
import {
  eventConditionsOperatorsSelectOptionsSelector,
} from '@/selectors/eventSelectors';
import {
  getBalanceConditionData,
  getPathParams,
  buildBalanceConditionPath,
  getUnitTitle,
 } from '../EventsUtil';
import { getGroupUsaget } from '@/common/Util';

class BalanceEventCondition extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    item: PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number,
    onChangeField: PropTypes.func,
    trigger: PropTypes.string,
    limitation: PropTypes.string,
    activityType: PropTypes.string,
    groupName: PropTypes.string,
    overGroup: PropTypes.string,
    conditionsOperators: PropTypes.array,
    groupsOptions: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    groupsData: PropTypes.instanceOf(Immutable.Map),
    currency: PropTypes.string,
  }

  static defaultProps = {
    item: Immutable.Map(),
    index: -1,
    onChangeField: () => {},
    trigger: '',
    limitation: '',
    activityType: '',
    groupName: '',
    overGroup: 'none',
    conditionsOperators: [],
    groupsOptions: Immutable.List(),
    propertyTypes: Immutable.List(),
    usageTypesData: Immutable.List(),
    groupsData: Immutable.Map(),
    currency: '',
  }

  state = {
    unitLabel: '',
  };

  componentDidMount() {
    this.props.dispatch(getGroupsOptions());
  }

  onChangeTrigger = (e) => {
    const { onChangeField, item, index, limitation } = this.props;
    const { value } = e.target;
    const limitationToSave = (value === 'usagev' && limitation === 'none' ? 'group' : limitation);
    const path = buildBalanceConditionPath(value, limitationToSave, { activityType: '', groupName: '', overGroup: '' });
    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('path', path);
      itemWithMutation.set('unit', '');
      itemWithMutation.set('usaget', '');
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeOverGroup = (e) => {
    const { onChangeField, index, trigger, activityType, groupName, limitation } = this.props;
    const { value } = e.target;
    const path = buildBalanceConditionPath(trigger, limitation, { activityType, groupName, overGroup: value });
    onChangeField(['conditions', index, 'path'], path);
  }

  onChangeLimitation = (e) => {
    const { onChangeField, index, trigger, activityType, groupName } = this.props;
    const { value } = e.target;
    const path = buildBalanceConditionPath(trigger, value, { activityType, groupName, overGroup: '' });
    onChangeField(['conditions', index, 'path'], path);
  };

  onChangeActivityType = (value) => {
    const { onChangeField, item, index, trigger, limitation, overGroup } = this.props;
    const path = buildBalanceConditionPath(trigger, limitation, { activityType: value, groupName: '', overGroup });
    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('path', path);
      itemWithMutation.set('unit', '');
      itemWithMutation.set('usaget', value);
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeGroupName = (value) => {
    const { onChangeField, item, index, trigger, limitation } = this.props;
    const path = buildBalanceConditionPath(trigger, limitation, { activityType: '', groupName: value });
    const unit = this.getGroupUnit(value);
    const usaget = this.getGroupActivityType(value);

    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('path', path);
      itemWithMutation.set('unit', unit);
      itemWithMutation.set('usaget', usaget);
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeType = (value) => {
    const { onChangeField, index } = this.props;
    onChangeField(['conditions', index, 'type'], value);
  };

  onChangeValue = (e) => {
    const { onChangeField, index } = this.props;
    const { value } = e.target;
    onChangeField(['conditions', index, 'value'], value);
  };

  onChangeTagValue = (e) => {
    const { onChangeField, index } = this.props;
    onChangeField(['conditions', index, 'value'], e);
  };

  onChangeUnit = (unit) => {
    const { onChangeField, index } = this.props;
    onChangeField(['conditions', index, 'unit'], unit);
  };

  filterRelevantGroups = (group) => {
    const { trigger } = this.props;
    return (trigger === 'usagev' && !this.props.groupsData.hasIn([group, 'cost'])) ||
      (trigger === 'cost' && this.props.groupsData.hasIn([group, 'cost']));
  }

  getGroupNamesOptions = () =>
    this.props.groupsOptions
      .filter(this.filterRelevantGroups)
      .map(group => ({ value: group, label: group }))
      .toArray();

  getGroupUnit = group => this.props.groupsData.getIn([group, 'unit'], '');
  getGroupActivityType = group => getGroupUsaget(this.props.groupsData.get(group, Immutable.Map()));

  onChangeMultiValues = (e) => {
    if (Array.isArray(e)) {
      this.onChangeTagValue(e.join(','));
    } else {
      this.onChangeTagValue('');
    }
  };
  renderCustomInputNumber =({ addTag, onChange, value, ...other }) => (
    <input type="number" onChange={onChange} value={value} {...other} />
  );

  render() {
    const {
      item,
      index,
      conditionsOperators,
      trigger,
      limitation,
      activityType,
      groupName,
      overGroup,
      propertyTypes,
      usageTypesData,
      currency,
    } = this.props;

    const usaget = (limitation === 'group' ? item.get('usaget', '') : activityType);
    const unitLabel = getUnitTitle(item.get('unit', ''), trigger, usaget, propertyTypes, usageTypesData, currency);
    const selectedConditionData = getBalanceConditionData(item.get('type', ''));
    return (
      <Col sm={12}>

        <FormGroup>
          <Col sm={3} smOffset={1} style={{ textAlign: 'left' }} componentClass={ControlLabel}>Condition Trigger: </Col>
          <Col sm={8}>
            <Col sm={12}>
              <span style={{ display: 'inline-block', marginRight: 20 }}>
                <Field
                  fieldType="radio"
                  name={`condition-trigger-${index}`}
                  id={`condition-trigger-monetary-${index}`}
                  value="cost"
                  checked={trigger === 'cost'}
                  onChange={this.onChangeTrigger}
                  label="Monetary"
                />
              </span>
              <span style={{ display: 'inline-block', marginRight: 20 }}>
                <Field
                  fieldType="radio"
                  name={`condition-trigger-${index}`}
                  id={`condition-trigger-usagev-${index}`}
                  value="usagev"
                  checked={trigger === 'usagev'}
                  onChange={this.onChangeTrigger}
                  label="Usage"
                />
              </span>
            </Col>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={3} smOffset={1} style={{ textAlign: 'left' }} componentClass={ControlLabel}>Condition Limitations: </Col>
        </FormGroup>
        <Col sm={12}>

          <FormGroup>
            <Col sm={3} smOffset={1}>
              <Field
                fieldType="radio"
                name={`condition-limitation-${index}`}
                id={`condition-limitation-none-${index}`}
                value="none"
                checked={limitation === 'none'}
                onChange={this.onChangeLimitation}
                disabled={trigger === 'usagev'}
                label="Total Amount"
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={3} smOffset={1}>
              <Field
                fieldType="radio"
                name={`condition-limitation-${index}`}
                id={`condition-limitation-group-${index}`}
                value="group"
                checked={limitation === 'group'}
                onChange={this.onChangeLimitation}
                label="Limit to Group"
              />
            </Col>
            <Col sm={8}>
              <Col sm={7} style={{ paddingRight: 0 }}>
                <Field
                  fieldType="select"
                  onChange={this.onChangeGroupName}
                  value={groupName}
                  options={this.getGroupNamesOptions()}
                  disabled={limitation !== 'group'}
                />
              </Col>
              <Col sm={5}>
                <UsageTypesSelector
                  usaget={usaget}
                  unit={item.get('unit', '')}
                  onChangeUsaget={this.onChangeActivityType}
                  onChangeUnit={this.onChangeUnit}
                  enabled={limitation === 'group'}
                  showUnits={trigger === 'usagev' && limitation === 'group'}
                  showAddButton={false}
                  showSelectTypes={false}
                />
              </Col>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={3} smOffset={1}>
              <Field
                fieldType="radio"
                name={`condition-limitation-${index}`}
                id={`condition-limitation-activity-${index}`}
                value="activity_type"
                checked={limitation === 'activity_type'}
                onChange={this.onChangeLimitation}
                label="Limit to Activity Type"
              />
            </Col>
            <Col sm={8}>
              <Col sm={12}>
                <UsageTypesSelector
                  usaget={activityType}
                  unit={item.get('unit', '')}
                  onChangeUsaget={this.onChangeActivityType}
                  onChangeUnit={this.onChangeUnit}
                  enabled={limitation === 'activity_type'}
                  showUnits={trigger === 'usagev' && limitation === 'activity_type'}
                />
              </Col>
            </Col>
            { trigger === 'usagev' && limitation === 'activity_type' && (
              <Col sm={8} smOffset={4}>
                <Col sm={12}>
                  <span style={{ display: 'inline-block', marginRight: 20 }}>
                    <Field
                      fieldType="radio"
                      name={`condition-over-group-${index}`}
                      id={`condition-over-group-all-units-${index}`}
                      value="none"
                      checked={overGroup !== 'over_group'}
                      onChange={this.onChangeOverGroup}
                      label="All units"
                      enabled={limitation === 'activity_type'}
                    />
                  </span>
                  <span style={{ display: 'inline-block' }}>
                    <Field
                      fieldType="radio"
                      name={`condition-over-group-${index}`}
                      id={`condition-over-group-exceeding-units-${index}`}
                      value="over_group"
                      checked={overGroup === 'over_group'}
                      onChange={this.onChangeOverGroup}
                      label="Exceeding units"
                      disabled={limitation !== 'activity_type'}
                    />
                  </span>
                </Col>
              </Col>
            )}
          </FormGroup>

          <Col sm={12}>
            <FormGroup>
              <Col sm={5} componentClass={ControlLabel}>Type</Col>
              <Col sm={4}>
                <Field
                  fieldType="select"
                  onChange={this.onChangeType}
                  value={item.get('type', '')}
                  options={conditionsOperators}
                />
              </Col>
            </FormGroup>
          </Col>

          {
            selectedConditionData.get('extra_field', true) && selectedConditionData.get('type', 'text') !== 'tags' &&
            (<Col sm={12}>
              <FormGroup>
                <Col sm={5} componentClass={ControlLabel}>
                  Value
                </Col>
                <Col sm={4}>
                  <InputGroup style={{ width: '100%' }}>
                    <Field
                      id={`cond-value-${index}`}
                      onChange={this.onChangeValue}
                      value={item.get('value', '')}
                      fieldType={selectedConditionData.get('type', 'text')}
                    />
                    { unitLabel !== '' && (
                      <InputGroup.Addon>{unitLabel}</InputGroup.Addon>
                    )}
                  </InputGroup>
                </Col>
              </FormGroup>
            </Col>)
        }

          {
          selectedConditionData.get('extra_field', true) && selectedConditionData.get('type', 'text') === 'tags' &&
          (<Col sm={12}>
            <FormGroup>
              <Col sm={5} componentClass={ControlLabel}>
                Value
              </Col>
              <Col sm={4}>
                <InputGroup>
                  <Field
                    fieldType="tags"
                    id={`cond-value-${index}`}
                    onChange={this.onChangeMultiValues}
                    value={String(item.get('value', '')).split(',').filter(val => val !== '')}
                    renderInput={this.renderCustomInputNumber}
                    onlyUnique={selectedConditionData.get('type', '') === 'tags'}
                  />
                  { unitLabel !== '' && (
                    <InputGroup.Addon>{unitLabel}</InputGroup.Addon>
                  )}
                </InputGroup>
              </Col>
            </FormGroup>
          </Col>)
        }
        </Col>
      </Col>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { trigger, limitation, activityType, groupName, overGroup } = getPathParams(props.item.get('path', ''));
  return {
    trigger,
    limitation,
    activityType,
    groupName,
    overGroup,
    groupsOptions: groupsOptionsSelector(state, props) || Immutable.List(),
    groupsData: groupsDataSelector(state, props) || Immutable.Map(),
    currency: currencySelector(state, props),
    conditionsOperators: eventConditionsOperatorsSelectOptionsSelector(null, { eventType: 'balance' }),
  };
};

export default connect(mapStateToProps)(BalanceEventCondition);
