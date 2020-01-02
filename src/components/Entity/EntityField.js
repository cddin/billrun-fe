import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Immutable from 'immutable';
import { FormGroup, Col, ControlLabel, InputGroup, Button, HelpBlock } from 'react-bootstrap';
import Field from '../Field';
import Help from '../Help';
import { getConfig, formatSelectOptions } from '@/common/Util';


class EntityField extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    field: PropTypes.instanceOf(Immutable.Map),
    editable: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    onlyInput: PropTypes.bool,
    isFieldTags: PropTypes.bool,
    isFieldSelect: PropTypes.bool,
    isFieldBoolean: PropTypes.bool,
    isFieldRanges: PropTypes.bool,
    isFieldDate: PropTypes.bool,
    isFieldDateRange: PropTypes.bool,
    isRemoveField: PropTypes.bool,
    fieldPath: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    entity: Immutable.Map(),
    field: Immutable.Map(),
    editable: true,
    disabled: false,
    onlyInput: false,
    isFieldTags: false,
    isFieldSelect: false,
    isFieldBoolean: false,
    isFieldRanges: false,
    isFieldDate: false,
    isFieldDateRange: false,
    fieldPath: [],
    error: '',
    onChange: () => {},
  }

  componentDidMount() {
    this.initDefaultValues();
  }

  initDefaultValues = () => {
    const { field, entity, fieldPath } = this.props;
    if ([null, undefined].includes(entity.getIn(fieldPath, null))) {
      const noDefaultValueVal = this.getNoDefaultValueVal();
      const defaultValue = field.get('default_value', noDefaultValueVal);
      if (defaultValue !== null) {
        this.props.onChange(fieldPath, defaultValue);
      }
    }
  }

  getNoDefaultValueVal = (byConfig = true) => {
    const {
      field, isFieldBoolean, isFieldTags, isFieldSelect, isFieldRanges, isFieldDateRange,
    } = this.props;
    if (isFieldBoolean) {
      return false;
    }
    if (isFieldRanges || isFieldDateRange) {
      // const defaultRangeValue = Immutable.Map({ from: '', to: '' });
      // return Immutable.List([defaultRangeValue]);
      return Immutable.List();
    }
    if (!byConfig) {
      return null;
    }
    if (isFieldTags || (isFieldSelect && field.get('multiple', false))) {
      return [];
    }
    return '';
  }

  pasteSplit = (data) => {
    const separators = [',', ';', '\\(', '\\)', '\\*', '/', ':', '\\?', '\n', '\r', '\t'];
    return data.split(new RegExp(separators.join('|'))).map(d => d.trim());
  }

  getFieldOptios = (field) => {
    const options = field.get('select_options', '');
    const nonFormatedOptions = (typeof options === 'string')
      ? options.split(',').filter(option => option !== '')
      : options;
    return nonFormatedOptions.map(formatSelectOptions);
  }

  onChange = (e) => {
    const { fieldPath } = this.props;
    const { value } = e.target;
    this.props.onChange(fieldPath, value);
  }

  onChangeSelect = (val) => {
    const { field, fieldPath } = this.props;
    const multi = field.get('multiple', false);
    if (multi) {
      this.props.onChange(fieldPath, val.split(','));
    } else {
      this.props.onChange(fieldPath, val);
    }
  }

  onChangeDate = (date) => {
    const { fieldPath } = this.props;
    const apiDateTimeFormat = getConfig('apiDateTimeFormat', 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    const value = (moment.isMoment(date) && date.isValid()) ? date.format(apiDateTimeFormat) : '';
    this.props.onChange(fieldPath, value);
  }

  onChangeRange = (val) => {
    const { fieldPath } = this.props;
    this.props.onChange(fieldPath, val);
  }

  onChangeTags = (val) => {
    const { fieldPath } = this.props;
    this.props.onChange(fieldPath, val);
  }

  getFieldValue = () => {
    const {
      entity, editable, fieldPath, isFieldTags, isFieldBoolean, isFieldRanges, isFieldDate, isFieldDateRange,
    } = this.props;
    if (isFieldDate) {
      const value = entity.getIn(fieldPath, '');
      return ([undefined, null, ''].includes(value)) ? undefined : moment(value);
    }
    if (isFieldDateRange) {
      const value = entity.getIn(fieldPath, undefined);
      return ([undefined, null, ''].includes(value)) ? undefined : value;
    }
    if (isFieldRanges) {
      return entity.getIn(fieldPath, undefined);
      // return entity.getIn(fieldPath, { from: '', to: '' });
    }
    if (isFieldBoolean) {
      const booleanValue = entity.getIn(fieldPath, '');
      return (booleanValue === '') ? booleanValue : [true, 1, 'true'].includes(booleanValue);
    }
    const fieldVal = entity.getIn(fieldPath, []);
    if (isFieldTags && editable) {
      return Immutable.List.isList(fieldVal) ? fieldVal.toArray() : fieldVal;
    }
    return (Array.isArray(fieldVal) || Immutable.List.isList(fieldVal)) ? fieldVal.join(',') : fieldVal;
  }

  onClickRemoveInput = () => {
    const { entity, fieldPath } = this.props;
    if (fieldPath.length > 1) {
      const lastElement = fieldPath.splice(fieldPath.length - 1, 1);
      const withoutField = entity.getIn(fieldPath).delete(...lastElement);
      this.props.onChange(fieldPath, withoutField);
    }
  }

  renderRemovableField = (input) => {
    const { field } = this.props;
    return (
      <InputGroup>
        {input}
        <InputGroup.Button>
          <Button onClick={this.onClickRemoveInput}>
            <i
              className="fa fa-fw fa-trash-o danger-red"
              title={`Remove ${field.get('title', field.get('field_name', ''))} field`}
            />
          </Button>
        </InputGroup.Button>
      </InputGroup>
    );
  }

  renderField = () => {
    const {
      editable,
      field,
      disabled,
      isFieldTags,
      isFieldSelect,
      isFieldBoolean,
      isFieldRanges,
      isFieldDate,
      isFieldDateRange
    } = this.props;
    const value = this.getFieldValue();
    if (isFieldRanges) {
      const multi = field.get('multiple', false);
      return (
        <Field
          fieldType="ranges"
          onChange={this.onChangeRange}
          value={value}
          multi={multi}
          editable={editable}
          label={field.get('title', field.get('field_name', ''))}
          disabled={disabled}
        />
      );
    }
    if (isFieldBoolean) {
      const checkboxStyle = { height: 29, marginTop: 8 };
      return (
        <Field
          fieldType="checkbox"
          onChange={this.onChange}
          value={value}
          editable={editable}
          style={checkboxStyle}
          disabled={disabled}
        />
      );
    }
    if (isFieldDateRange) {
      const multi = field.get('multiple', false);
      return (
          <Field
            fieldType="ranges"
            onChange={this.onChangeRange}
            value={value}
            multi={multi}
            editable={editable}
            label={field.get('title', field.get('field_name', ''))}
            disabled={disabled}
            inputProps={{fieldType: 'date', isClearable: true}}
            inputFromProps={{selectsStart: true, endDate:'@valueTo@'}}
            inputToProps={{selectsEnd: true, startDate: '@valueFrom@', endDate: '@valueTo@', minDate: '@valueFrom@'}}
          />
      );
    }
    if (isFieldDate) {
      const mandatory = field.get('mandatory', false);
      return (
        <Field
          fieldType="date"
          value={value}
          onChange={this.onChangeDate}
          editable={editable}
          isClearable={!mandatory}
        />
      );
    }
    if (isFieldSelect && editable) {
      const multi = field.get('multiple', false);
      const options = this.getFieldOptios(field);
      return (
        <Field
          fieldType="select"
          multi={multi}
          value={value}
          onChange={this.onChangeSelect}
          options={options}
          disabled={disabled}
        />
      );
    }
    if (isFieldTags && editable) {
      return (
        <Field
          fieldType="tags"
          value={value}
          onChange={this.onChangeTags}
          addOnPaste
          pasteSplit={this.pasteSplit}
          disabled={disabled}
        />
      );
    }
    const fieldType = field.get('type', '') === '' ? 'text' : field.get('type', '');
    return (
      <Field
        fieldType={fieldType}
        onChange={this.onChange}
        value={value}
        editable={editable}
        disabled={disabled}
        preffix={field.get('preffix')}
        suffix={field.get('suffix')}
      />
    );
  }

  render() {
    const { field, editable, error, onlyInput, isRemoveField } = this.props;
    const fieldInput = this.renderField();
    if (onlyInput) {
      return fieldInput;
    }
    const fieldName = field.get('field_name', '');
    const help = field.get('help', '');
    const description = field.get('description', '');
    return (
      <FormGroup controlId={fieldName} validationState={error ? 'error' : null}>
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { field.get('title', fieldName) }
          { field.get('mandatory', false) && (<span className="danger-red"> *</span>)}
          { description !== '' && (<Help contents={description} />) }
        </Col>
        <Col sm={8} lg={9}>
          { isRemoveField && editable && !field.get('mandatory', false) ? this.renderRemovableField(fieldInput) : fieldInput }
          { error && (<HelpBlock><small>{error}</small></HelpBlock>)}
          { help !== '' && (<HelpBlock><small>{help}</small></HelpBlock>)}
        </Col>
      </FormGroup>
    );
  }

}

export default EntityField;
