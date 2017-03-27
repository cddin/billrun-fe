import React, { Component, PropTypes } from 'react';
import { InputGroup } from 'react-bootstrap';
import Field from '../Field';


export default class ToggeledInput extends Component {

  static defaultProps = {
    label: 'Enable',
    disabledValue: null,
    disabledDisplayValue: '',
    disabled: false,
    editable: true,
    suffix: null,
    inputProps: {},
    compare: (a, b) => a === b,
  };

  static propTypes = {
    value: PropTypes.any,
    disabledDisplayValue: PropTypes.any,
    disabledValue: PropTypes.any,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    inputProps: PropTypes.object,
    suffix: PropTypes.node,
    onChange: PropTypes.func.isRequired,
    compare: PropTypes.func.isRequired,
  }


  constructor(props) {
    super(props);
    const isSame = props.compare(props.value, props.disabledValue);
    this.state = {
      value: isSame ? props.disabledDisplayValue : props.value,
      off: isSame,
    };
  }

  componentWillReceiveProps(nextProps) {
    const isSameValue = this.props.compare(nextProps.value, this.props.value);
    const isSame = this.props.compare(nextProps.value, nextProps.disabledValue);
    if (!isSameValue && !isSame) {
      this.setState({ value: nextProps.value });
    }
  }

  onChangedState = (e) => {
    const { disabledValue } = this.props;
    const { checked } = e.target;
    const newValue = checked ? this.state.value : disabledValue;
    this.props.onChange(newValue);
    this.setState({ off: !checked });
  }

  onValueChanged = (e) => {
    const value = this.getValue(e);
    this.setState({ value });
    this.props.onChange(value);
  }

  getValue = (e) => {
    const { inputProps: { fieldType = 'text' } } = this.props;
    switch (fieldType) {
      case 'date':
        return e;
      default:
        return e.target.value;
    }
  }

  render() {
    const { value, off } = this.state;
    const { label, disabled, editable, suffix, inputProps, disabledDisplayValue } = this.props;

    if (!editable) {
      return (<div className="non-editable-field">{ off ? disabledDisplayValue : value }</div>);
    }

    return (
      <InputGroup>
        <InputGroup.Addon>
          <input
            checked={!off}
            onChange={this.onChangedState}
            type="checkbox"
            disabled={disabled}
          /><small style={{ verticalAlign: 'bottom' }}> {label}</small>
        </InputGroup.Addon>
        <Field
          disabled={off || disabled}
          onChange={this.onValueChanged}
          value={off ? disabledDisplayValue : value}
          {...inputProps}
        />
        { (suffix !== null) && <InputGroup.Addon>{suffix}</InputGroup.Addon> }
      </InputGroup>
    );
  }

}
