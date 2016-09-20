import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Row, Col, Panel, Tabs, Tab, Button } from 'react-bootstrap';

import {
  clearPlan,
  getPlan,
  savePlan,
  onPlanCycleUpdate,
  onPlanPriceUpdate,
  onPlanTariffAdd,
  onPlanTariffRemove,
  onPlanFieldUpdate } from '../../actions/planActions';
import { savePlanRates } from '../../actions/planProductsActions';

import PlanTab from './PlanTab';
import PlanProductsPriceTab from './PlanProductsPriceTab';
import PlanIncludesTab from './PlanProductsPriceTab';

class PlanSetup extends Component {

  componentWillMount() {
    let { planId } = this.props.location.query;
    if (planId) {
      this.props.getPlan(planId);
    }
  }

  componentWillUnmount() {
    this.props.clearPlan();
  }

  onChangeFieldValue = (path, value) => {
    this.props.onPlanFieldUpdate(path, value)
  }

  onPlanCycleUpdate = (index, value) => {
    this.props.onPlanCycleUpdate(index, value);
  }

  onPlanPriceUpdate = (index, value) => {
    this.props.onPlanPriceUpdate(index, value);
  }

  onPlanTariffAdd = (trail) => {
    this.props.onPlanTariffAdd(trail);
  }

  onPlanTariffRemove = (index) => {
    this.props.onPlanTariffRemove(index);
  }

  handleSave = () => {
    const { plan } = this.props;
    const { action } = this.props.location.query;
    console.log(this.props.plan.toJS());
    this.props.savePlan(plan, action, (res) => {console.log(res)});
    //this.props.dispatch(savePlanRates());
    //browserHistory.goBack();
  }

  handleBack = () => {
    browserHistory.goBack();
  }

  render() {
    const { plan, validator } = this.props;
    const { action } = this.props.location.query;
    const planName = plan.get('name');
    //in update mode wait for plan before render edit screen
    if(action === 'update' && typeof plan.getIn(['_id', '$id']) === 'undefined'){
      return <div>Loading...</div>
    }

    return (
      <Col lg={12}>
        <Tabs defaultActiveKey={1} animation={false} id="SettingsTab" onSelect={this.onSelectTab}>
          <Tab title="Billing Plan" eventKey={1}>
            <Panel>
              <PlanTab plan={plan} mode={action}
                onChangeFieldValue={this.onChangeFieldValue}
                onPlanCycleUpdate={this.onPlanCycleUpdate}
                onPlanPriceUpdate={this.onPlanPriceUpdate}
                onPlanTariffAdd={this.onPlanTariffAdd}
                onPlanTariffRemove={this.onPlanTariffRemove}
                validator={validator}
              />
            </Panel>
          </Tab>
          {/*
          <Tab title="Override Product Price" eventKey={2}>
            <Panel header={ (planName === '') ? 'Override Products Price' : `Override Products Price for plan "${planName}"`}>
              <PlanProductsPriceTab planName={planName}/>
            </Panel>
          </Tab>
          <Tab title="Plan Includes" eventKey={3}>
            <Panel header={ (planName === '') ? 'Set Plan Include Groups' : `Edit Plan "${planName}" Group Includes`}>
              <PlanIncludesTab plan={plan} onChangeFieldValue={this.onChangeFieldValue} onIncludeRemove={this.onIncludeRemove} />
            </Panel>
          </Tab>
          */}
        </Tabs>
        <div style={{marginTop: 12}}>
          <Button onClick={this.handleBack} bsStyle="link" style={{marginRight: 12}} >Cancel</Button>
          <Button onClick={this.handleSave} bsStyle="primary">Save</Button>
        </div>
      </Col>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onPlanCycleUpdate,
    onPlanPriceUpdate,
    onPlanTariffAdd,
    onPlanTariffRemove,
    onPlanFieldUpdate,
    clearPlan,
    savePlan,
    getPlan }, dispatch);
}
function mapStateToProps(state, props) {
  return  {
    plan: state.plan,
    validator: state.validator
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanSetup);