import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import Select from 'react-select';
import Field from '../../Field';
import {
  formatSelectOptions,
  getConfig,
} from '../../../common/Util';
import {
  productsOptionsSelector,
  cyclesOptionsSelector,
  plansOptionsSelector,
  groupsOptionsSelector,
} from '../../../selectors/listSelectors';
import {
  usageTypeSelector,
  fileTypeSelector,
} from '../../../selectors/settingsSelector';
import {
  getCyclesOptions,
  getProductsOptions,
  getPlansOptions,
  getServicesOptions,
  getGroupsOptions,
  getUsageTypesOptions,
  getFileTypesOptions,
} from '../../../actions/reportsActions';


class ConditionValue extends Component {

  static propTypes = {
    field: PropTypes.instanceOf(Immutable.Map),
    config: PropTypes.instanceOf(Immutable.Map),
    operator: PropTypes.instanceOf(Immutable.Map),
    selectOptions: PropTypes.instanceOf(Immutable.Map),
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    field: Immutable.Map(),
    config: Immutable.Map(),
    operator: Immutable.Map(),
    selectOptions: Immutable.Map(),
    disabled: false,
    onChange: () => {},
  }

  componentDidMount() {
    const { config, selectOptions } = this.props;
    this.initFieldOptions(config, selectOptions);
  }

