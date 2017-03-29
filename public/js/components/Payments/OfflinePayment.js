import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Col, FormGroup, Form, ControlLabel, HelpBlock, InputGroup } from 'react-bootstrap';
import { getSymbolFromCurrency } from 'currency-symbol-map';
import Field from '../Field';
import ModalWrapper from '../Elements/ModalWrapper';
import { currencySelector } from '../../selectors/settingsSelector';
import { payOffline } from '../../actions/paymentsActions';

class OfflinePayment extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    aid: PropTypes.number.isRequired,
    payerName: PropTypes.string,
    methods: PropTypes.instanceOf(List),
    currency: PropTypes.string,
    debt: PropTypes.oneOfType([
      PropTypes.number,
      null,
    ]),
  };

  static defaultProps = {
    payerName: '',
    methods: List(['cash', 'cheque', 'write_off']),
    currency: '',
    debt: null,
  };

  state = {
    validationErrors: Map({
      method: 'required',
      monetaryValue: 'required',
    }),
    method: '',
    monetaryValue: '',
  }

  componentDidMount() {
    this.initDefaultValues();
  }

  initDefaultValues = () => {
    const { debt } = this.props;
    if (debt !== null) {
      this.onChangeMonetaryValue({ target: { value: Math.abs(debt) } });
    }
  }

  onChangeValue = (field, value) => {
    const { validationErrors } = this.state;
    const newState = {};
    newState[field] = value;
    if (value.length === 0) {
      newState.validationErrors = validationErrors.set(field, 'required');
    } else {
      newState.validationErrors = validationErrors.set(field, '');
    }
    this.setState(newState);
  };

  onChangeMethodValue = (value) => {
    this.onChangeValue('method', value);
  }

  onChangeMonetaryValue = (e) => {
    const { value } = e.target;
    this.onChangeValue('monetaryValue', value);
  }

  onChangeChequeNumValue = (e) => {
    const { value } = e.target;
    this.onChangeValue('chequeNum', value);
  }

  getAvailableMethods = () => {
    const { methods } = this.props;
    return methods.map(method => ({ value: method, label: method })).toArray();
  }

  onPay = () => {
    const { aid, payerName } = this.props;
    const { method, monetaryValue, chequeNum } = this.state;
    this.props.dispatch(payOffline(method, aid, monetaryValue, payerName, chequeNum))
      .then(this.afterPay);
  }

  afterPay = (response) => {
    if (response.status) {
      this.props.onClose();
    }
  }

  render() {
    const { currency } = this.props;
    const { validationErrors, method, monetaryValue, chequeNum } = this.state;
    const availableMethods = this.getAvailableMethods();
    return (
      <ModalWrapper
        show={true}
        labelOk="Pay"
        title="Offline Payment"
        onOk={this.onPay}
        onCancel={this.props.onClose}
      >
        <Form horizontal>

          <FormGroup validationState={validationErrors.get('method', '').length > 0 ? 'error' : null}>
            <Col sm={2} componentClass={ControlLabel}>Method</Col>
            <Col sm={8}>
              <Select
                id="method"
                onChange={this.onChangeMethodValue}
                value={method}
                options={availableMethods}
              />
              { validationErrors.get('method', '').length > 0 ? <HelpBlock>{validationErrors.get('method', '')}</HelpBlock> : ''}
            </Col>
          </FormGroup>

          <FormGroup validationState={validationErrors.get('monetaryValue', '').length > 0 ? 'error' : null}>
            <Col sm={2} componentClass={ControlLabel}>Monetary Value</Col>
            <Col sm={8}>
              <InputGroup>
                <Field
                  id="monetaryValue"
                  onChange={this.onChangeMonetaryValue}
                  value={monetaryValue}
                  fieldType="number"
                />
                <InputGroup.Addon>
                  {getSymbolFromCurrency(currency)}
                </InputGroup.Addon>
              </InputGroup>
              { validationErrors.get('monetaryValue', '').length > 0 ? <HelpBlock>{validationErrors.get('monetaryValue', '')}</HelpBlock> : ''}
            </Col>
          </FormGroup>

          {method === 'cheque' &&
            (<FormGroup>
              <Col sm={2} componentClass={ControlLabel}>Cheque Number</Col>
              <Col sm={8}>
                <Field
                  id="chequeNum"
                  onChange={this.onChangechequeNumValue}
                  value={chequeNum}
                  fieldType="number"
                />
              </Col>
            </FormGroup>)
          }

        </Form>
      </ModalWrapper>
    );
  }
}

const mapStateToProps = (state, props) => ({
  currency: currencySelector(state, props),
});

export default connect(mapStateToProps)(OfflinePayment);