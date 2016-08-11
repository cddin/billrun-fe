import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import { updatePlanField, updatePlanRecurringPriceField, getPlan, clearPlan, savePlan, addTariff, removeRecurringPrice } from '../../actions/planActions';
import { getInputProcessors } from '../../actions/inputProcessorActions';
import { savePlanRates } from '../../actions/planProductsActions';

import Plan from './Plan';
import PlanProductsTab from './PlanProductsTab';


class PlanSetup extends Component {
  constructor(props) {
    super(props);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleSaveRtes = this.handleSaveRtes.bind(this);

    this.onAddTariff = this.onAddTariff.bind(this);
    this.onChangeRecurringPriceFieldValue = this.onChangeRecurringPriceFieldValue.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.onChangeDateFieldValue = this.onChangeDateFieldValue.bind(this);
    this.onRemoveRecurringPrice = this.onRemoveRecurringPrice.bind(this);

    this.state = {
      stepIndex: 0,
      finished: 0
    };
  }

  componentWillMount() {
    let { plan_id } = this.props.location.query;
    if (plan_id) {
      this.props.dispatch(getPlan(plan_id));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }

  onChangeFieldValue(e) {
    const { value, id, checked, type } = e.target;
    const { dispatch } = this.props;
    type === "checkbox" ?
                         dispatch(updatePlanField(id, checked)) :
                         dispatch(updatePlanField(id, value));
  }

  onChangeRecurringPriceFieldValue(id, idx, e, val) {
    let value = val ? val : e.target.value;
    const { checked, type } = e.target;
    const { dispatch } = this.props;
    type === "checkbox" ?
                         dispatch(updatePlanRecurringPriceField(id, idx, checked)) :
                         dispatch(updatePlanRecurringPriceField(id, idx, value));
  }

  onAddTariff(e) {
    e.preventDefault();
    this.props.dispatch(addTariff());
  }

  onRemoveRecurringPrice(idx, e) {
    this.props.dispatch(removeRecurringPrice(idx));
  }

  onChangeDateFieldValue(id, value) {
    this.props.dispatch(updatePlanField(id, value));
  }

  handleSave() {
    const { action } = this.props.location.query;
    this.props.dispatch(savePlan(this.props.plan, action, browserHistory));
    //browserHistory.goBack();
  }

  handleSaveRtes() {
    this.props.dispatch(savePlanRates());
  }

  handleBack() {
    browserHistory.goBack();
  }

  render() {
    const { plan, validator } = this.props;
    let planName = plan.get('PlanName');
    return (
      <Tabs defaultActiveKey={2} animation={false} id="SettingsTab" onSelect={this.onSelectTab}>
        <Tab title="Billing Plan" eventKey={1}>
          <div className="PlanSetup container">
            <h3>Billing Plan</h3>
            <div className="contents bordered-container">
              <Plan onChangeFieldValue={this.onChangeFieldValue} onChangeDateFieldValue={this.onChangeDateFieldValue} onChangeRecurringPriceFieldValue={this.onChangeRecurringPriceFieldValue} onAddTariff={this.onAddTariff} onRemoveRecurringPrice={this.onRemoveRecurringPrice} validator={validator} plan={plan} />
            </div>
            <div style={{marginTop: 12, float: "right"}}>
              <FlatButton
                  label="Cancel"
                  onTouchTap={this.handleBack}
                  style={{marginRight: 12}}
              />
              <RaisedButton
                  label='Save'
                  primary={true}
                  onTouchTap={this.handleSave}
              />
            </div>
          </div>
        </Tab>
        <Tab title="Override Product Price" eventKey={2}>
          <div className="product-price container">
            <h3>Override Product Price for plan {planName}</h3>
            <div className="contents bordered-container">
              {planName.length ? <PlanProductsTab planName={planName}/> : null}
            </div>
            <div style={{marginTop: 12, float: "right"}}>
              <FlatButton
                  label="Cancel"
                  onTouchTap={this.handleBack}
                  style={{marginRight: 12}}
              />
              <RaisedButton
                  label='Save'
                  primary={true}
                  onTouchTap={this.handleSaveRtes}
              />
            </div>
          </div>
        </Tab>
      </Tabs>
    );
  }
}

function mapStateToProps(state, props) {
  return  {
    plan: state.plan,
    validator: state.validator
  };
}

export default connect(mapStateToProps)(PlanSetup);