  componentWillReceiveProps(nextProps) {
    const { config } = this.props;
    if (!Immutable.is(config, nextProps.config)) {
      this.initFieldOptions(nextProps.config, nextProps.selectOptions);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { field, config, operator, selectOptions, disabled } = this.props;
    return (
      !Immutable.is(field, nextProps.field)
      || !Immutable.is(config, nextProps.config)
      || !Immutable.is(selectOptions, nextProps.selectOptions)
      || !Immutable.is(operator, nextProps.operator)
      || disabled !== nextProps.disabled
    );
  }

  initFieldOptions = (config, selectOptions) => {
    if (config.hasIn(['inputConfig', 'callback']) && selectOptions.get(config.getIn(['inputConfig', 'callback']), Immutable.List()).isEmpty()) {
      const callback = config.getIn(['inputConfig', 'callback']);
      switch (callback) {
        case 'getCyclesOptions': this.props.dispatch(getCyclesOptions());
          break;
        case 'getPlansOptions': this.props.dispatch(getPlansOptions());
          break;
        case 'getProductsOptions': this.props.dispatch(getProductsOptions());
          break;
        case 'getServicesOptions': this.props.dispatch(getServicesOptions());
          break;
        case 'getGroupsOptions': this.props.dispatch(getGroupsOptions());
          break;
        case 'getUsageTypesOptions': this.props.dispatch(getUsageTypesOptions());
          break;
        case 'getFileTypeOptions': this.props.dispatch(getFileTypesOptions());
          break;
        default: console.log('unsuported select options callback');
          break;
      }
    }
  }

  onChangeText = (e) => {
    const { value } = e.target;
    this.props.onChange(value);
  };

  onChangeSelect = (value) => {
    this.props.onChange(value);
  };

  onChangeBoolean = (value) => {
    const trueValues = [1, '1', 'true', true, 'yes', 'on'];
    const bool = value === '' ? '' : trueValues.includes(value);
    this.props.onChange(bool);
  };

  onChangeNumber = (e) => {
    const { value } = e.target;
    const number = Number(value);
    if (!isNaN(number)) {
      this.props.onChange(number);
    } else {
      this.props.onChange(value);
    }
  };

  onChangeMultiValues = (e) => {
    if (Array.isArray(e)) {
      this.props.onChange(e.join(','));
    } else {
      this.props.onChange('');
    }
  };

  onChangeDate = (date) => {
    if (moment.isMoment(date) && date.isValid()) {
      this.props.onChange(date.format(getConfig('dateFormat', 'DD/MM/YYYY')));
    } else {
      this.props.onChange(null);
    }
  };

  getOptionsValues = (defaultOptions = Immutable.List()) => this.props.operator
    .get('options', defaultOptions)
    .map(formatSelectOptions)
    .toArray();


  renderDateTag = value => moment(value).format(getConfig('dateFormat', 'DD/MM/YYYY'));

  renderCustomInputDate = ({ addTag, disabled }) => {
    const onChange = (date) => {
      addTag(date.toISOString());
    };
    return (
      <span className="custom-field-input">
        <Field
          fieldType="date"
          value={null}
          onChange={onChange}
          disabled={disabled}
        />
      </span>
    );
  }

  renderCustomInputNumber =({ addTag, onChange, value, ...other }) => (
    <span className="custom-field-input">
      <Field
        fieldType="number"
        onChange={onChange}
        value={value}
        {...other}
      />
    </span>
  );

  render() {
    const { field, disabled, config, selectOptions } = this.props;
    //  Boolean + operator 'EXIST'
    if (field.get('op', null) === 'exists' || config.get('type', '') === 'boolean') {
      let value = '';
      if (field.get('value', false) === true) {
        value = 'yes';
      } else if (!field.get('value', true) === false) {
        value = 'no';
      }
      const booleanOptions = this.getOptionsValues(Immutable.List(['yes', 'no']));
      return (
        <Select
          clearable={false}
          options={booleanOptions}
          value={value}
          onChange={this.onChangeBoolean}
          disabled={disabled}
        />
      );
    }

    // String-select
    if (config.get('type', 'string') === 'string' && config.getIn(['inputConfig', 'inputType']) === 'select') {
      const options = config.hasIn(['inputConfig', 'callback'])
        ? selectOptions.get(config.getIn(['inputConfig', 'callback'], ''), Immutable.List())
        : config.getIn(['inputConfig', 'options'], Immutable.List());

      const formatedOptions = options
        .map(formatSelectOptions)
        .toArray();

      const multi = ['nin', 'in'].includes(field.get('op', ''));
      return (
        <Select
          clearable={false}
          multi={multi}
          options={formatedOptions}
          value={field.get('value', '')}
          onChange={this.onChangeSelect}
          disabled={disabled}
        />
      );
    }

    // 'Number'
    if (config.get('type', '') === 'number') {
      if (['nin', 'in'].includes(field.get('op', ''))) {
        const value = field.get('value', '').split(',').filter(val => val !== '');
        return (
          <Field
            fieldType="tags"
            value={value}
            onChange={this.onChangeMultiValues}
            disabled={disabled}
            renderInput={this.renderCustomInputNumber}
          />
        );
      }
      return (
        <Field
          fieldType="number"
          value={field.get('value', '')}
          onChange={this.onChangeNumber}
          disabled={disabled}
        />
      );
    }

    // 'Date'
    if (config.get('type', '') === 'date') {
      if (['nin', 'in'].includes(field.get('op', ''))) {
        const value = field.get('value', '').split(',').filter(val => val !== '');
        return (
          <Field
            fieldType="tags"
            value={value}
            onChange={this.onChangeMultiValues}
            disabled={disabled}
            renderInput={this.renderCustomInputDate}
            getTagDisplayValue={this.renderDateTag}
          />
        );
      }
      const value = moment(field.get('value', null), getConfig('dateFormat', 'DD/MM/YYYY'));
      return (
        <Field
          fieldType="date"
          value={value}
          onChange={this.onChangeDate}
          disabled={disabled}
        />
      );
    }

    // 'String'
    if (['nin', 'in'].includes(field.get('op', ''))) {
      const value = field.get('value', '').split(',').filter(val => val !== '');
      return (
        <Field
          fieldType="tags"
          value={value}
          onChange={this.onChangeMultiValues}
          disabled={disabled}
        />
      );
    }
    return (
      <Field
        value={field.get('value', '')}
        onChange={this.onChangeText}
        disabled={disabled}
      />
    );
  }

}

const mapStateToProps = (state, props) => ({
  selectOptions: Immutable.Map({
    getCyclesOptions: cyclesOptionsSelector(state, props) || Immutable.List(),
    getProductsOptions: productsOptionsSelector(state, props) || Immutable.List(),
    getPlansOptions: plansOptionsSelector(state, props) || Immutable.List(),
    getGroupsOptions: groupsOptionsSelector(state, props) || Immutable.List(),
    getUsageTypesOptions: usageTypeSelector(state, props) || Immutable.List(),
    getFileTypeOptions: fileTypeSelector(state, props) || Immutable.List(),
  }),
});

export default connect(mapStateToProps)(ConditionValue);
