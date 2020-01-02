import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { MenuItem, DropdownButton, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';
import { titleCase } from 'change-case';
import { EntityField } from './index';
import { getSettings } from '@/actions/settingsActions';
import {
  entityFieldSelector,
  isPlaysEnabledSelector,
} from '@/selectors/settingsSelector';


class EntityFields extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    entityName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    fields: PropTypes.instanceOf(Immutable.List),
    errors: PropTypes.instanceOf(Immutable.Map),
    highlightPramas: PropTypes.instanceOf(Immutable.List),
    fieldsFilter: PropTypes.func,
    editable: PropTypes.bool,
    isPlaysEnabled: PropTypes.bool,
    onChangeField: PropTypes.func,
    onRemoveField: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entity: Immutable.Map(),
    fields: Immutable.List(),
    errors: Immutable.Map(),
    highlightPramas: null,
    fieldsFilter: null,
    editable: true,
    isPlaysEnabled: false,
    onChangeField: () => {},
    onRemoveField: () => { console.error('Please implement onRemoveField function for EntityFields'); },
  }

  componentDidMount() {
    const { entityName, fields, entity } = this.props;
    if (fields.isEmpty()) {
      this.props.dispatch(getSettings(entityName));
    }
    // fix problem when empty params object converted to array
    if (entity.has('params') && Immutable.is(entity.get('params', Immutable.List()), Immutable.List())) {
      this.props.onChangeField(['params'], Immutable.Map());
    }
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line no-unused-vars
    const { fields, entity } = this.props;
    const { entity: oldEntity } = prevProps;

    const isMultiple = fields.find(field => field.get('field_name', '') === 'play',
      null, Immutable.Map(),
    ).get('multiple', false);
    const shouldResetFields = isMultiple ?
      !Immutable.is(entity.get('play', Immutable.List()), oldEntity.get('play', Immutable.List()))
      : entity.get('play', '') !== oldEntity.get('play', '');
    if (shouldResetFields) {
      fields.forEach((field) => {
        const shoudPlayBeDisplayd = this.filterPlayFields(field);
        if (!shoudPlayBeDisplayd) {
          this.props.onRemoveField(field.get('field_name', '').split('.'));
        }
      });
    }
  }

  getParamsOptions = () => {
    const { fields, fieldsFilter, highlightPramas } = this.props;
    const fieldFilterFunction = fieldsFilter !== null ? fieldsFilter : this.filterPrintableFields;
    return fields
      .filter(fieldFilterFunction)
      .filter(field => !this.filterParamsFields(field))
      .map(field => ({
        label: titleCase(field.get('title', '')),
        value: field.get('field_name', '').split('.')[1],
      }))
      .sortBy(field => field.label)
      .sortBy(field =>
        (highlightPramas !== null && highlightPramas.includes(`params.${field.value}`) ? 0 : 1)
      )
  }

  onAddParam = (key) => {
    this.props.onChangeField(['params', key], null);
  }

  filterPrintableFields = field => (
    field.get('display', false) !== false
    && field.get('editable', false) !== false
    && field.get('field_name', '') !== 'tariff_category'
    && field.get('field_name', '') !== 'play'
  );

  filterParamsFields = (field) => {
    const { entity } = this.props;
    const fieldPath = field.get('field_name', '').split('.');
    return (!(fieldPath[0] === 'params' && !entity.hasIn(fieldPath))) || field.get('mandatory', false);
  }

  filterPlayFields = (field) => {
    const { entity, isPlaysEnabled } = this.props;
    if (!isPlaysEnabled) {
      return true;
    }
    const play = entity.get('play', '');
    const plays = Immutable.List(typeof play.split === 'function' ? play.split(',') : play);
    const fieldPlays = field.get('plays', 'all');
    const isFieldOfPlay = fieldPlays === 'all' || plays.some(p => fieldPlays.indexOf(p) > -1);
    return isFieldOfPlay;
  }

  renderField = (field, key) => {
    const { entity, editable, onChangeField, errors } = this.props;
    return (
      <EntityField
        key={`key_${field.get('field_name', key)}`}
        field={field}
        entity={entity}
        editable={editable}
        onChange={onChangeField}
        error={errors.get(field.get('field_name', ''), false)}
      />
    );
  };

  renderFields = () => {
    const { fields, fieldsFilter } = this.props;
    const fieldFilterFunction = fieldsFilter !== null ? fieldsFilter : this.filterPrintableFields;
    return fields
      .filter(this.filterPlayFields)
      .filter(fieldFilterFunction)
      .filter(this.filterParamsFields)
      .map(this.renderField);
  }

  renderAddParamButton = (options) => {
    const { highlightPramas } = this.props;
    const highlightAll = highlightPramas === null;
    const menuItems = options.map((option) => {
      const highlight = highlightAll || highlightPramas.includes(`params.${option.value}`);
      const menuItemClass = classNames({
        'disable-label': !highlight,
      });
      const onSelect = () => { this.onAddParam(option.value); };
      return (
        <MenuItem key={option.value} eventKey={option.value} onSelect={onSelect}>
          <span className={menuItemClass}>{option.label}</span>
        </MenuItem>
      );
    });
    return (
      <DropdownButton id="add-param-input" componentClass={InputGroup.Button} className="btn-primary btn btn-xs btn-default" title="Add parameter" >
        { menuItems }
      </DropdownButton>
    );
  }

  render() {
    const { editable } = this.props;
    const entityfields = this.renderFields();
    const paramsOptions = this.getParamsOptions();
    if (!entityfields.isEmpty() || !paramsOptions.isEmpty()) {
      return (
        <div className="EntityFields">
          { entityfields }
          { (!paramsOptions.isEmpty() && editable) && this.renderAddParamButton(paramsOptions) }
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state, props) => ({
  fields: entityFieldSelector(state, props),
  isPlaysEnabled: isPlaysEnabledSelector(state, props),
});

export default connect(mapStateToProps)(EntityFields);
