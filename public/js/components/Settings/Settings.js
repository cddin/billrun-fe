import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings, updateSetting, saveSettings } from '../../actions/settingsActions';
import Immutable from 'immutable';

import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import RaisedButton from 'material-ui/RaisedButton';

import DateTime from './DateTime';
import Collections from './Collections';
import CurrencyTax from './CurrencyTax';

import InputProcessorsList from '../InputProcessorsList';
import InputProcessor from '../InputProcessor';

const styles = {
  inkBar: {
    backgroundColor: "#0091FA",
    color: "black"
  },
  tabItem: {
    backgroundColor: "white",
    color: "black"
  },
  tab: {
    color: "#0091FA"
  }
};

class Settings extends Component {
  constructor(props) {
    super(props);

    this.onChangeCollection = this.onChangeCollection.bind(this);
    this.onChangeDatetime = this.onChangeDatetime.bind(this);
    this.onChangeCurrencyTax = this.onChangeCurrencyTax.bind(this);
    this.onSelectInputProcessor = this.onSelectInputProcessor.bind(this);
    this.onCancelInputProcessorEdit = this.onCancelInputProcessorEdit.bind(this);
    this.onSaveEmail = this.onSaveEmail.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSelectTab = this.onSelectTab.bind(this);

    this.state = {
      processor_selected: false,
      hideSave: false
    };
  }

  componentWillMount() {
    this.props.dispatch(getSettings("business_shit"));
  }
  
  onChangeCollection(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(['collection', id], value));
  }

  onChangeDatetime(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(['datetime', id], value));
  }

  onChangeCurrencyTax(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(['currency_tax', id], value));
  }

  onSelectInputProcessor(file_type) {
    this.setState({processor_selected: file_type});
  }

  onCancelInputProcessorEdit() {
    this.setState({processor_selected: false});
  }

  onSaveEmail(email, which) {
    this.props.dispatch(updateSetting(['collection', `invoice_overdue_${which}_email`], email));
  }

  onSave(e) {
    this.props.dispatch(saveSettings(this.props.settings));
  }

  onSelectTab(selected) {
    if (selected === 5) return this.setState({hideSave: true});
    return this.setState({hideSave: false});
  }
  
  render() {
    let { settings } = this.props;
    let collection = settings.get('collection') || Immutable.Map();
    let datetime = settings.get('datetime') || Immutable.Map();
    let currency_tax = settings.get('currency_tax') || Immutable.Map();
    const { processor_selected } = this.state;
    const inputProcessorView = (processor_selected ? <InputProcessor fileType={processor_selected} onCancel={this.onCancelInputProcessorEdit} /> : <InputProcessorsList onSelectInputProcessor={this.onSelectInputProcessor} />);

    return (
      <div>
        <Tabs defaultActiveKey={1} animation={false} id="SettingsTab" onSelect={this.onSelectTab}>
          <Tab title="Date, Time, and Zone" eventKey={1}>
            <DateTime onChange={this.onChangeDatetime} data={datetime} />
          </Tab>
          {/* <Tab title="Payment Gateways" eventKey={2}>Payment Gateways</Tab> */}
          <Tab title="Currency and tax" eventKey={3}>
            <CurrencyTax onChange={this.onChangeCurrencyTax} data={currency_tax} />
          </Tab>
          {/* <Tab title="Collections" eventKey={4}>
          <Collections onChange={this.onChangeCollection} data={collection} onSaveEmail={this.onSaveEmail} />
          </Tab> */}
          <Tab title="Input Processor" eventKey={5}>
            { inputProcessorView }
          </Tab>
        </Tabs>
        {(() => {
           if (this.state.hideSave) return (<span></span>);
           return (
             <div style={{marginTop: 12}}>
               <RaisedButton
                   label="Save"
                   primary={true}
                   onTouchTap={this.onSave} />
             </div>
           );
         })()}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {settings: state.settings};
}

export default connect(mapStateToProps)(Settings);
