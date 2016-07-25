import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { getAccount, updateAccountField } from '../../actions/accountActions';
import { getSubscribers, getNewSubscriber, updateSubscriberField } from '../../actions/subscribersActions';
import { clearCustomer, saveSubscriber } from '../../actions/customerActions';
import { getSettings } from '../../actions/settingsActions';

import New from './New';
import Edit from './Edit';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class SubscriberEdit extends Component {
  constructor(props) {
    super(props);

    this.onChangeAccountFieldValue = this.onChangeAccountFieldValue.bind(this);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onUnsubscribe = this.onUnsubscribe.bind(this);
    this.onClickNewSubscription = this.onClickNewSubscription.bind(this);
    this.onChangeDateFieldValue = this.onChangeDateFieldValue.bind(this);

    this.state = {
      newCustomer: false
    };
  }

  componentWillMount() {
    const { aid } = this.props.location.query;
    this.props.dispatch(getSettings('subscribers'));
    if (aid) {
      this.setState({newCustomer: false});
      this.props.dispatch(getAccount(aid));
      this.props.dispatch(getSubscribers(aid));
    } else {
      this.setState({newCustomer: true});
      this.props.dispatch(getNewSubscriber());
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearCustomer());
  }

  onChangeTypeaheadFieldValue(id, val) {
    this.props.dispatch(updateSubscriberField(id, val[0].name));
  }
  
  onChangeFieldValue(e) {
    const { value, id } = e.target;
    this.props.dispatch(updateSubscriberField(id, value));
  }
  
  onChangeAccountFieldValue(e) {
    let { value, id } = e.target;
    this.props.dispatch(updateAccountField(id, value));
  }

  onChangeDateFieldValue(section, id, value) {
    this.props.dispatch(updateSubscriberField(section, id, value));
  }

  onUnsubscribe(sid) {
    let r = confirm("Unsubscribe from plan?");
    if (r) console.log(`unsubscribe from plan ${sid}`);
  }

  onSave() {
    const action = this.state.newCustomer ? "new" : this.props.location.query.action;
    this.props.dispatch(saveSubscriber(action, this.props.subscriber));
    if (this.state.aid) {
       this.props.dispatch(getAccount(this.state.aid));
       this.props.dispatch(getSubscribers(this.state.aid));
       this.setState({newCustomer: false});
    } else {
      browserHistory.goBack();
    }
  }

  onCancel() {
    const { aid, newCustomer } = this.state;
    if (aid && newCustomer) {
      this.props.dispatch(getAccount(aid));
      this.setState({newCustomer: false});
      return;
    }
    browserHistory.goBack();
  }

  onClickNewSubscription(aid) {
    this.setState({aid, newCustomer: true});
    this.props.dispatch(getNewSubscriber(aid));
  }
    
  render() {
    const { account, subscribers, subscriber, settings } = this.props;
    const { newCustomer, aid } = this.state;
    const view = this.state.newCustomer ? (<New entity={subscriber} aid={aid} settings={settings} onChange={this.onChangeFieldValue} onChangeTypeaheadField={this.onChangeTypeaheadFieldValue} onChangeDateFieldValue={this.onChangeDateFieldValue} onSave={this.onSave} onCancel={this.onCancel} />) : (<Edit account={account} subscribers={subscribers} settings={settings} onChange={this.onChangeAccountFieldValue} onClickNewSubscription={this.onClickNewSubscription} onSave={this.onSave} onCancel={this.onCancel} />);

    return (
      <div className="SubscriberEdit container">
        <h3>Customer</h3>
        <div className="contents bordered-container">
          { view }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    subscribers: state.subscribers.get('subscribers'),
    subscriber: state.subscribers.get('subscriber'),
    settings: state.settings
  };
}

export default connect(mapStateToProps)(SubscriberEdit);
