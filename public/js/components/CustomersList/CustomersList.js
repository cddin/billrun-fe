import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Pager from '../Pager';
import Filter from '../Filter';
import List from '../List';
import { Button } from "react-bootstrap";

/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';
import { getSettings } from '../../actions/settingsActions';

class CustomersList extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onNewCustomer = this.onNewCustomer.bind(this);
    this.onClickCustomer = this.onClickCustomer.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSort = this.onSort.bind(this);

    this.state = {
      page: 0,
      sort: '',
      size: 10
    };
  }

  componentDidMount() {
    this.props.dispatch(getSettings("subscribers"));
  }

  componentWillUnmount() {
    this.props.dispatch(clearList('customers'));
  }

  buildQuery() {
    return {
      api: "find",
      params: [
        { collection: "subscribers" },
        { size: this.state.size },
        { page: this.state.page },
	{ sort: this.state.sort },
        { query: this.state.filter }
      ]
    };
  }

  onNewCustomer() {
    this.context.router.push({
      pathname: "customer",
      query: { action: "new" }
    });
  }

  onClickCustomer(customer, e) {
    this.context.router.push({
      pathname: "customer",
      query: {
        action: "update",
        aid: customer.get('aid')
      }
    });
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList("customers", this.buildQuery()))
    });
  }

  onFilter(filter) {
    this.setState({filter, page: 0}, () => {
      this.props.dispatch(getList("customers", this.buildQuery()))
    });
  }

  onSort(sort) {
    this.setState({sort}, () => {
      this.props.dispatch(getList('customers', this.buildQuery()))
    });
  }

  render() {
    const { customers, account } = this.props;
    const fields =
      account.filter(field => field.get('show_in_list', false))
             .map(field => {
               return {
                 id: field.get('field_name'),
                 placeholder: field.get('title', field.get('field_name')),
                 sort: true
               };
             })
             .toJS();
    fields.push({ id: "to", placeholder: "To", showFilter: false, display: false, type: "datetime" });

    return (
      <div className="CustomersList">
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                List of all available customers
                <div className="pull-right">
                  <Button bsSize="xsmall" className="btn-primary" onClick={this.onNewCustomer}><i className="fa fa-plus"/>&nbsp;Add New</Button>
                </div>
              </div>
              <div className="panel-body">
                <Filter fields={fields} onFilter={this.onFilter} base={{type: "account", to: {$gt: moment().toISOString()}}} />
                <List items={customers} fields={fields} editField="firstname" edit={true} onClickEdit={this.onClickCustomer} onSort={this.onSort} />
              </div>
            </div>
          </div>
        </div>
        <Pager onClick={this.handlePageClick}
               size={this.state.size}
               count={customers.size || 0} />
      </div>
    );
  }
}

CustomersList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    customers: state.list.get('customers') || [],
    account: state.settings.getIn(['subscribers', 'account', 'fields']) || []
  };
}

export default connect(mapStateToProps)(CustomersList);
