import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings, updateSetting, saveSettings } from '../../actions/settingsActions';
import Immutable from 'immutable';
import {Tabs, Tab, Panel} from 'react-bootstrap';

import DateTime from './DateTime';
import CurrencyTax from './CurrencyTax';
import Tenant from './Tenant';
import Security from './Security';
import ActionButtons from '../Elements/ActionButtons';

class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {activeTab : parseInt(this.props.location.query.tab) || 1};

    this.onChangeDatetime = this.onChangeDatetime.bind(this);
    this.onChangeCurrencyTax = this.onChangeCurrencyTax.bind(this);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handleSelectTab = this.handleSelectTab.bind(this);
  }

  handleSelectTab = (key) => {
    this.setState({activeTab:key});
  }

  componentWillMount() {
    this.props.dispatch(getSettings(["pricing", "billrun", "tenant", "shared_secret"]));
  }

  onChangeFieldValue(category, e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(category, id, value));
  }
  
  onChangeDatetime(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting('billrun', id, value));
  }

  onChangeCurrencyTax(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting('pricing', id, value));
  }

  onSave() {
    //save 'BillRun'
    if (this.props.settings.has('billrun')) {
      this.props.dispatch(saveSettings('billrun', this.props.settings));
    }
    //save 'pricing'
    if (this.props.settings.has('pricing')) {
      this.props.dispatch(saveSettings('pricing', this.props.settings));
    }
    // save 'tenant'
    if (this.props.settings.has('tenant')) {
      this.props.dispatch(saveSettings('tenant', this.props.settings));
    }
  }
  
  render() {
    let { settings } = this.props;
    
    let collection = settings.get('collection') || Immutable.Map();
    let datetime = settings.get('billrun') || Immutable.Map();
    let currency_tax = settings.get('pricing') || Immutable.Map();
    let tenant = settings.get('tenant') || Immutable.Map();
    let shared_secret = settings.get('shared_secret', Immutable.Map());

    return (
      <div>
        <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="SettingsTab"
              onSelect={this.handleSelectTab}>
          <Tab title="Company" eventKey={1}>
            <Panel style={{borderTop: 'none'}}>
              <Tenant onChange={this.onChangeFieldValue} data={tenant}/>
            </Panel>
          </Tab>

          <Tab title="Locale" eventKey={2}>
            <Panel style={{borderTop: 'none'}}>
              <DateTime onChange={this.onChangeDatetime} data={datetime}/>
              <CurrencyTax onChange={this.onChangeCurrencyTax} data={currency_tax}/>
            </Panel>
          </Tab>

	  <Tab title="Security" eventKey={3}>
	    <Panel style={{borderTop: 'none'}}>
	      <Security data={shared_secret} />
	    </Panel>
	  </Tab>
	  
        </Tabs>


        <ActionButtons
          onClickSave={this.onSave}
          hideCancel={true}/>

      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    settings: state.settings
  };
}

export default connect(mapStateToProps)(Settings);
