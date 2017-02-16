import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Col, FormGroup, HelpBlock, Modal, Form, ControlLabel } from 'react-bootstrap';
import moment from 'moment';
import { Map, List } from 'immutable';
import Field from '../Field';
import { showSuccess } from '../../actions/alertsActions';
import { getProductsKeysQuery } from '../../common/ApiQueries';
import { getList } from '../../actions/listActions';
import { getSettings } from '../../actions/settingsActions';
import { creditCharge } from '../../actions/creditActions';

class Credit extends Component {
  static defaultProps = {
    allRates: List(),
    usageTypes: List(),
    cancelLabel: 'Cancel',
    chargeLabel: 'Charge',
    sid: false,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    allRates: PropTypes.instanceOf(List),
    usageTypes: PropTypes.instanceOf(List),
    onClose: PropTypes.func.isRequired,
    sid: PropTypes.number,
    aid: PropTypes.number.isRequired,
    cancelLabel: PropTypes.string,
    chargeLabel: PropTypes.string,
  };

  state = {
    validationErrors: Map({
      aprice: 'required',
      usagev: '',
      usaget: '',
      rate: 'required',
    }),
    paramKeyError: '',
    rateBy: 'fix',
    aprice: '',
    usagev: '',
    usaget: '',
    rate: '',
  }

  componentDidMount() {
    this.props.dispatch(getList('all_rates', getProductsKeysQuery()));
    this.props.dispatch(getSettings('usage_types'));
  }

  onChangeCreditValue = (field, e) => {
    const { value } = e.target;
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

  onChangeCreditBy = (e) => {
    const { value } = e.target;
    const { validationErrors } = this.state;
    let newState;
    if (value === 'fix') {
      newState = {
        rateBy: value,
        usaget: '',
        usagev: '',
        validationErrors: validationErrors.set('aprice', 'required').set('usagev', '').set('usaget', ''),
      };
    } else {
      newState = {
        rateBy: value,
        aprice: '',
        validationErrors: validationErrors.set('aprice', '').set('usagev', 'required').set('usaget', 'required'),
      };
    }
    this.setState(newState);
  }

  onCreditCharge = () => {
    const { aid, sid } = this.props;
    const { rateBy, aprice, usagev, usaget, rate, validationErrors } = this.state;
    if (validationErrors.valueSeq().includes('required')) {
      return;
    }
    let params = [
      { aid },
      { sid },
      { rate },
      { credit_time: moment().toISOString() },
    ];
    if (rateBy === 'fix') {
      params = [...params, { aprice }];
    } else {
      params = [...params, { usagev }, { usaget }];
    }
    this.props.dispatch(creditCharge(params))
    .then(
      (response) => {
        if (response === true) {
          this.props.dispatch(showSuccess('Credit successfully!'));
          this.props.onClose();
        }
      }
    );
  };

  getAvailableUsageTypes = () => {
    const { usageTypes } = this.props;
    return [
      (<option disabled value="" key={-1}>Select Unit Type...</option>),
      ...usageTypes.map(usaget => (<option value={usaget} key={usaget}>{usaget}</option>)),
    ];
  }

  getAvailableRates = () => {
    const { allRates } = this.props;
    return [
      (<option disabled value="" key={-1}>Select Rate...</option>),
      ...allRates.map(rate => (<option value={rate.get('key')} key={rate.get('key')}>{rate.get('key')}</option>)),
    ];
  }

  render() {
    const { cancelLabel, chargeLabel } = this.props;
    const { rateBy, aprice, usagev, usaget, rate, validationErrors } = this.state;
    const availableRates = this.getAvailableRates();
    const availableUsageTypes = this.getAvailableUsageTypes();
    return (
      <Modal show={true}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Credit Charge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col sm={2} componentClass={ControlLabel}>Rate By</Col>
              <Col sm={10}>
                <input
                  type="radio"
                  name="rate-by"
                  id="rate-by-fix"
                  value="fix"
                  checked={rateBy === 'fix'}
                  onChange={this.onChangeCreditBy}
                />
                <label htmlFor="rate-by-fix">fix price</label>
                <input
                  type="radio"
                  name="rate-by"
                  id="rate-by-usagev"
                  value="usagev"
                  checked={rateBy === 'usagev'}
                  onChange={this.onChangeCreditBy}
                />
                <label htmlFor="rate-by-usagev">volume</label>
              </Col>
            </FormGroup>

            <FormGroup validationState={validationErrors.get('aprice', '').length > 0 ? 'error' : null}>
              <Col sm={2} componentClass={ControlLabel}>Price</Col>
              <Col sm={10}>
                <Field
                  onChange={this.onChangeCreditValue.bind(this, 'aprice')}
                  value={aprice}
                  fieldType="price"
                  disabled={rateBy !== 'fix'}
                />
                { validationErrors.get('aprice', '').length > 0 ? <HelpBlock>{validationErrors.get('aprice', '')}</HelpBlock> : ''}
              </Col>
            </FormGroup>

            <FormGroup validationState={validationErrors.get('usagev', '').length > 0 ? 'error' : null}>
              <Col sm={2} componentClass={ControlLabel}>Volume</Col>
              <Col sm={10}>
                <Field
                  onChange={this.onChangeCreditValue.bind(this, 'usagev')}
                  value={usagev}
                  fieldType="number"
                  disabled={rateBy !== 'usagev'}
                />
                { validationErrors.get('usagev', '').length > 0 ? <HelpBlock>{validationErrors.get('usagev', '')}</HelpBlock> : ''}
              </Col>
            </FormGroup>

            <FormGroup validationState={validationErrors.get('usaget', '').length > 0 ? 'error' : null}>
              <Col sm={2} componentClass={ControlLabel}>Unit Type</Col>
              <Col sm={10}>
                <select
                  id="usaget"
                  className="form-control"
                  onChange={this.onChangeCreditValue.bind(this, 'usaget')}
                  value={usaget}
                  disabled={rateBy !== 'usagev'}
                >
                  { availableUsageTypes }
                </select>
                { validationErrors.get('usaget', '').length > 0 ? <HelpBlock>{validationErrors.get('usaget', '')}</HelpBlock> : ''}
              </Col>
            </FormGroup>

            <FormGroup validationState={validationErrors.get('rate', '').length > 0 ? 'error' : null}>
              <Col sm={2} componentClass={ControlLabel}>Rate</Col>
              <Col sm={10}>
                <select
                  id="rate"
                  className="form-control"
                  onChange={this.onChangeCreditValue.bind(this, 'rate')}
                  value={rate}
                >
                  { availableRates }
                </select>
                { validationErrors.get('rate', '').length > 0 ? <HelpBlock>{validationErrors.get('rate', '')}</HelpBlock> : ''}
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" onClick={this.props.onClose}>{cancelLabel}</Button>
          <Button bsSize="small" onClick={this.onCreditCharge} bsStyle="primary" >{chargeLabel}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const usageTypes = state.settings.get('usage_types');
  const allRates = state.list.get('all_rates');
  return { usageTypes, allRates };
};

export default connect(mapStateToProps)(Credit);
